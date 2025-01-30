<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Asegúrate de importar la clase Request
use Illuminate\Http\JsonResponse; // Para las respuestas JSON
use App\Models\Planificacion; // Importa tu modelo Planificacion
use App\Models\Sprint; // Importa tu modelo Sprint
use App\Models\Empresa; // Asegúrate de importar el modelo Empresa
use App\Models\Semana; // Asegúrate de importar el modelo Empresa
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Exception;
//use App\Http\Controllers\Docente\SesionDocenteController as docenteSesion;

class PlanificacionController extends Controller
{
    public function planificacionAceptadas(): JsonResponse
    {
        // Obtener el ID del docente desde la sesión
        $idDocente = session('docente.id');
    
        // Consultar empresas y sus planificaciones aceptadas relacionadas con el docente
        $empresas = DB::table('empresa as e')
            ->join('estudiantesempresas as em', 'e.idEmpresa', '=', 'em.idEmpresa')
            ->join('estudiante as est', 'est.idEstudiante', '=', 'em.idEstudiante')
            ->join('estudiantesgrupos as eg', 'eg.idEstudiante', '=', 'est.idEstudiante')
            ->join('grupo as g', 'g.idGrupo', '=', 'eg.idGrupo')
            ->join('planificacion as p', 'e.idEmpresa', '=', 'p.idEmpresa')
            ->select(
                'e.idEmpresa',
                'e.nombreEmpresa',
                'e.nombreLargo',
                'p.idPlanificacion',
                'p.aceptada',
                DB::raw('(SELECT COUNT(*) FROM sprint WHERE sprint.idPlanificacion = p.idPlanificacion) as numeroSprints')
            )
            ->where('g.idDocente', '=', $idDocente)
            ->where('p.aceptada', '=', 1) // Filtrar solo planificaciones aceptadas
            ->where('g.idGrupo',session('docente.gestionGrupo'))
            ->orderBy('p.fechaEntrega', 'desc') // Ordenar por fecha de entrega más reciente
            ->groupBy('e.idEmpresa', 'e.nombreEmpresa', 'e.nombreLargo', 'p.idPlanificacion', 'p.aceptada')
            ->get();
    
        // Formatear los resultados
        $data = $empresas->map(function ($empresa) {
            return [
                'id' => $empresa->idEmpresa,
                'nombreEmpresa' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'aceptada' => $empresa->aceptada,
                'numeroSprints' => $empresa->numeroSprints,
            ];
        });
    
        // Retornar los datos en formato JSON
        return response()->json($data);
    }
    
    public function planificacionesSinValidar(): JsonResponse
    {
        $docenteId = session('docente.id'); // ID del docente en sesión
    
        // Obtener empresas con sus planificaciones no aceptadas y publicadas
        $empresas = DB::table('empresa as e')
            ->join('estudiantesempresas as em', 'e.idEmpresa', '=', 'em.idEmpresa')
            ->join('estudiante as est', 'est.idEstudiante', '=', 'em.idEstudiante')
            ->join('estudiantesgrupos as eg', 'eg.idEstudiante', '=', 'est.idEstudiante')
            ->join('grupo as g', 'g.idGrupo', '=', 'eg.idGrupo')
            ->join('planificacion as p', 'e.idEmpresa', '=', 'p.idEmpresa')
            ->select(
                'e.idEmpresa',
                'e.nombreEmpresa',
                'e.nombreLargo',
                'p.idPlanificacion',
                'p.aceptada',
                'p.publicada',
                DB::raw('(SELECT COUNT(*) FROM sprint WHERE sprint.idPlanificacion = p.idPlanificacion) as numeroSprints')
            )
            ->where('g.idGrupo',session('docente.gestionGrupo'))
            ->where('g.idDocente', '=', $docenteId)
            ->where(function ($query) {
                $query->whereNull('p.aceptada')
                      ->orWhere('p.aceptada', '=', 0);
            })
            ->where('p.publicada', '=', 1)
            ->groupBy('e.idEmpresa', 'e.nombreEmpresa', 'e.nombreLargo', 'p.idPlanificacion', 'p.aceptada', 'p.publicada')
            ->get();
    
        // Formatear los datos para la respuesta
        $data = $empresas->map(function ($empresa) {
            return [
                'id' => $empresa->idEmpresa,
                'nombreEmpresa' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'aceptada' => $empresa->aceptada,
                'numeroSprints' => $empresa->numeroSprints,
            ];
        });
    
        // Retornar la respuesta JSON
        return response()->json($data);
    }
    
