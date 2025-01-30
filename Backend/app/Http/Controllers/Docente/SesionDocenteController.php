<?php
namespace App\Http\Controllers\Docente;
use App\Http\Controllers\Controller;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\EvaluacionesGrupo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SesionDocenteController extends Controller
{
    public function getGrupoSesion($idGrupo) {
        if ($idDocente = session('docente.id')) {
            $docente = Docente::find($idDocente);
            $nombreCompleto = trim("{$docente->nombreDocente} {$docente->primerApellido} {$docente->segundoApellido}");
            
            $grupo = DB::table('grupo as g')
                ->join('docente as d', 'g.idDocente', '=', 'd.idDocente')
                ->where('d.idDocente', $idDocente)
                //->whereRaw('CURDATE() >= g.fechaIniGestion')
                //->whereRaw('CURDATE() <= g.fechaFinGestion')
                ->where('g.idGrupo',$idGrupo)
                ->select('g.idGrupo', 'g.fechaIniGestion', 'g.fechaLimiteEntregaEmpresa', 
                         'g.fechaLimiteEntregaPlanificacion', 'g.fechaFinPlanificacion', 
                         'g.fechaFinGestion', 'g.gestionGrupo', 'g.numGrupo') 
                ->first();

                $docente = session()->get('docente', []);
                // Agregar o actualizar el campo 'gestionGrupo' con los datos validados
                $docente['gestionGrupo'] = $grupo->idGrupo;
                // Actualizar la sesión con los datos modificados
                session()->put('docente', $docente);
            if ($grupo) {
                // Obtener el conteo de estudiantes en el grupo
                $numEstudiantes = DB::table('estudiantesgrupos')
                    ->where('idGrupo', $grupo->idGrupo)
                    ->count();
    
                // Obtener el conteo de empresas relacionadas con los estudiantes del grupo
                $numEmpresas = DB::table('estudiantesempresas')
                    ->join('estudiantesgrupos', 'estudiantesempresas.idEstudiante', '=', 'estudiantesgrupos.idEstudiante')
                    ->where('estudiantesgrupos.idGrupo', $grupo->idGrupo)
                    ->distinct('estudiantesempresas.idEmpresa')
                    ->count('estudiantesempresas.idEmpresa');
                $evaluacionGrupo = EvaluacionesGrupo::where('idGrupo', $grupo -> idGrupo)->first();
    
                return response()->json([
                    'idGrupo' => $grupo->idGrupo,
                    'fechaIniGestion' => $grupo->fechaIniGestion,
                    'fechaLimiteEntregaEmpresa' => $grupo->fechaLimiteEntregaEmpresa,
                    'fechaLimiteEntregaPlanificacion' => $grupo->fechaLimiteEntregaPlanificacion,
                    'fechaFinPlanificacion' => $grupo->fechaFinPlanificacion,
                    'fechaFinGestion' => $grupo->fechaFinGestion,
                    'nombreCompleto' => $nombreCompleto,
                    'numEstudiantes' => $numEstudiantes,
                    'numEmpresas' => $numEmpresas,
                    'gestion' => trim("Gestión: {$grupo->gestionGrupo}, Grupo: {$grupo->numGrupo}"),            
                    'tipoEvaluacion' => $evaluacionGrupo?$evaluacionGrupo->tipoEvaluacion:'1',
                    'fechaEvaluacion' => $evaluacionGrupo?$evaluacionGrupo->fechaEvaluacion:'1',
                ], 200);
            } else {
                return response()->json(['idGrupo' => '-1'], 200);
            }
        } else {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
    }
    
}