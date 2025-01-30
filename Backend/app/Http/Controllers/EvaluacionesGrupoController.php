<?php

namespace App\Http\Controllers;

use App\Models\EvaluacionesGrupo;
use App\Models\Criterio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Validator;
use Exception;

class EvaluacionesGrupoController extends Controller
{
    public function configurarEvaluacion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'criterios' => 'required|array',
            'criterios.*.descripcion' => 'required|string',
            'criterios.*.notaMaxima' => 'required|integer|min:1',
            'tipoEvaluacion' => 'required|in:evaluacionPares,evaluacionCruzada,autoevaluacion',
            'idGrupo' => 'required|exists:grupo,idGrupo',
            'fechaEvaluacion' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            DB::beginTransaction();
            $evaluacionesAnteriores = EvaluacionesGrupo::where('idGrupo', $request->idGrupo)->first();
            if ($evaluacionesAnteriores) {
                // Delete associated Evaluaciones
                $evaluacionesAnteriores->evaluaciones()->delete();
                // Delete the EvaluacionesGrupo itself
                $evaluacionesAnteriores->delete();
            }

            $evaluacionesGrupo = new EvaluacionesGrupo;
            $evaluacionesGrupo->idGrupo = $request->idGrupo;
            $evaluacionesGrupo->tipoEvaluacion = $request->tipoEvaluacion;
            $evaluacionesGrupo->fechaEvaluacion = Carbon::parse($request->fechaEvaluacion)->format('Y-m-d H:i:s');
            $evaluacionesGrupo->save();


            // eliminar los criterios anteriores si es que existen
            Criterio::where('idEvaluacionesGrupo', $evaluacionesGrupo->idEvaluacionesGrupo)->delete();

            // añade nuevos criterios
            foreach ($request->criterios as $criterioData) {
                Criterio::create([
                    'idEvaluacionesGrupo' => $evaluacionesGrupo->idEvaluacionesGrupo,
                    'descripcion' => $criterioData['descripcion'],
                    'rangoMaximo' => $criterioData['notaMaxima'],
                ]);
            }

            // Asignar evaluadores según el tipo de evaluación
            if ($request->tipoEvaluacion === 'autoevaluacion') {
                $this->asignarAutoevaluacion($evaluacionesGrupo);
            } elseif ($request->tipoEvaluacion === 'evaluacionCruzada') {
                $this->asignarEvaluacionCruzada($evaluacionesGrupo);
            } elseif ($request->tipoEvaluacion === 'evaluacionPares') {
                $this->asignarEvaluacionPares($evaluacionesGrupo);
            }

            DB::commit();

            return response()->json([
                'message' => 'Evaluación de grupo creada con éxito',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear la evaluación de grupo: ' . $e->getMessage()], 500);
        }
    }
    // * metodos para asignar evaluadores y evaluado
    private function asignarAutoevaluacion(EvaluacionesGrupo $evaluacionesGrupo)
    {
        $estudiantes = $evaluacionesGrupo->grupo->estudiantes;

        foreach ($estudiantes as $estudiante) {
            $evaluacionesGrupo->evaluaciones()->create([
                'idEvaluadorEstudiante' => $estudiante->idEstudiante,
                'idEvaluadoEstudiante' => $estudiante->idEstudiante,
                'idEvaluadoEmpresa' => null,
                'horaEvaluacion' => null,
            ]);
        }
    }

