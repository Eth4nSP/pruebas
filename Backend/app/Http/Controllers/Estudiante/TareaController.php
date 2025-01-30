<?php

namespace App\Http\Controllers\Estudiante;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\Tarea;
use App\Models\Estudiante;
use App\Models\ArchivoTarea;
use App\Models\TareaEstudiante;
use App\Models\Semana;
use App\Models\Sprint;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use App\Models\Empresa;
use App\Models\Planificacion;
class TareaController extends Controller
{
    public function obtenerTarea($idTarea, $idEmpresa)
    {
        // Ensure $idEmpresa is an array
        $idEmpresa = is_array($idEmpresa) ? $idEmpresa : [$idEmpresa];

        // Obtener la tarea
        $tarea = Tarea::find($idTarea);

        if (!$tarea) {
            return response()->json(['error' => 'Tarea no encontrada'], 404);
        }

        // Obtener los estudiantes de la tarea
        $estudiantes = DB::table('estudiante')
            ->join('tareasestudiantes', 'tareasestudiantes.idEstudiante', '=', 'estudiante.idEstudiante')
            ->select('estudiante.idEstudiante', 'nombreEstudiante', 'primerApellido', 'segundoApellido')
            ->where('tareasestudiantes.idTarea', $idTarea)
            ->get();

        // Obtener todos los estudiantes de las mismas empresas
        $companerosDeEmpresa = DB::table('estudiante')
            ->join('estudiantesempresas', 'estudiantesempresas.idEstudiante', '=', 'estudiante.idEstudiante')
            ->whereIn('estudiantesempresas.idEmpresa', $idEmpresa)
            ->select('estudiante.idEstudiante', 'nombreEstudiante', 'primerApellido', 'segundoApellido')
            ->get();

        // Formar la respuesta
        $respuesta = [
            'idSemana' => $tarea->idSemana,
            'nombreTarea' => $tarea->nombreTarea,
            'comentario' => $tarea->textoTarea,
            'textoTarea' => $tarea->textoTarea,
            'fechaEntrega' => $tarea->fechaEntrega,
            'estudiantes' => $estudiantes,
            'integrantes' => $companerosDeEmpresa,
        ];

        return response()->json($respuesta);
    }



    //************************************ POSTS*************************** */
    public function store(Request $request)
    {
        // Validar la entrada
        $request->validate([
            'idSemana' => 'required|integer',
            'textotarea' => 'required|string',
            'fechentregado' => 'required|date',
            'archivotarea' => 'nullable|array',
            'archivotarea.*' => 'file|mimes:pdf,zip,rar,7z', // Archivos permitidos
        ]);

        // Crear la tarea
        $tarea = Tarea::create([
            'idSemana' => $request->idSemana,
            'comentario' => '',
            'textoTarea' => $request->textotarea,
            'fechaEntrega' => $request->fechentregado,
            'notaTarea' => 0,
        ]);

        // Guardar los archivos en el disco y en la base de datos
        $archivosGuardados = [];
        if ($request->hasFile('archivotarea')) {
            foreach ($request->file('archivotarea') as $archivo) {
                $nombreArchivo = $archivo->getClientOriginalName();
                $rutaArchivo = $archivo->storeAs("public/uploads/{$tarea->idTarea}", $nombreArchivo);

                $archivoTarea = ArchivoTarea::create([
                    'idTarea' => $tarea->idTarea,
                    'archivo' => $rutaArchivo,
                    'nombreArchivo' => $nombreArchivo,
                    'fechaEntrega' => $request->fechentregado,
                ]);

                $archivosGuardados[] = $archivoTarea;
            }
        }

        return response()->json([
            'tarea' => $tarea,
            'archivos' => $archivosGuardados,
        ], 201);
    }

