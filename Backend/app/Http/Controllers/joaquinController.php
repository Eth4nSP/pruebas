<?php


namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Estudiante;
use App\Models\Semana;
use App\Models\Tarea;
use App\Models\NotaSprint;
use App\Models\Sprint;
use App\Models\Grupo;
use App\Models\EstudiantesGrupos;
use App\Models\EstudiantesEmpresas;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;


class joaquinController extends Controller{

    public function obtenerDatoEst($idEstudiante)
    {
        $relacion = Estudiante::where('idEstudiante', $idEstudiante)->first();
    
        if (!$relacion) {
            return response()->json(['mensaje' => 'Estudiante no encontrado'], 404);
        }
     
        // Verificar si el estudiante está asociado a alguna empresa usando la relación estudiantesEmpresas
        $enEmpresa = $relacion->empresas()->exists() ? 1 : 0;
    
        return response()->json([
            'idEstudiante' => $relacion->idEstudiante,
            'nombreEstudiante' => $relacion->nombreEstudiante,
            'primerApellido' => $relacion->primerApellido,
            'segundoApellido' => $relacion->segundoApellido,
            'enEmpresa' => $enEmpresa, 
        ]);
    }
    
    

    public function obtenerIntegrantesPorEstudiante($idEstudiante)
    {
        // Buscar la relación del estudiante en la tabla de unión para obtener el idEmpresa
        $relacion = EstudiantesEmpresas::where('idEstudiante', $idEstudiante)->first();
    
        if (!$relacion) {
            return response()->json(['mensaje' => 'Estudiante no encontrado en ninguna empresa'], 404);
        }
    
        // Obtener los datos de la empresa
        $empresa = DB::table('empresa')
            ->where('idEmpresa', $relacion->idEmpresa)
            ->select('idEmpresa', 'nombreEmpresa', 'nombreLargo', 'publicada')
            ->first();
    
    
        // Obtener los datos específicos de los estudiantes asociados a esa empresa
        $integrantes = DB::table('estudiante')
            ->join('estudiantesempresas', 'estudiante.idEstudiante', '=', 'estudiantesempresas.idEstudiante')
            ->where('estudiantesempresas.idEmpresa', $relacion->idEmpresa)
            ->select(
                'estudiante.idEstudiante',
                'estudiante.nombreEstudiante',
                'estudiante.primerApellido',
                'estudiante.segundoApellido'
            )
            ->get();
    

        $respuesta = [
                'idEmpresa' => $empresa->idEmpresa,
                'publicada' => $empresa->publicada,
                'nombreEmpresa' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'integrantes' => $integrantes->toArray()
        ];
    
        return response()->json($respuesta);
    }
    