    /*public function planificacionesParaModificar(): JsonResponse
    {
        // ! ya no tiene valor porque la ing dijo  que no era necesario
        $empresas = Empresa::all();
        $data = [];
        foreach ($empresas as $empresa) {
            // Obtener la planificación de la empresa
            $planificacion = Planificacion::where('idEmpresa', $empresa->idEmpresa)
                ->first();
    
            if ($planificacion) {
                // Si la planificación existe y fue rechazada o no publicada, guarda sus datos
                if ($planificacion->publicada === 0 && $planificacion->aceptada !== 1) {
                    $data[] = [
                        'id' => $empresa->idEmpresa,
                        'nombreEmpresa' => $empresa->nombreEmpresa,
                        'nombreLargo' => $empresa->nombreLargo,
                        'idEmpresa' => $planificacion->idEmpresa,
                        'aceptada' => $planificacion->aceptada,
                        'numeroSprints' => $planificacion->sprints->count(),
                        'tienePlanificacion' => true,
                    ];
                }
            } else {
                // Si la empresa no tiene planificación, también la incluimos
                $data[] = [
                    'id' => $empresa->idEmpresa,
                    'nombreEmpresa' => $empresa->nombreEmpresa,
                    'nombreLargo' => $empresa->nombreLargo,
                    'idEmpresa' => $empresa->idEmpresa,
                    'aceptada' => null,
                    'numeroSprints' => 0,
                    'tienePlanificacion' => false,
                ];
            }
        }
    
        // Retornar la respuesta JSON con los datos de empresas
        return response()->json($data);
    }*/
    public function planificacionesParaModificar(): JsonResponse
    {
    // Obtener todas las empresas junto con su planificación, si existe

    $docenteId = session('docente.id'); // ID del docente en sesión
    
        // Obtener empresas con sus planificaciones no aceptadas y publicadas
        $empresas = DB::table('empresa as e')
            ->join('estudiantesempresas as em', 'e.idEmpresa', '=', 'em.idEmpresa')
            ->join('estudiante as est', 'est.idEstudiante', '=', 'em.idEstudiante')
            ->join('estudiantesgrupos as eg', 'eg.idEstudiante', '=', 'est.idEstudiante')
            ->join('grupo as g', 'g.idGrupo', '=', 'eg.idGrupo')
            ->join('planificacion as p', 'e.idEmpresa', '=', 'p.idEmpresa')
            ->select(
                'e.idEmpresa',
                'e.nombreEmpresa',
                'e.nombreLargo',
                'p.idPlanificacion',
                'p.aceptada',
                'p.publicada',
                DB::raw('(SELECT COUNT(*) FROM sprint WHERE sprint.idPlanificacion = p.idPlanificacion) as numeroSprints')
            )
            ->where('g.idDocente', '=', $docenteId)
            ->where('g.idGrupo',session('docente.gestionGrupo'))
            ->where(function ($query) {
            $query->where('p.publicada', '=', 0)
                  ->where('p.aceptada', '!=', 1)
                  ->orWhereNull('p.idPlanificacion');
        })
        ->groupBy('e.idEmpresa', 'e.nombreEmpresa', 'e.nombreLargo', 'p.idPlanificacion', 'p.aceptada', 'p.publicada')
        ->get();

    // Formatear los datos para la respuesta
    $data = $empresas->map(function ($empresa) {
        return [
            'id' => $empresa->idEmpresa,
            'nombreEmpresa' => $empresa->nombreEmpresa,
            'nombreLargo' => $empresa->nombreLargo,
            'idEmpresa' => $empresa->idEmpresa,
            'aceptada' => $empresa->aceptada,
            'numeroSprints' => $empresa->numeroSprints ?: 0, // Si no hay planificación, es 0
            'tienePlanificacion' => $empresa->idPlanificacion !== null,
        ];
    });

    // Retornar la respuesta JSON
    return response()->json($data);
}

    
   /* public function planificacionesSinPublicar(): JsonResponse
    {
        // ! ya no sirve, ya no es necesario
        // Obtener todas las empresas, en el futuro debera filtrar las empresas por docente
        $empresas = Empresa::all();
        $data = [];
        foreach ($empresas as $empresa) {
            // Obtener la planificación de la empresa
            $planificacion = Planificacion::where('idEmpresa', $empresa->idEmpresa)
                ->first();

            // Verificar si la planificación existe y si fue rechazada
            if ($planificacion && $planificacion->publicada === 0 && $planificacion->aceptada !== 1) {
                // Si la planificación existe y fue rechazada, guarda sus datos
                $data[] = [
                    'id' => $planificacion->idPlanificacion,
                    'nombreEmpresa' => $empresa->nombreEmpresa,
                    'nombreLargo' => $empresa->nombreLargo,
                    'idEmpresa' => $planificacion->idEmpresa,
                    'aceptada' => $planificacion->aceptada,
                    'numeroSprints' => $planificacion->sprints->count(), // Contar el número de sprints, innecesario
                ];
            }
        }

        // Retornar la respuesta JSON con los datos de empresas aceptadas
        return response()->json($data);
    }*/