    public function update(Request $request, $idTarea)
    {
        try {
            // Validar los datos de entrada
            $request->validate([
                'textotarea' => 'required|string',
                'responsables' => 'nullable|array',
            ]);

            // Buscar la tarea
            $tarea = Tarea::find($idTarea);
            if (!$tarea) {
                return response()->json(['error' => 'Tarea no encontrada'], 404);
            }

            // Actualizar la descripción de la tarea
            $tarea->textoTarea = $request->input('textotarea');
            $tarea->save();


            // Eliminar responsables actuales de la tarea
            TareaEstudiante::where('idTarea', $idTarea)->delete();

            // Agregar responsables
            if ($request->has('responsables')) {
                foreach ($request->input('responsables') as $responsable) {
                    TareaEstudiante::create([
                        'idTarea' => $idTarea,
                        'idEstudiante' => $responsable['idEstudiante'],
                    ]);
                }
            }

            return response()->json(['message' => 'Tarea actualizada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function crearTarea(Request $request)
    {
        $sprint = $request->input('sprint');
        $semana = $request->input('semana');
        $nombreTarea = $request->input('nombreTarea');

        $resultado = DB::table('tarea as t');
        // ->join('semana as s','s.idSemana',)
    }
    public function getTareasSemana($idEmpresa, $idSemana)
    {
        try {
            // Obtener los datos de la semana directamente
            $semana = Semana::where('idSemana', $idSemana)->first();
    
            if (!$semana) {
                return response()->json([
                    'error' => 'Semana no encontrada.',
                ], 404);
            }
    
            // Obtener tareas asociadas a la semana
            $tareas = Tarea::where('idSemana', $idSemana)
                ->select('idTarea', 'nombreTarea', 'textoTarea', 'fechaEntrega')
                ->get();
    
            // Respuesta final
            return response()->json([
                'idSemana' => $semana->idSemana,
                'numeroSemana' => $semana->numeroSemana,
                'fechaIni' => $semana->fechaIni,
                'fechaFin' => $semana->fechaFin,
                'tareas' => $tareas,
            ], 200);
    
        } catch (\Throwable $e) {
            // Manejo de errores
            return response()->json([
                'error' => 'Error al obtener los datos: ' . $e->getMessage(),
            ], 500);
        }
    }
    


    

    // Actualizar las tareas de una semana específica
    public function createOrUpdateTareas(Request $request)
    {
        // Validar la solicitud
        $validated = $request->validate([
            'idSemana' => 'required|integer',
            'tareas' => 'required|array',
            'tareas.*.idTarea' => 'nullable|integer', // Permitir nulo para nuevas tareas
            'tareas.*.nombreTarea' => 'required|string',
            'tareas.*.textoTarea' => 'nullable|string',
            'tareas.*.fechaEntrega' => 'nullable|date',
        ]);
    
        DB::beginTransaction();
    
        try {
            // Insertar o actualizar en la tabla 'tarea'
            foreach ($validated['tareas'] as $tareaData) {
                Tarea::updateOrCreate(
                    [
                        'idTarea' => $tareaData['idTarea'] ?? null, // Permitir creación de nuevas tareas
                        'idSemana' => $validated['idSemana'],
                    ],
                    [
                        'nombreTarea' => $tareaData['nombreTarea'],
                        'textoTarea' => $tareaData['textoTarea'] ?? null,
                        'fechaEntrega' => $tareaData['fechaEntrega'] ?? null,
                    ]
                );
            }
    
            DB::commit();
    
            return response()->json(['message' => 'Datos insertados o actualizados exitosamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

public function deleteTareas(Request $request)
{
    // Validar la solicitud
    $validated = $request->validate([
        'tareas' => 'required|array',
        'tareas.*.idTarea' => 'required|integer', // Los IDs de las tareas son obligatorios
    ]);

    DB::beginTransaction();

    try {
        // Eliminar tareas especificadas en el array
        foreach ($validated['tareas'] as $tareaData) {
            $tarea = Tarea::where('idTarea', $tareaData['idTarea'])
                          ->first();
            if (!$tarea) {
                throw new \Exception("La tarea con ID {$tareaData['idTarea']} no se encontró en la semana especificada.");
            }
            $tarea->delete();
        }

        DB::commit();

        return response()->json(['message' => 'Tareas eliminadas exitosamente'], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 400);
    }
}


}
