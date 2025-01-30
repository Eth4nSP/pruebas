<?php
namespace App\Http\Controllers\Estudiante;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\EstudiantesGrupos;
use App\Models\Grupo;
use App\Models\Estudiante;
use Exception;

class EstudianteController extends Controller
{
    /*public function asignarEstudianteAGrupo(Request $request)
    {
        try{
            // Validación de la solicitud
        $request->validate([
            //'idEstudiante' => 'required|integer|exists:estudiante,idEstudiante',
            'idGrupo' => 'required|integer',
            'clave' => 'required|string'
        ]);
        $idEstudiante = session()->get('estudiante.id');

        // Verificar si la relación ya existe
        $existeRelacion = estudiantesgrupos::where('idEstudiante', $idEstudiante)
                                            //->where('idGrupo', $request->idGrupo)
                                            ->exists();
        if ($existeRelacion) {
            return response()->json(['message' => 'Ya esta inscrito en un grupo.'], 400);
        }
        $passwordCorrecta = grupo::where('codigoAcceso',$request -> clave)
                                            ->where('idGrupo', $request->idGrupo)
                                            ->exists();
        if($passwordCorrecta){
            // Crear la nueva relación
            $estudiantesGrupo = new estudiantesgrupos();
            $estudiantesGrupo->idEstudiante = $idEstudiante;
            $estudiantesGrupo->idGrupo = $request->idGrupo;
            $estudiantesGrupo->save();
            return response()->json(['message' => 'Estudiante asignado al grupo exitosamente.'], status: 200);
        }else{
            return response()->json(['message' => 'Password Incorrecta.'], status: 201 );
        }
        }catch(Exception $e){
            return response()->json(['message' => 'Fallo la consulta'], status: 201 );
        }
    }*/
    public function asignarEstudianteAGrupo(Request $request)
{
    try {
        // Validación de la solicitud
        $request->validate([
            'idGrupo' => 'required|integer',
            'clave' => 'required|string'
        ]);
        $idEstudiante = session()->get('estudiante.id');

        // Verificar si la relación ya existe
        $existeRelacion = estudiantesgrupos::where('idEstudiante', $idEstudiante)->exists();
        if ($existeRelacion) {
            return response()->json(['message' => 'Ya está inscrito en un grupo.'], 400);
        }

        $passwordCorrecta = grupo::where('codigoAcceso', $request->clave)
                                  ->where('idGrupo', $request->idGrupo)
                                  ->exists();
        if ($passwordCorrecta) {
            // Crear la nueva relación
            $estudiantesGrupo = new estudiantesgrupos();
            $estudiantesGrupo->idEstudiante = $idEstudiante;
            $estudiantesGrupo->idGrupo = $request->idGrupo;
            $estudiantesGrupo->save();
            return response()->json(['message' => 'Estudiante asignado al grupo exitosamente.'], 200);
        } else {
            return response()->json(['message' => 'Contraseña incorrecta.'], 201);
        }
    } catch (Exception $e) {
        return response()->json(['message' => 'Falló la consulta.'], 500);
    }
}


    public function obtenerEstudiantesPorGrupo(){
        $idEstudiante = session()->get('estudiante.id');
        $grupo = EstudiantesGrupos::select('idGrupo')
                ->where('idEstudiante',$idEstudiante)
                ->first();
        
        $resultado = Estudiante::select( 'estudiante.idEstudiante',DB::raw("CONCAT(nombreEstudiante, ' ', primerApellido, ' ', segundoApellido) AS nombreCompleto"))
        ->join('estudiantesgrupos AS eg','eg.idEstudiante','=','estudiante.idEstudiante')
        ->where('estudiante.disponible','<>','1')
        ->where('eg.idGrupo',$grupo -> idGrupo)
        ->where('estudiante.idEstudiante','<>',$idEstudiante)
        ->orderBy('estudiante.nombreEstudiante')
        ->get();

        return response()->json($resultado, 200);
    }
    
}