    private function asignarEvaluacionCruzada(EvaluacionesGrupo $evaluacionesGrupo)
    {
        $empresas = $evaluacionesGrupo->grupo->empresas;
        $numEmpresas = $empresas->count();

        if ($numEmpresas < 2) {
            throw new \Exception("Se necesitan al menos dos empresas para la evaluación cruzada.");
        }

        foreach ($empresas as $index => $empresaEvaluadora) {
            // obtiene los estudiantes de la empresa evaluadora
            $estudiantesEvaluadores = $empresaEvaluadora->estudiantes;
            // obtiene la empresa que va a ser evaluada
            $empresaEvaluada = $empresas[($index + 1) % $numEmpresas];


            foreach ($estudiantesEvaluadores as $estudiante) {
                $evaluacionesGrupo->evaluaciones()->create([
                    'idEvaluadorEstudiante' => $estudiante->idEstudiante,
                    'idEvaluadoEstudiante' => null,
                    'idEvaluadoEmpresa' => $empresaEvaluada->idEmpresa,
                    'horaEvaluacion' => null,
                ]);
            }
        }
    }

    private function asignarEvaluacionPares(EvaluacionesGrupo $evaluacionesGrupo)
    {
        $empresas = $evaluacionesGrupo->grupo->empresas;

        foreach ($empresas as $empresa) {
            $estudiantes = $empresa->estudiantes->shuffle();
            $totalEstudiantes = $estudiantes->count();

            if ($totalEstudiantes < 2) {
                continue; // Skip companies with less than 2 students
            }

            for ($i = 0; $i < $totalEstudiantes; $i++) {
                $evaluador = $estudiantes[$i];
                $evaluado = $estudiantes[($i + 1) % $totalEstudiantes];

                $evaluacionesGrupo->evaluaciones()->create([
                    'idEvaluadorEstudiante' => $evaluador->idEstudiante,
                    'idEvaluadoEstudiante' => $evaluado->idEstudiante,
                    'idEvaluadoEmpresa' => null,
                    'horaEvaluacion' => null,
                ]);
            }
        }
    }

    public function getEvaluacionesGrupo($idGrupo)
    {
        try {
            $evaluacionGrupo = EvaluacionesGrupo::where('idGrupo', $idGrupo)->first();

            if (!$evaluacionGrupo) {
                return response()->json([
                    'message' => 'No se encontró evaluación para este grupo',
                    'tipoEvaluacion' => null,
                    'fechaEvaluacion' => null,
                    'criterios' => [['descripcion' => 'Criterio de ejemplo', 'rangoMaximo' => 50]],
                ]);
            }

            $criterios = Criterio::where('idEvaluacionesGrupo', $evaluacionGrupo->idEvaluacionesGrupo)
                ->select('descripcion', 'rangoMaximo')
                ->get();

            $response = [
                'tipoEvaluacion' => $evaluacionGrupo->tipoEvaluacion,
                'fechaEvaluacion' => $evaluacionGrupo->fechaEvaluacion,
                'criterios' => $criterios
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la evaluación del grupo: ' . $e->getMessage()], 500);
        }
    }
    public function getDatosEvaluacion($idGrupo)
    {
        try {
            $evaluacionGrupo = EvaluacionesGrupo::where('idGrupo', $idGrupo)->first();

            if (!$evaluacionGrupo) {
                return response()->json(['errorMessage' => 'No se encontró evaluación para este grupo'], 404);
            }

            $response = [
                'tipoEvaluacion' => $evaluacionGrupo->tipoEvaluacion,
                'fechaEvaluacion' => $evaluacionGrupo->fechaEvaluacion,
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la evaluación del grupo: ' . $e->getMessage()], 500);
        }
    }

    public function testConfigurarEvaluacion()
    {
        // Simular una solicitud con datos de prueba
        $requestData = [
            'criterios' => [
                ['descripcion' => 'Criterio 1', 'notaMaxima' => 30],
                ['descripcion' => 'Criterio 2', 'notaMaxima' => 40],
                ['descripcion' => 'Criterio 3', 'notaMaxima' => 30],
            ],
            'tipoEvaluacion' => 'evaluacionPares',
            'idGrupo' => 1,
            'fechaEvaluacion' => now(),
        ];

        // Crear una nueva instancia de Request con los datos de prueba
        $request = new Request($requestData);

        // Llamar a la función configurarEvaluacion
        $response = $this->configurarEvaluacion($request);
        return $response;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
