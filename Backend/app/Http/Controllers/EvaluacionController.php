<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use App\Models\Evaluacion;
use App\Models\NotaPorCriterio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EvaluacionController extends Controller
{
    public function getDatosParaEvaluar($idEstudiante)
    {
        $evaluacion = Evaluacion::where('idEvaluadorEstudiante', $idEstudiante)->first();
        if ($evaluacion === null) {
            return response()->json(['error' => 'No se encontró la evaluación'], 404);
        } else {
            $evaluacionGrupo = $evaluacion->evaluacionGrupo;
            $fechaEvaluacion = $evaluacionGrupo->fechaEvaluacion;
            $tipoEvaluacion = $evaluacion->evaluacionGrupo->tipoEvaluacion;
            if ($tipoEvaluacion === 'autoevaluacion') {
                $evaluado = $evaluacion->evaluadoEstudiante;
            } elseif ($tipoEvaluacion === 'evaluacionCruzada') {
                $evaluado = $evaluacion->evaluadoEmpresa;
            } elseif ($tipoEvaluacion === 'evaluacionPares') {
                $evaluado = $evaluacion->evaluadoEstudiante;
            } else {
                return response()->json(['error' => 'Tipo de evaluación no válido'], 400);
            }
            if ($evaluado === null) {
                return response()->json(['error' => 'No se encontró el evaluado'], 404);
            }
            $criterios = $evaluacionGrupo->criterios;
            if ($criterios->isEmpty()) {
                return response()->json(['error' => 'No se encontraron criterios para esta evaluación'], 404);
            }
            $response = [
                'tipoEvaluacion' => $tipoEvaluacion,
                'fechaEvaluacion' => $fechaEvaluacion,
                'evaluado' => $tipoEvaluacion === 'evaluacionCruzada'
                    ? $evaluado->nombreEmpresa
                    : $evaluado->nombreEstudiante . ' ' . $evaluado->primerApellido . ' ' . $evaluado->segundoApellido,
                'criterios' => $criterios->map(function ($criterio) {
                    return [
                        'id' => $criterio->idCriterio,
                        'descripcion' => $criterio->descripcion,
                        'rangoMaximo' => $criterio->rangoMaximo,
                    ];
                }),
                'idEvaluacion' => $evaluacion->idEvaluacion,
                'notaTotal' => $evaluacion->notaTotal,
            ];
            return response()->json($response);
        }
    }
    public function evaluar(Request $request)
    {
        // Validar los datos
        $validator = Validator::make($request->all(), [
            'idEvaluacion' => 'required|integer|exists:evaluacion,idEvaluacion',
            'notas' => 'required|array',
            'notas.*' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();

        try {
            DB::beginTransaction();

            $evaluacion = Evaluacion::findOrFail($validatedData['idEvaluacion']);

            // Delete existing notaporcriterio rows for this evaluation
            NotaPorCriterio::where('idEvaluacion', $validatedData['idEvaluacion'])->delete();

            //obtener todos los criterios
            $criterios = Criterio::where('idEvaluacionesGrupo', $evaluacion->idEvaluacionesGrupo)->get();

            $totalScore = 0;

            foreach ($criterios as $criterio) {
                if (!isset($validatedData['notas'][$criterio->idCriterio])) {
                    throw new \Exception("Falta la nota para el criterio: " . $criterio->descripcion);
                }

                $nota = $validatedData['notas'][$criterio->idCriterio];

                // Validate that the nota is not greater than the rangoMaximo
                if ($nota > $criterio->rangoMaximo) {
                    throw new \Exception("La nota para el criterio '{$criterio->descripcion}' excede el rango máximo permitido.");
                }

                // Create the nota for this criterio
                $notaPorCriterio = new NotaPorCriterio();
                $notaPorCriterio->idEvaluacion = $validatedData['idEvaluacion'];
                $notaPorCriterio->idCriterio = $criterio->idCriterio;
                $notaPorCriterio->calificacion = $nota;
                $notaPorCriterio->save();

                $totalScore += $nota;
            }

            // Update the total score for the evaluation
            $evaluacion->notaTotal = $totalScore;
            $evaluacion->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Evaluación realizada correctamente',
                'notaTotal' => $totalScore
            ], 200);
        } catch (\Exception $e) {
            // If an error occurs, rollback the transaction
            DB::rollBack();

            return response()->json([
                'error' => true,
                'message' => 'Error al realizar la evaluación',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public function testEvaluacion()
    {
        // Generate test data
        $testData = [
            'idEvaluacion' => 1, // Assuming this evaluation exists
            'notas' => [
                1 => 20, // Assuming criterio with id 1 exists
                2 => 25, // Assuming criterio with id 2 exists
                3 => 30, // Assuming criterio with id 3 exists
                4 => 25, // Assuming criterio with id 4 exists
            ]
        ];

        // Call the evaluar function
        $response = $this->evaluar(new Request($testData));
        return $response;
    }
}
