<?php
namespace App\Http\Controllers\HU_listaGruposDeDocente;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Grupo;

class GestionController extends Controller{
    public function visualizarSemestresEstudiante(){
        $idEstudiante = session('estudiante.id');
        $result = DB::table('grupo as g')
        ->join('estudiantesgrupos as eg', 'g.idGrupo','=','eg.idGrupo')
        ->join('estudiante as e','eg.idEstudiante','=','e.idEstudiante')
        ->select('g.idGrupo as id','g.gestionGrupo', 'g.fechaIniGestion', 'g.fechaFinGestion', 'g.numGrupo')
        ->where('e.idEstudiante',$idEstudiante)
        ->get();
        

        return response()->json($result, 200);
    }

    public function visualizarSemestresDocente(){
        $idDocente = session('docente.id');
        $result = DB::table('grupo as g')
        ->join('docente as d', 'g.idDocente','=','d.idDocente')
        ->select('g.idGrupo as id','g.gestionGrupo', 'g.fechaIniGestion', 'g.fechaFinGestion', 'g.numGrupo')
        ->where('d.idDocente',$idDocente)
        ->get();
        return response()->json($result, 200);
    }

    public function guardarGestionSeleccionadaDocente(Request $request){
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'gestionGrupo' => 'required|string' // Validación básica
        ]);
        // Obtener los datos existentes de la sesión 'docente'
        $docente = session()->get('docente', []);
    
        // Agregar o actualizar el campo 'gestionGrupo' con los datos validados
        $docente['gestionGrupo'] = $validatedData['gestionGrupo'];
    
        // Actualizar la sesión con los datos modificados
        session()->put('docente', $docente);
    
        return response()->json(['message' => 'Gestión actualizada correctamente', 'docente' => $docente]);
    }    

    public function crearGrupoDocenteGestion(Request $request)
    {
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        }
    
        // Si llega aquí, la validación fue exitosa
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
    
        return response()->json(['message' => 'Grupo creado exitosamente', 'grupo' => $grupo], 201);
    }
    
}   