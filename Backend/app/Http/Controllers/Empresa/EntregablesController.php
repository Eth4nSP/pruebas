<?php

namespace App\Http\Controllers\Empresa;

use App\Models\Entregables;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EntregablesController extends Controller
{
    public function guardarEntregables(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'entregables' => 'required|array',
            'entregables.*.idSprint' => 'required|exists:sprint,idSprint',
            'entregables.*.entregables' => 'required|array',
            'entregables.*.entregables.*' => 'required|string|max:255',
        ], [
            'entregables.required' => 'El campo de entregables es obligatorio.',
            'entregables.array' => 'Los entregables deben ser proporcionados como un array.',
            'entregables.*.idSprint.required' => 'El ID del sprint es obligatorio para cada entregable.',
            'entregables.*.idSprint.exists' => 'El ID del sprint especificado no existe.',
            'entregables.*.entregables.required' => 'La lista de entregables es obligatoria para cada sprint.',
            'entregables.*.entregables.array' => 'Los entregables deben ser proporcionados como un array para cada sprint.',
            'entregables.*.entregables.*.required' => 'Cada elemento entregable es obligatorio.',
            'entregables.*.entregables.*.string' => 'Cada elemento entregable debe ser una cadena de texto.',
            'entregables.*.entregables.*.max' => 'Cada elemento entregable no debe exceder los 255 caracteres.',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->entregables as $sprintEntregables) {
                $idSprint = $sprintEntregables['idSprint'];

                // Delete existing entregables for this sprint
                Entregables::where('idSprint', $idSprint)->delete();

                // Add new entregables
                foreach ($sprintEntregables['entregables'] as $descripcionEntregable) {
                    Entregables::create([
                        'idSprint' => $idSprint,
                        'descripcionEntregable' => $descripcionEntregable,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Entregables guardados exitosamente',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al guardar los entregables',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function testGuardarEntregables()
    {
        // Create test data
        $testData = [
            'entregables' => [
                [
                    'idSprint' => 5,
                    'entregables' => ['Entregable 1 para Sprint 1', 'Entregable 2 para Sprint 1']
                ],
                [
                    'idSprint' => 6,
                    'entregables' => ['Entregable 1 para Sprint 2', 'Entregable 2 para Sprint 2', 'Entregable 3 para Sprint 2']
                ]
            ]
        ];

        // Create a new request with the test data
        $request = new Request($testData);

        // Call the guardarEntregables function
        $response = $this->guardarEntregables($request);
        return $response;
    }

    public function aceptarEntregables(Request $request)
    {
        $validated = $request->validate([
            'entregables' => 'required|array',
            'entregables.*.idEntregable' => 'required|integer'
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['entregables'] as $entregable)   {
                Entregables::where('idEntregables', $entregable['idEntregable'])
                    ->update(['aceptado' => true]); // Cambia 'aceptado' a true
            }

            DB::commit();
            return response()->json(['message' => 'Entregables aceptados correctamente.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error al aceptar los entregables.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
