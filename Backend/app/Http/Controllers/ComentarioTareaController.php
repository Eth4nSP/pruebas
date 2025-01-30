<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\ComentarioTarea;
use App\Models\Empresa;
use App\Models\Planificacion;
use App\Models\Sprint;
use App\Models\Semana;
use App\Models\Tarea;
use App\Models\TareaEstudiante;
use App\Models\Estudiante;
use Carbon\Carbon;



class ComentarioTareaController extends Controller
{
    public function seguimientoSemanaElegidaComentarios($idSemana)
    {
        $comentarios = ComentarioTarea::with('estudiante')
            ->where('idSemana', $idSemana)
            ->get();

        return response()->json($comentarios);
    }
    public function agregarComentarios(Request $request)
    {
        // Validación del array de comentarios
        $validated = $request->validate([
            'comentarios' => 'required|array',
            'comentarios.*.idEstudiante' => 'required|exists:estudiante,idEstudiante',
            'comentarios.*.idSemana' => 'required|exists:semana,idSemana',
            'comentarios.*.comentario' => 'required|string|max:255',
        ]);
    
        $comentariosGuardados = [];
    
        // Procesar cada comentario
        foreach ($validated['comentarios'] as $comentarioData) {
            try {
                // Actualizar o crear comentario en una sola operación
                $comentario = ComentarioTarea::updateOrCreate(
                    [
                        'idEstudiante' => $comentarioData['idEstudiante'],
                        'idSemana' => $comentarioData['idSemana'],
                    ],
                    [
                        'comentario' => $comentarioData['comentario'],
                    ]
                );
    
                $comentariosGuardados[] = $comentario; // Agregar comentario procesado
            } catch (\Exception $e) {
                // Capturar errores específicos por comentario
                return response()->json([
                    'error' => 'Error al procesar el comentario para el estudiante: ' . $comentarioData['idEstudiante'] . 
                               ', semana: ' . $comentarioData['idSemana'] . '. Detalles: ' . $e->getMessage()
                ], 400);
            }
        }
    
        // Respuesta exitosa con todos los comentarios procesados
        return response()->json([
            'message' => 'Comentarios procesados exitosamente',
            'data' => $comentariosGuardados,
        ], 200);
    }
    public function seguimientoSemanalEmpresaHastaSemanaActual($idPlanificacion)
    {
        $now = Carbon::now()->startOfDay();  // Establece la hora a las 00:00:00
        $planificacion = Planificacion::where('idPlanificacion', $idPlanificacion)
            ->where('aceptada', true)
            ->where('publicada', true)
            ->first();

        if (!$planificacion) {
            return response()->json(['error' => 'No se encontró planificación aceptada y publicada'], 404);
        }

        // Obtener la empresa asociada a la planificación
        $empresa = $planificacion->empresa;

        if (!$empresa) {
            return response()->json(['error' => 'No se encontró la empresa asociada a la planificación'], 404);
        }

        // Obtener el número total de estudiantes de la empresa
        $numEstudiantes = $empresa->estudiantes()->count();

        // Obtener todas las semanas asociadas a la planificación hasta la fecha actual
        $semanas = Semana::where('idPlanificacion', $planificacion->idPlanificacion)
            ->whereDate('fechaFin', '<', $now)
            ->get();
        // Construir el resultado con los datos básicos y el estado de calificación
        $resultado = $semanas->map(function ($semana) use ($numEstudiantes) {
            $numComentariosTarea = ComentarioTarea::where('idSemana', $semana->idSemana)->count();

            return [
                'idSemana' => $semana->idSemana,
                'numSemana' => $semana->numeroSemana,
                'fechaIni' => $semana->fechaIni,
                'fechaFin' => $semana->fechaFin,
                'calificado' => ($numComentariosTarea === $numEstudiantes),
            ];
        });

        return response()->json($resultado);
    }
    public function getSemanaSeguimiento($idEmpresa, $idSemana)
    {
        // Buscar la semana específica
        $semana = Semana::find($idSemana);

        if (!$semana) {
            return response()->json(['error' => 'Semana no encontrada'], 404);
        }

        // Obtener los estudiantes de la empresa
        $estudiantes = Estudiante::whereHas('empresas', function ($query) use ($idEmpresa) {
            $query->where('estudiantesempresas.idEmpresa', $idEmpresa); // Calificación explícita de la columna
        })->get();

        // Inicializar el resultado
        $resultado = [
            'idSemana' => $semana->idSemana,
            'numSemana' => $semana->numeroSemana,
            'fechaIni' => $semana->fechaIni,
            'fechaFin' => $semana->fechaFin,
            'comentarios' => ComentarioTarea::where('idSemana', $idSemana)->get(),
            'estudiantes' => [],
        ];

        // Procesar tareas y comentarios de cada estudiante
        foreach ($estudiantes as $estudiante) {
            // Obtener tareas asignadas al estudiante para esta semana
            $tareasEstudiante = TareaEstudiante::whereHas('tareas', function ($query) use ($idSemana) {
                $query->where('idSemana', $idSemana);
            })->where('idEstudiante', $estudiante->idEstudiante)
            ->get();

            if ($tareasEstudiante->isEmpty()) {
                // Estudiante sin tareas asignadas
                $resultado['estudiantes'][] = [
                    'idEstudiante' => $estudiante->idEstudiante,
                    'nombre' => $estudiante->nombreEstudiante,
                    'apellido' => $estudiante->primerApellido . ' ' . $estudiante->segundoApellido,
                    'tareas' => []
                ];
            } else {
                // Procesar las tareas del estudiante
                $tareas = $tareasEstudiante->map(function ($tareaEstudiante) {
                    return [
                        'idTarea' => $tareaEstudiante->tareas->idTarea,
                        'nombreTarea' => $tareaEstudiante->tareas->nombreTarea,
                    ];
                });

                $resultado['estudiantes'][] = [
                    'idEstudiante' => $estudiante->idEstudiante,
                    'nombre' => $estudiante->nombreEstudiante,
                    'apellido' => $estudiante->primerApellido . ' ' . $estudiante->segundoApellido,
                    'tareas' => $tareas,
                ];
            }
        }

        return response()->json($resultado);
}

    
    public function getSemanaActualTareas($idEmpresa)
    {
        try {
            $fechaDeLaConsulta = now(); // Fecha actual

            // Recuperar los sprints que cumplan con la condición
            $empresa = Empresa::findOrFail($idEmpresa);

            $sprints = $empresa->sprints()
                ->where('fechaIni', '<=', $fechaDeLaConsulta)
                ->where('fechaFin', '>=', $fechaDeLaConsulta)
                ->with(['semanas' => function ($query) {
                    // Elimina el filtro de fechas para obtener todas las semanas
                    $query->with(['tareas:idSemana,idTarea,nombreTarea']);
                }])->get();


            // Transformar los datos al formato solicitado
            return response()->json($sprints, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }
    public function seguimientoSemanalHastaSemanaActualcomentarios($idEmpresa)
    {
            // Obtener la empresa
            $empresa = Empresa::findOrFail($idEmpresa);

            // Obtener la planificación aceptada y publicada de la empresa
            $planificacion = $empresa->planificaciones()
                ->where('aceptada', true)
                ->where('publicada', true)
                ->first();

            if (!$planificacion) {
                return response()->json(['error' => 'No se encontró planificación aceptada y publicada'], 404);
            }

            // Obtener los sprints de la planificación que cumplen con la condición de fecha
            $sprints = $planificacion->sprints()
                ->where(function ($query) {
                    $query->whereDate('fechaIni', '<=', now())
                        ->whereDate('fechaFin', '>=', now());
                })
                ->orWhereDate('fechaFin', '<', now())
                ->where('idPlanificacion', $planificacion->idPlanificacion)
                ->get();

            $resultado = [];
            $fechaDeLaConsulta = now();

            foreach ($sprints as $sprint) {
                $sprintData = [
                    'idSprint' => $sprint->idSprint,
                    'numSprint' => $sprint->numeroSprint,
                    'semanas' => []
                ];

                // Obtener las semanas del sprint
                $semanas = $sprint->semanas()
                    ->where(function ($query) use ($fechaDeLaConsulta) {
                        $query->whereDate('fechaIni', '<=', $fechaDeLaConsulta)
                            ->whereDate('fechaFin', '>', $fechaDeLaConsulta)
                            ->orWhereDate('fechaFin', '<=', $fechaDeLaConsulta);
                    })
                    ->get();

                foreach ($semanas as $semana) {
                    // Obtener los comentariosTareas para cada semana
                    $comentariosTareas = $semana->comentarioTarea()->get()->map(function ($comentario) {
                        return [
                            'idEstudiante' => $comentario->idEstudiante,
                            'comentario' => $comentario->comentario,
                        ];
                    });

                    $semanaData = [
                        'idSemana' => $semana->idSemana,
                        'numeroSemana' => $semana->numeroSemana,
                        'comentariosTareas' => $comentariosTareas,
                    ];

                    $sprintData['semanas'][] = $semanaData;
                }

                $resultado[] = $sprintData;
            }

        return response()->json($resultado);
    }

}