    public function planificacionesSinPublicar(): JsonResponse
    {
        // Obtener empresas con planificaciones no publicadas y no aceptadas
        $docenteId = session('docente.id'); // ID del docente en sesión
        
        // Obtener empresas con sus planificaciones no aceptadas y publicadas
        $empresas = DB::table('empresa as e')
            ->join('estudiantesempresas as em', 'e.idEmpresa', '=', 'em.idEmpresa')
            ->join('estudiante as est', 'est.idEstudiante', '=', 'em.idEstudiante')
            ->join('estudiantesgrupos as eg', 'eg.idEstudiante', '=', 'est.idEstudiante')
            ->join('grupo as g', 'g.idGrupo', '=', 'eg.idGrupo')
            ->join('planificacion as p', 'e.idEmpresa', '=', 'p.idEmpresa')
            ->select(
                'e.idEmpresa',
                'e.nombreEmpresa',
                'e.nombreLargo',
                'p.idPlanificacion',
                'p.aceptada',
                'p.publicada',
                DB::raw('(SELECT COUNT(*) FROM sprint WHERE sprint.idPlanificacion = p.idPlanificacion) as numeroSprints')
            )
            ->where('g.idDocente', '=', $docenteId)
            ->where('p.publicada', '=', 0)
            ->where('p.aceptada', '!=', 1)
            ->where('g.idGrupo',session('docente.gestionGrupo'))
            ->whereNotNull('p.idPlanificacion') // Filtramos solo las empresas con planificación
            ->get();
    
        // Agrupar los datos por empresa
        $data = $empresas->groupBy('idEmpresa')->map(function ($group) {
            // Tomamos el primer elemento del grupo para los datos de la empresa
            $empresa = $group->first();
            
            // Contamos el número de sprints (el número de sprints es el mismo para todas las planificaciones de una empresa)
            $numeroSprints = $group->sum('numeroSprints');
    
            return [
                'id' => $empresa->idPlanificacion,
                'nombreEmpresa' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'idEmpresa' => $empresa->idEmpresa,
                'aceptada' => $empresa->aceptada,
                'numeroSprints' => $numeroSprints ?: 0, // Si no hay sprints, es 0
            ];
        });
    
        // Retornar la respuesta JSON
        return response()->json($data);
    }
    


