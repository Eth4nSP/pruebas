<?php

namespace App\Http\Controllers\Docente;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Grupo;
use App\Http\Controllers\Controller;
use function Laravel\Prompts\select;
use App\Http\Controllers\Docente\SesionDocenteController as SesionDocente;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GrupoController extends Controller
{   
    public function actualizarGrupo(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'idGrupo' => 'required|exists:grupo,idGrupo', // Verificar que el grupo exista en la tabla
            'fechaIniGestion' => 'nullable|date', // Se hace nullable para permitir no cambiar este campo si no se pasa en la solicitud
            'fechaLimiteEntregaEmpresa' => 'nullable|date|after_or_equal:fechaIniGestion',
            'fechaLimiteEntregaPlanificacion' => 'nullable|date|after_or_equal:fechaLimiteEntregaEmpresa',
            'fechaFinPlanificacion' => 'nullable|date|after_or_equal:fechaLimiteEntregaPlanificacion',
            'fechaFinGestion' => 'nullable|date|after_or_equal:fechaFinPlanificacion',
        ]);

        // Obtener los datos actuales del grupo
        $grupo = Grupo::find($request->idGrupo);

        // Filtrar los campos que están siendo enviados por la solicitud
        $nuevosDatos = $request->only([
            'fechaIniGestion',
            'fechaLimiteEntregaEmpresa',
            'fechaLimiteEntregaPlanificacion',
            'fechaFinPlanificacion',
            'fechaFinGestion',
        ]);

        // Filtrar solo los campos que han cambiado (es decir, los que están presentes en los datos actuales)
        $actualizar = [];
        foreach ($nuevosDatos as $campo => $valor) {
            if ($grupo->$campo != $valor) {
                $actualizar[$campo] = $valor;
            }
        }

        // Si no hay campos para actualizar, devolver una respuesta con error
        if (empty($actualizar)) {
            return response()->json(['error' => 'No hay cambios para actualizar.'], 400);
        }

        // Actualizar solo los campos que han cambiado
        $grupo->update($actualizar);

        return response()->json(['message' => 'Grupo actualizado correctamente'], 200);
    }

    public function crearGrupoDocente(Request $request)
    {
        $validatedData = $request->validate([
            'numGrupo' => 'required|string',
            'gestionGrupo' => 'required|string|max:10',
            'codigoAcceso' => 'required|string|max:50|unique:grupo,codigoAcceso',
            'descripcion' => 'nullable|string|max:255',
            'fechaIniGestion' => 'required|date',
            'fechaFinGestion' => 'required|date|after:fechaIniGestion',
            'fechaLimiteEntregaEmpresa' => 'required|date|after:fechaIniGestion|before:fechaFinGestion',
            'fechaLimiteEntregaPlanificacion' => 'required|date|after:fechaLimiteEntregaEmpresa|before:fechaFinGestion',
            'fechaFinPlanificacion' => 'required|date|after:fechaLimiteEntregaPlanificacion|before:fechaFinGestion',
        ]);
        try {
            
            DB::beginTransaction();
            
            $idDocente = session('docente.id');
            
            $grupo = new grupo();
            $grupo->idDocente = $idDocente; 
            $grupo->numGrupo = $validatedData['numGrupo'];
            $grupo->gestionGrupo = $validatedData['gestionGrupo'];
            $grupo->codigoAcceso = $validatedData['codigoAcceso'];
            $grupo->descripcion = $validatedData['descripcion'];
            $grupo->fechaIniGestion = $validatedData['fechaIniGestion'];
            $grupo->fechaFinGestion = $validatedData['fechaFinGestion'];
            $grupo->fechaLimiteEntregaEmpresa = $validatedData['fechaLimiteEntregaEmpresa'];
            $grupo->fechaLimiteEntregaPlanificacion = $validatedData['fechaLimiteEntregaPlanificacion'];
            $grupo->fechaFinPlanificacion = $validatedData['fechaFinPlanificacion'];
    
            $grupo->save();
    
            DB::commit();
    
            return response()->json(['message' => 'Grupo creado exitosamente', 'grupo' => $grupo], 201);
        } catch (\Illuminate\Database\QueryException $qe) {
            DB::rollBack();
            Log::error('Error en la base de datos al crear grupo: ' . $qe->getMessage());
            return response()->json(['message' => 'Error en la base de datos.', 'error' => $qe->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error inesperado al crear grupo: ' . $e->getMessage());
            return response()->json(['message' => 'Error inesperado.', 'error' => $e->getMessage()], 500);
        }
    }



    public function obtenerTodosLosGrupos()
    {
        // Consulta para obtener los datos de todos los grupos y los docentes asociados
        $gruposDocentes = DB::table('grupo')
            ->join('docente', 'grupo.idDocente', '=', 'docente.idDocente')
            ->select(
                'grupo.idGrupo',
                'grupo.numGrupo',
                'docente.nombreDocente as nombre',
                'docente.primerApellido as apellidoPaterno',
                'docente.segundoApellido as apellidoMaterno',
                //'grupo.gestionGrupo'
            )->get();

        // Si no se encuentran resultados
        if ($gruposDocentes->isEmpty()) {
            return response()->json(['message' => 'No se encontraron grupos.'], 404);
        }

        return response()->json($gruposDocentes, 200);
    }

    public function obtenerEstudiantesPorGrupo(Request $request)
    {
        // $sesiondocente = new SesionDocente();
        // $idDocente = session('docente.id');
        // if (!$idDocente) {
        //     return response()->json(['message' => 'No se ha encontrado al docente en la sesión.'], 400);
        // }
    
        $idGrupo = $request->input('idGrupo');
        if (!$idGrupo) {
            return response()->json(['message' => 'El parámetro idGrupo no fue enviado.'], 400);
        }
        
        $datosGrupo = DB::table('estudiantesgrupos as eg')
            ->join('grupo as g', 'eg.idGrupo', '=', 'g.idGrupo')
            ->join('estudiante as e', 'eg.idEstudiante', '=', 'e.idEstudiante')
            ->join('docente as d', 'g.idDocente', '=', 'd.idDocente')
            ->leftjoin('estudiantesempresas AS ee', 'eg.idEstudiante', '=', 'ee.idEstudiante')
            ->leftjoin('empresa AS emp', 'ee.idEmpresa', '=', 'emp.idEmpresa')
            ->where('g.idGrupo',"=",   $idGrupo)
            //->where('grupo.gestionGrupo',$gestionGrupo) REEMPLAZAMOS
            //->whereRaw('CURDATE() >= g.fechaIniGestion') // Usamos whereRaw para CURDATE()
            //->whereRaw('CURDATE() <= g.fechaFinGestion') // Usamos whereRaw para CURDATE()
            ->select(
                'g.numGrupo',
                'e.idEstudiante as id',
                'e.nombreEstudiante as nombreEstudiante',
                'e.primerApellido as apellidoPaternoEstudiante',
                'e.segundoApellido as apellidoMaternoEstudiante',
                'emp.nombreEmpresa'
                /*'docente.nombreDocente as nombreDocente', 
                'docente.primerApellido as apellidoPaternoDocente', 
                'docente.segundoApellido as apellidoMaternoDocente'*/
            )
            ->orderBy('e.nombreEstudiante')
            ->get();

    // Si no se encuentran resultados
    if ($datosGrupo->isEmpty()) {
        return response()->json(['message' => 'No se encontraron estudiantes o docentes para este grupo.'], 404);
    }

    return response()->json($datosGrupo, 200);
}



public function obtenerEmpresasPorGrupoYDocente()
    {
        if (!session()->has('docente.id') || !session()->has('docente.gestionGrupo')) {
            return response()->json(['error' => 'Datos de sesión incompletos'], 400);
        }
        
        $resultados = DB::table('estudiantesgrupos AS eg')
            ->join('grupo AS g', 'eg.idGrupo', '=', 'g.idGrupo')
            ->join('docente AS d', 'g.idDocente', '=', 'd.idDocente')
            ->join('estudiantesempresas AS ee', 'eg.idEstudiante', '=', 'ee.idEstudiante')
            ->join('empresa AS emp', 'ee.idEmpresa', '=', 'emp.idEmpresa')
            ->join('estudiante AS e', 'eg.idEstudiante', '=', 'e.idEstudiante')
            ->select('emp.idEmpresa as id','emp.nombreEmpresa', 'emp.nombreLargo', 'g.gestionGrupo', DB::raw('count(eg.idEstudiante) as totalEstudiantes'), 'g.numGrupo')
            ->where('d.idDocente', session('docente.id'))
            ->where('g.idGrupo',session('docente.gestionGrupo'))
            // ->where('g.idGrupo', $request->idGrupo)
            //->where('g.gestionGrupo', $request->gestionGrupo)
            //->whereRaw('CURDATE() >= g.fechaIniGestion') // Usamos whereRaw para CURDATE()
            //->whereRaw('CURDATE() <= g.fechaFinGestion')
            ->where('emp.publicada','=','1')
            ->groupBy('emp.nombreEmpresa', 'emp.nombreLargo', 'emp.idEmpresa', 'g.gestionGrupo', 'g.numGrupo')
            ->orderByDesc('g.gestionGrupo')
            ->orderBy('emp.nombreEmpresa')
            ->orderByDesc('e.nombreEstudiante')
            ->get();


        if ($resultados->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron registros para el grupo y/o gestión especificados.'
            ], 404); // Puedes devolver un código 404 o cualquier otro código de estado
        }

        // Si hay resultados, retornarlos
        return response()->json($resultados,200);
    }

    public function obtenerEmpresasPorGrupoYDocenteEstudiante(Request $request)
    {
        $resultados = DB::table('estudiantesgrupos AS eg')
            ->join('grupo AS g', 'eg.idGrupo', '=', 'g.idGrupo')
            ->join('docente AS d', 'g.idDocente', '=', 'd.idDocente')
            ->join('estudiantesempresas AS ee', 'eg.idEstudiante', '=', 'ee.idEstudiante')
            ->join('empresa AS emp', 'ee.idEmpresa', '=', 'emp.idEmpresa')
            ->join('estudiante AS e', 'eg.idEstudiante', '=', 'e.idEstudiante')
            ->select('emp.idEmpresa as id','emp.nombreEmpresa', 'emp.nombreLargo', 'g.gestionGrupo', DB::raw('count(eg.idEstudiante) as totalEstudiantes'), 'g.numGrupo')
            //->where('g.idGrupo', 'ee.idGrupo')
            ->where('g.idGrupo', $request ->idGrupo)
            //->where('g.gestionGrupo', $request->gestionGrupo)
            ->whereRaw('CURDATE() >= g.fechaIniGestion') // Usamos whereRaw para CURDATE()
            ->whereRaw('CURDATE() <= g.fechaFinGestion')
            ->where('emp.publicada','=','1')
            ->groupBy('emp.nombreEmpresa', 'emp.nombreLargo', 'emp.idEmpresa', 'g.gestionGrupo', 'g.numGrupo')
            ->orderByDesc('g.gestionGrupo')
            ->orderBy('emp.nombreEmpresa')
            ->orderByDesc('e.nombreEstudiante')
            ->get();


        if ($resultados->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron registros para el grupo y/o gestión especificados.'
            ], 404); // Puedes devolver un código 404 o cualquier otro código de estado
        }

        // Si hay resultados, retornarlos
        return response()->json($resultados,200);
    }

    public function getDescripcion($id)
    {
        // Recupera la descripción del curso basado en el ID
        $datosCurso = DB::table('grupo')
            ->join('docente AS d', 'grupo.idDocente', '=', 'd.idDocente')
            ->select(
                'grupo.numGrupo',
                'd.nombreDocente as nombreDocente',
                'd.primerApellido as apellidoPaternoDocente',
                'd.segundoApellido as apellidoMaternoDocente',
                'grupo.descripcion'
            )
            ->where('idGrupo', $id) // Asegúrate de usar solo el nombre de la columna
            ->first(); // Usa first() para obtener un solo resultado

        // Verifica si se encontraron datos
        if (!$datosCurso) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        // Devuelve los datos en formato JSON
        return response()->json($datosCurso);
    }

    public function barraBusquedaEmpresas(Request $request)
    {
        $request->validate([
            'termino' => 'required|string',
            //'idDocente' => 'required|integer'
        ]);

        $termino = $request->input('termino');
        $idDocente = session()->get('docente.id');

        $busqueda = DB::table('estudiantesgrupos AS eg')
            ->join('grupo AS g', 'eg.idGrupo', '=', 'g.idGrupo')
            ->join('docente AS d', 'g.idDocente', '=', 'd.idDocente')
            ->join('estudiantesempresas AS ee', 'eg.idEstudiante', '=', 'ee.idEstudiante')
            ->join('empresa AS emp', 'ee.idEmpresa', '=', 'emp.idEmpresa')
            ->join('estudiante AS e', 'eg.idEstudiante', '=', 'e.idEstudiante')
            ->select('emp.nombreEmpresa', 'emp.nombreLargo', 'g.gestionGrupo', DB::raw('COUNT(eg.idEstudiante) AS totalEstudiantes'), 'g.numGrupo')
            ->where('emp.nombreEmpresa', 'like', "%$termino%") // Usar el término proporcionado
            ->where('d.idDocente', $idDocente) // Usar el ID del docente proporcionado
            ->groupBy('emp.nombreEmpresa', 'emp.nombreLargo', 'g.gestionGrupo', 'g.numGrupo')
            ->orderByDesc('g.gestionGrupo')
            ->orderBy('emp.nombreEmpresa')
            ->get();
        if (!$busqueda) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
        return response()->json($busqueda);
    }

    public function barraBusquedaEstudiante(Request $request)
    {
        $request->validate([
            'idGrupo' => 'required|integer',
            'gestionGrupo' => 'required|string',
            'termino' => 'required|string'
        ]);
        $valor = $request->input('termino');
        $idGrupo = $request->input('idGrupo');
        $gestionGrupo = $request->input('gestionGrupo');
        /*if($valor->isEmpty()){
            return $this -> obtenerEstudiantesPorGrupo($request -> idGrupo,$request -> gestionGrupo);
        }*/
        // Consulta para obtener todos los estudiantes y el docente del grupo
        $datosGrupo = DB::table('estudiantesgrupos')
            ->join('grupo', 'estudiantesgrupos.idGrupo', '=', 'grupo.idGrupo')
            ->join('estudiante', 'estudiantesgrupos.idEstudiante', '=', 'estudiante.idEstudiante')
            ->join('docente', 'grupo.idDocente', '=', 'docente.idDocente')
            ->join('estudiantesempresas AS ee', 'estudiantesgrupos.idEstudiante', '=', 'ee.idEstudiante')
            ->join('empresa AS emp', 'ee.idEmpresa', '=', 'emp.idEmpresa')
            ->where('estudiante.nombreEstudiante', 'like', "%$valor%")
            ->where('grupo.idGrupo', "=",   $request->idGrupo)
            ->where('grupo.gestionGrupo', $request->gestionGrupo)
            ->select(
                //'grupo.numGrupo', 
                'estudiante.nombreEstudiante as nombreEstudiante',
                'estudiante.primerApellido as apellidoPaternoEstudiante',
                'estudiante.segundoApellido as apellidoMaternoEstudiante',
                'emp.nombreEmpresa'
                /*'docente.nombreDocente as nombreDocente', 
                'docente.primerApellido as apellidoPaternoDocente', 
                'docente.segundoApellido as apellidoMaternoDocente'*/
            )
            ->get();

        // Si no se encuentran resultados
        if (empty(trim($valor))) {
            return $this->obtenerEstudiantesPorGrupo( $request);
        }

        return response()->json($datosGrupo, 200);
    }

    public function darDeBaja(Request $request)
    {
        $request->validate([
            'idGrupo' => 'required|integer',
            'idEstudiante' => 'required|integer',
        ]);

        // Realizar la eliminación después de aplicar la condición 'where'
        $idBaja = DB::table('estudiantesgrupos')
            ->where('idGrupo', $request->idGrupo)  // Condición para el grupo
            ->where('idEstudiante', $request->idEstudiante)  // Condición para el estudiante
            ->delete();

        // Verificar si se eliminó alguna fila
        if ($idBaja) {
            return response()->json(['success' => 'Estudiante dado de baja exitosamente'], 200);
        } else {
            return response()->json(['error' => 'No se pudo dar de baja al estudiante'], 400);
        }
    }

    public function getEmpresasPorGrupo($idGrupo)
    {
        try {
            // Encuentra el grupo y obtén las empresas únicas asociadas
            $grupo = Grupo::findOrFail($idGrupo);

            // Obtenemos las empresas relacionadas a través de estudiantes y eliminamos duplicados
            $empresas = $grupo->estudiantes()
                ->with('empresas') // Carga las empresas de cada estudiante
                ->get()
                ->pluck('empresas') // Accede a la relación empresas
                ->flatten() // Aplana la colección de colecciones
                ->unique('idEmpresa') // Elimina duplicados basados en idEmpresa
                ->map(function ($empresa) {
                    // Cambiar el nombre de 'idEmpresa' a 'id'
                    $empresa->id = $empresa->idEmpresa;
                    unset($empresa->idEmpresa); // Elimina el campo 'idEmpresa' original
                    return $empresa;
                })
                ->values(); // Reindexa los resultados

            return response()->json($empresas, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las empresas: ' . $e->getMessage()], 500);
        }
    }

}
