<?php
namespace App\Http\Controllers\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\EstudiantesGrupos;
use App\Models\Grupo;
use App\Models\Estudiante;
use App\Models\EstudiantesEmpresas;
use App\Models\Empresa;
use App\Http\Controllers\Controller;

class EstudiantesEmpresasController extends Controller{

    public function crearEmpresa(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nombreLargo' => 'required|string|max:255',
            'nombreCorto' => 'required|string|max:255',
            'estudiantes' => 'required|array|min:1', // Asegura al menos 3 y máximo 6 estudiantes
            'estudiantes.*' => 'required|integer|exists:estudiante,idEstudiante', // Cada ID debe ser un entero existente en la tabla estudiantes
        ]);
    
        // Crear la empresa
        $empresa = Empresa::create([
            'nombreLargo' => $request->nombreLargo,
            'nombreEmpresa' => $request->nombreCorto,
            // Agrega otros campos según tu modelo Empresa si es necesario
        ]);
    
        // Asociar los estudiantes a la empresa
        $empresa->estudiantes()->attach($request->estudiantes); // Asegúrate de que la relación many-to-many esté definida
            // Modificar un campo del estudiante
        foreach ($request->estudiantes as $estudianteId) {
            $estudiante = Estudiante::find($estudianteId);
            
            if ($estudiante) {
                
                $estudiante->disponible = '1'; 
                $estudiante->save(); 
            }
        }

        return response()->json(['message' => 'Empresa creada con éxito', 'empresa' => $empresa], 201);
    }
    

    public function modificarEmpresa(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nombreLargo' => 'required|string|max:255',
            'nombreCorto' => 'required|string|max:255',
            'estudiantes' => 'required|array|max:5', // Asegura al menos 3 y máximo 6 estudiantes
            'estudiantes.*' => 'required|integer|exists:estudiante,idEstudiante', // Cada ID debe ser un entero existente en la tabla estudiantes
        ]);
    
        // Crear la empresa
        $empresa = Empresa::create([
            'nombreLargo' => $request->nombreLargo,
            'nombreEmpresa' => $request->nombreCorto,
            // Agrega otros campos según tu modelo Empresa si es necesario
        ]);
    
        // Asociar los estudiantes a la empresa
        $empresa->estudiantes()->attach($request->estudiantes); // Asegúrate de que la relación many-to-many esté definida
            // Modificar un campo del estudiante
        foreach ($request->estudiantes as $estudianteId) {
            $estudiante = Estudiante::find($estudianteId);
            
            if ($estudiante) {
                
                $estudiante->disponible = '1'; 
                $estudiante->save(); 
            }
        }

        return response()->json(['message' => 'Empresa creada con éxito', 'empresa' => $empresa], 201);
    }
}