    public function show($idEmpresa): JsonResponse
    {
        // * Devuelve los datos necesarios de una empresa
        // Verificar si la empresa existe
        $empresa = Empresa::find($idEmpresa);

        if (!$empresa) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Obtener la planificación de la empresa si existe
        $planificacion = Planificacion::with(['empresa', 'sprints'])
            ->where('idEmpresa', $idEmpresa)
            ->first();

        if (!$planificacion) {
            // Si no hay planificación, devolver datos por defecto, indicando que en realidad no se tiene planificacion
            return response()->json([
                'message' => 'La empresa no envió su planificación aún.',
                'idEmpresa' => $empresa->idEmpresa,
                'idPlanificacion' => -1,
                'aceptada' => null,
                'publicada' => null,
                'comentariopublico' => null,
                'sprints' => [
                    ['idSprint' => null, 'fechaIni' => '2025-02-05', 'fechaFin' => '2025-02-12', 'cobro' => 100, 'fechaEntrega' => '2025-02-12', 'entregables' => [['descripcionEntregable' =>'entregable de ejemplo']]],
                ],  // Array de sprints con 1 fila de ejemplo
            ], 200);  // Código 200 ya que la empresa existe
        }


        // Si la planificación existe, devolver los datos correspondientes
        $data = [
            'idPlanificacion' => $planificacion->idPlanificacion,
            'idEmpresa' => $planificacion->idEmpresa,
            'aceptada' => $planificacion->aceptada,
            'publicada' => $planificacion->publicada,
            'fechaEntrega' => $planificacion->fechaEntrega,
            'comentariopublico' => $planificacion->comentariopublico,
            'comentarioprivado' => $planificacion->comentarioprivado,
            'sprints' => $planificacion->sprints->map(function ($sprint) {
                return [
                    'idSprint' => $sprint->idSprint,
                    'numeroSprint'=> $sprint->numeroSprint,
                    'fechaIni' => $sprint->fechaIni,
                    'fechaFin' => $sprint->fechaFin,
                    'cobro' => $sprint->cobro,
                    'fechaEntrega' => $sprint->fechaEntrega,
                    'comentariodocente' => $sprint->comentariodocente,
                    'entregables' => $sprint->entregables->map(function ($entregable){
                        return [
                            'descripcionEntregable' =>  $entregable->descripcionEntregable,
                        ];
                    })->toArray()
                ];
            })->toArray()
        ];

        // Retornar la respuesta JSON
        return response()->json($data);
    }
    public function getComentario($idPlanificacion): JsonResponse
    {
        // ! Creo que ya no sirve
        $planificacion = Planificacion::find($idPlanificacion);

        if (!$planificacion) {
            return response()->json(['error' => 'Planificación no encontrada para esta empresa'], 404);
        }


        $data = [
            'comentariopublico' => $planificacion->comentariodocente ?? null,
            'fechaEntrega' => $planificacion->fechaEntrega
        ];

        // Retornar la respuesta JSON
        return response()->json($data);
    }

    
    public function addRevision(Request $request)
    {
        // * logica para añadir un comentario al rechazar una planificacion
        try {
            // validar datos
            $validator = Validator::make($request->all(), [
                'idEmpresa' => 'required|integer',
                'comentariopublico' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Los datos proporcionados no son válidos.',
                    'errors' => $validator->errors()
                ], 422);
            }
            $validatedData = $validator->validated();
            //anadir comentario grupal, comentario privado y nota, 
            //verificar que la planificacion de la empresa existe
            $planificacion = Planificacion::where('idEmpresa', $validatedData['idEmpresa'])->first();
            if (!$planificacion) {
                return response()->json([
                    'message' => 'No se encontró la planificación para la empresa especificada.'
                ], 404);
            }
            // Añadir comentario del docente
            if (isset($validatedData['comentariopublico'])) {
                $planificacion->comentariopublico = $validatedData['comentariopublico'];
            }
            // Guardar los cambios
            $planificacion->save();
            // devolver respuesta exitosa
            return response()->json([
                'message' => 'Revisión guardada exitosamente.'
            ], 200);
        } catch (Exception $e) {
            // Capturar otros errores
            return response()->json([
                'message' => 'Hubo un error al procesar la solicitud.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function validar(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'idEmpresa' => 'required|integer',
            'fechaIni' => 'required|date',
            'fechaFin' => 'required|date|after:fechaIni',
        ]);

        // Buscar la planificación
        $planificacion = Planificacion::where('idEmpresa', $validatedData['idEmpresa'])->first();

        if ($planificacion === null) {
            return response()->json(['error' => 'Planificación no encontrada para esta empresa'], 404);
        } else {
            // Actualizar el estado de la planificación
            $planificacion->aceptada = 1;
            $planificacion->publicada = 1;
            $planificacion->save();

            
            // Definir las fechas de inicio y fin
            $fechaIni = Carbon::parse($validatedData['fechaIni']);
            $fechaFin = Carbon::parse($validatedData['fechaFin']);
            
            // Calcular la duración en días y número de semanas
            $duracionEnDias = $fechaIni->diffInDays($fechaFin);
            $numeroSemanas = ceil($duracionEnDias / 7);
            
            // Inicializar el inicio de la primera semana
            $semanaIni = $fechaIni->copy();
            $numeroSemana = 1;

            // Iterar para crear las semanas
            for ($i = 1; $i <= $numeroSemanas; $i++) {
                // Definir el inicio y fin de la semana
                $inicioSemana = $semanaIni->copy();
                $finSemana = $inicioSemana->copy()->endOfWeek(Carbon::SUNDAY);

                // Evitar que la última semana exceda la fecha final
                if ($finSemana->gt($fechaFin)) {
                    $finSemana = $fechaFin;
                }

                // Si la fecha de inicio ya es mayor que la fecha final, salir del ciclo
                if ($inicioSemana->gt($fechaFin)) {
                    break;
                }

                // Crear la semana en la base de datos
                Semana::create([
                    'idPlanificacion' => $planificacion->idPlanificacion,
                    'numeroSemana' => $numeroSemana,
                    'fechaIni' => $inicioSemana->toDateString(),
                    'fechaFin' => $finSemana->toDateString(),
                ]);

                // Aumentar el número de semana
                $numeroSemana++;

                // Establecer la fecha de inicio para la siguiente semana
                $semanaIni = $finSemana->addDay(); // Comenzar el lunes siguiente
            }
        

            // Responder con éxito
            return response()->json([
                'message' => 'Planificación aceptada con éxito',
                'planificacion' => $planificacion,
            ]);
        }
}

    
    public function rechazar(Request $request)
    {
        // * Logica para rechazar una planificacion
        $validatedData = $request->validate([
            'idEmpresa' => 'required|integer',
        ]);

        $planificacion = Planificacion::where('idEmpresa', $validatedData['idEmpresa'])->first();

        if ($planificacion === null) {
            return response()->json(['error' => 'Planificación no encontrada para esta empresa'], 404);
        } else {
            $planificacion->aceptada = 0;
            $planificacion->publicada = 0;
            $planificacion->save();
            return response()->json([
                'message' => 'Planificación rechazada con éxito',
                'planificacion' => $planificacion
            ]);
        }
    }