    public function crearEmpresa(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nombreLargo'   => 'required|string|max:255',
            'nombreCorto'   => 'required|string|max:255',
            'estudiante'    => 'required|integer|exists:estudiante,idEstudiante',//Esta parte se tiene que recuperar de la session estudiante 
        ]);

        $estudiante = Estudiante::find($request->estudiante);
            if ($estudiante->empresas()->exists()) { 
                return response()->json([
                'message' => 'El estudiante ya está asociado a otra empresa'
            ], 400);
        }
        
        $nombreLargoError = Empresa::where('nombreLargo', $request->nombreLargo)->first();
        $nombreCortoError = Empresa::where('nombreEmpresa', $request->nombreCorto)->first();

        

        if ($nombreLargoError) {
            return response()->json([
                'message' => 'Ya existe una empresa con ese nombre largo.'
            ], 400);
        } elseif ($nombreCortoError) {
            return response()->json([
                'message' => 'Ya existe una empresa con ese nombre corto.'
            ], 400);
            
        } elseif($request->nombreLargo == $request->nombreCorto){
            return response()->json([
                'message' => 'El nombre largo y corto son los mismos'
            ], 400);

        }
    
        // verifica si el estudiante esta en otra empresa y si esta disponible 
        $estudiante = Estudiante::find($request->estudiante);
            if ($estudiante->empresas()->exists()) { 
                return response()->json([
                'message' => 'El estudiante ya está asociado a otra empresa'
            ], 400);
        }
    
        $empresa = Empresa::create([
            'nombreLargo'    => $request->nombreLargo,
            'nombreEmpresa'  => $request->nombreCorto,
            'publicada'      => '0'
        ]);

        $empresa->estudiantes()->attach($request->estudiante);
    
        return response()->json([
            'message' => 'Empresa creada con éxito',
            'empresa' => $empresa
        ], 201);
    }

    public function actualizarIntegrantes(Request $request, $idEmpresa)
    {
        // Validar los datos recibidos
        $validatedData = $request->validate([
            'integrantes' => 'required|array',
            'integrantes.*' => 'exists:estudiante,idEstudiante'
        ]);

        $empresa = DB::table('empresa')->where('idEmpresa', $idEmpresa)->first();
        if (!$empresa) {
            return response()->json(['mensaje' => 'Empresa no encontrada'], 404);
        }
        if ($empresa->publicada == 1) {
            return response()->json(['mensaje' => 'No se puede modificar la empresa porque ya ha sido publicada'], 403);
        }

        // Actualizar los integrantes de la empresa
        DB::transaction(function () use ($idEmpresa, $validatedData) {
            // Eliminar los registros actuales de estudiantes en esa empresa
            DB::table('estudiantesempresas')->where('idEmpresa', $idEmpresa)->delete();

            // Insertar los nuevos integrantes
            $nuevosIntegrantes = [];
            foreach ($validatedData['integrantes'] as $idEstudiante) {
                $nuevosIntegrantes[] = [
                    'idEmpresa' => $idEmpresa,
                    'idEstudiante' => $idEstudiante
                ];
            }
            DB::table('estudiantesempresas')->insert($nuevosIntegrantes);
        });

        return response()->json(['mensaje' => 'Integrantes actualizados correctamente']);
    }

    public function publicarEmpresaPorEstudiante($idEstudiante)
    {
        // Buscar la empresa asociada al estudiante
        $empresa = DB::table('estudiantesempresas')
            ->join('empresa', 'estudiantesempresas.idEmpresa', '=', 'empresa.idEmpresa')
            ->where('estudiantesempresas.idEstudiante', $idEstudiante)
            ->select('empresa.idEmpresa', 'empresa.publicada')
            ->first();
        
        // Verificar si el estudiante está asociado a alguna empresa
        if (!$empresa) {
            return response()->json(['mensaje' => 'El estudiante no está asociado a ninguna empresa'], 404);
        }

        // Verificar si la empresa ya está publicada
        if ($empresa->publicada == 1) {
            return response()->json(['mensaje' => 'La empresa ya ha sido publicada'], 409);
        }

        // Actualizar el campo publicada a 1
        DB::table('empresa')
            ->where('idEmpresa', $empresa->idEmpresa)
            ->update(['publicada' => 1]);

        return response()->json(['mensaje' => 'Empresa publicada correctamente']);
    }
    
    public function obtenerEstudiantesSinEmpresa($idEstudiante)
    {
        // Obtener el grupo al que pertenece el estudiante proporcionado
        $grupo = EstudiantesGrupos::where('idEstudiante', $idEstudiante)
            ->select('idGrupo')
            ->first();
    
        if (!$grupo) {
            return response()->json(['error' => 'El estudiante no pertenece a ningún grupo.'], 404);
        }
    
        // Obtener estudiantes que no están asociados a ninguna empresa y pertenecen al mismo grupo
        $resultado = EstudiantesGrupos::select(
                'estudiante.idEstudiante',
                'estudiante.nombreEstudiante',
                'estudiante.primerApellido',
                'estudiante.segundoApellido'
            )
            ->join('estudiante', 'estudiantesgrupos.idEstudiante', '=', 'estudiante.idEstudiante') // Relación con la tabla de estudiantes
            ->leftJoin('estudiantesempresas AS ee', 'ee.idEstudiante', '=', 'estudiante.idEstudiante') // Relación con empresas
            ->where('estudiantesgrupos.idGrupo', $grupo->idGrupo) // Filtrar por el mismo grupo
            ->whereNull('ee.idEmpresa') // Asegurar que no tienen empresa
            ->where('estudiante.idEstudiante', '<>', $idEstudiante) // Excluir al estudiante proporcionado
            ->orderBy('estudiante.nombreEstudiante')
            ->get();
    
        return response()->json($resultado, 200);
    }
    



    public function notaSprintV2($empresa, $semana)
    {   
        // $empresa = $request->input('empresa');
        // $semana = $request->input('numeroSprint');
    
        $resultado = DB::table('estudiantesempresas as ep')
            ->join('estudiante as e', 'ep.idEstudiante', '=', 'e.idEstudiante')
            ->leftJoin('planificacion as p', function($join) use ($empresa) {
                $join->on('p.idEmpresa', '=', 'ep.idEmpresa')
                     ->where('p.idEmpresa', '=', $empresa);
            })
            ->leftJoin('sprint as sp', function($join) use ($semana) {
                $join->on('sp.idPlanificacion', '=', 'p.idPlanificacion')
                     ->where('sp.numeroSprint', '=', $semana);
            })
            ->leftJoin('semana as s', 'sp.idSprint', '=', 's.idSprint')
            ->leftJoin('tarea as t', 't.idSemana', '=', 's.idSemana')
            ->leftJoin('notasprint as np', function($join) {
                $join->on('np.idSprint', '=', 'sp.idSprint')
                     ->on('np.idEstudiante', '=', 'ep.idEstudiante');
            })
            ->leftJoin('tareasestudiantes as te', function($join) {
                $join->on('te.idTarea', '=', 't.idTarea')
                     ->on('te.idEstudiante', '=', 'ep.idEstudiante');
            })
            ->select('t.nombreTarea', 
                     DB::raw("CONCAT(e.nombreEstudiante, ' ', e.primerApellido, ' ', e.segundoApellido) as nombre_completo"),
                     'np.nota', 
                     'np.comentario',
                     'e.idEstudiante'
            )
            ->where('ep.idEmpresa', $empresa)
            ->get();
    
        // Agrupar los resultados por estudiante
        $resultadoAgrupado = $resultado->groupBy('nombre_completo')->map(function($items) {
            return [
                'tareas' => $items->pluck('nombreTarea')->filter()->toArray(),  // Filtrar tareas nulas
                'nota' => $items->first()->nota,
                'comentario' => $items->first()->comentario,
                'id' => $items->first()->idEstudiante
            ];
        });
    
        return $resultadoAgrupado;
    }
    
            // Actualizar el campo 'disponible' del estudiante para que ya no sean selecionables en modificar 
        // $estudiante->disponible = '0'; 
        // $estudiante->save();

    
    public function sprintsSemanasPorNumero(int $numeroSprint): JsonResponse
    {
        // Obtener el sprint por numeroSprint
        $sprint = Sprint::where('numeroSprint', $numeroSprint)->first(['idSprint', 'numeroSprint']);
    
        // Verificar si el sprint existe
        if (!$sprint) {
            return response()->json(['error' => 'Sprint no encontrado'], 404);
        }
    
        // Obtener los datos de las semanas asociadas al sprint
        $semanas = Semana::where('idSprint', $sprint->idSprint)->get(['idSemana', 'numeroSemana']);
    
        // Preparar la respuesta
        $response = [
            'idSprint' => $sprint->idSprint,
            'numeroSprint' => $sprint->numeroSprint,
            'semanas' => []
        ];
    
        // Iterar sobre cada semana para obtener las tareas
        foreach ($semanas as $semana) {
            // Obtener las tareas asociadas a la semana
            $tareas = Tarea::where('idSemana', $semana->idSemana)->get([
                'idTarea',
                'idSemana',
                'textoTarea',
                'nombreTarea'
            ]);
    
            // Agregar la semana, su número y sus tareas al response
            $response['semanas'][] = [
                'idSemana' => $semana->idSemana,
                'numeroSemana' => $semana->numeroSemana,
                'tareas' => $tareas
            ];
        }
    
        // Devolver la respuesta en formato JSON
        return response()->json($response);
    }
        


    public function estaMatriculado($idEstudiante){

        $existeRelacion = EstudiantesGrupos::where('idEstudiante', $idEstudiante)->exists();
        return response()->json([
            'enGrupo' => $existeRelacion ? 1 : 0,
        ]);

    }

}