    public function publicar(Request $request)
    {
        $validatedData = $request->validate([
            'idEmpresa' => 'required|integer',
        ]);

        $planificacion = Planificacion::where('idEmpresa', $validatedData['idEmpresa'])->first();

        if ($planificacion === null) {
            return response()->json(['error' => 'Planificación no encontrada para esta empresa'], 404);
        } else {
            $planificacion->publicada = 1;
            $planificacion->save();
            return response()->json([
                'message' => 'Planificación publicada con éxito',
                'planificacion' => $planificacion
            ]);
        }
    }

    public function guardarPlanificacion(Request $request): JsonResponse
    {
        // * Logica para modificar los datos de una planificacion

        // validar datos
        $validator = Validator::make($request->all(), [
            'aceptada' => 'required|boolean',
            'comentarioDocente' => 'string',
            'idEmpresa' => 'required|integer|exists:empresa,idEmpresa',
        ], [
            'aceptada.required' => 'El campo aceptada es obligatorio.',
            'aceptada.boolean' => 'El campo aceptada debe ser verdadero o falso.',
            'comentarioDocente.string' => 'El comentario del docente debe ser una cadena de texto.',
            'idEmpresa.required' => 'El ID de la empresa es obligatorio.',
            'idEmpresa.integer' => 'El ID de la empresa debe ser un número entero.',
            'idEmpresa.exists' => 'La empresa especificada no existe.',
        ]);
    
        // si no valida, devuelve error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos. Por favor, contacte a un administrador.',
                'errors' => $validator->errors()
            ], 422);
        }
        //consigue los datos validados
        $validatedData = $validator->validated();
        try {
            // verifica que  la planificación exista
            $planificacion = Planificacion::where('idEmpresa', $validatedData['idEmpresa'])->first();

            if ($planificacion !== null) {
                // si la planificacion existe, se actualiza la fechaEntrega y se eliminan los campos de notaplanificacion y comentariodocente
                $planificacion->fechaEntrega = Carbon::now('America/Caracas')->format('Y-m-d H:i:s'); // ajustado a la zona horaria de Bolivia
                $planificacion->comentariopublico = null;
                $planificacion->save();
            } else {
                // si la planificacion no existe, se crea una nueva planificacion
                $planificacion = new Planificacion();
                $planificacion->idEmpresa = $validatedData['idEmpresa'];
                $planificacion->aceptada = null;
                $planificacion->publicada = 0;
                $planificacion->fechaEntrega = Carbon::now('America/Caracas')->format('Y-m-d H:i:s');
                $planificacion->save();
            }
            DB::commit();
            return response()->json([
                'message' => 'La Planificación fue modificada correctamente',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Hubo un error al modificar la Planificación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
