<?php

namespace App\Http\Controllers\Empresa;
use Carbon\Carbon;
use App\Models\Empresa;
use App\Models\Semana;
use App\Models\NotasSemana;
use App\Models\Estudiante;
use App\Models\Sprint;
use App\Models\Planificacion;
use Illuminate\Support\Facades\DB;
use App\Models\EstudiantesGrupos;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;


class EmpresaController extends Controller
{
    public function getEmpresaData($id)
    {
        // Obtener la empresa con el ID proporcionado
        $empresa = Empresa::with('estudiantes')->find($id);

        // Verificar si la empresa existe
        if (!$empresa) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Formatear los datos
        $data = [
            'nombreEmpresa' => $empresa->nombreEmpresa,
            'nombreLargo' => $empresa->nombreLargo,
            'integrantes' => $empresa->estudiantes->map(function ($estudiante) {
                return [
                    'idEstudiante' => $estudiante->idEstudiante,
                    'nombreEstudiante' => $estudiante->nombreEstudiante,
                    'primerApellido' => $estudiante->primerApellido,
                    'segundoApellido' => $estudiante->segundoApellido,
                ];
            }),
        ];

        // Devolver los datos en formato JSON
        return response()->json($data);
    }
    public function getNombreEmpresa($id)
    {
        // Obtener la empresa con el ID proporcionado
        $empresa = Empresa::with('estudiantes')->find($id);

        // Verificar si la empresa existe
        if (!$empresa) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Formatear los datos
        $data = [
            'nombreEmpresa' => $empresa->nombreEmpresa,
            'nombreLargo' => $empresa->nombreLargo,
        ];

        // Devolver los datos en formato JSON
        return response()->json($data);
    }


    // En el futuro debera filtrar por ID del docente !!!!!!!!
    // formato aproximado:

    // $empresas = Empresa::whereHas('docente', function($query) use ($idDocente) {
    //     $query->where('idDocente', $idDocente);
    // })->orderBy('nombreEmpresa', 'asc')->get();

    public function getListaEmpresas()
    {
        // esta formateado para buscar por orden alfabetico
        $empresa = Empresa::orderBy('nombreEmpresa', 'asc')->get();

        // Devolver error si no existe
        if (!$empresa) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Formatear xd
        $data = $empresa->map(function ($empresa) {
            return [
                'idEmpresa' => $empresa->idEmpresa,
                'nombreEmpresa' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
            ];
        });


        //return response()->json($data);
        return $data;
    }
    public function obtenerSprints($idEmpresa, $idDocente)
    {
        try {

            $empresa = Empresa::findOrFail($idEmpresa);

            $sprints = $empresa->sprints;

            return response()->json([
                'success' => true,
                'nombre' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'idDocente' => $idDocente,
                'sprints' => $sprints
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los sprints: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCalificacionesEmpresa($idEmpresa)
    {
        try {
            // Obtener la empresa y verificar si tiene estudiantes
            $empresa = Empresa::with('estudiantes')->findOrFail($idEmpresa);

            if ($empresa->estudiantes->isEmpty()) {
                return response()->json([
                    'mensaje' => 'No hay estudiantes asignados a esta empresa.'
                ], 200);
            }

            // Verificar si la empresa tiene planificaciones
            $planificacion = Planificacion::where('idEmpresa', $idEmpresa)->first();

            if (!$planificacion) {
                return response()->json([
                    'mensaje' => 'No hay planificaciones asociadas a esta empresa.'
                ], 200);
            }

            // Obtener los sprints relacionados a la planificación
            $sprints = Sprint::where('idPlanificacion', $planificacion->idPlanificacion)->get();

            if ($sprints->isEmpty()) {
                return response()->json([
                    'mensaje' => 'No hay sprints disponibles para esta planificación.'
                ], 200);
            }

            // Crear un arreglo para almacenar las calificaciones por estudiante y sprint
            $calificaciones = [];

            foreach ($empresa->estudiantes as $estudiante) {
                $calificacionesEstudiante = [
                    'estudiante' => [
                        'nombre' => $estudiante->nombreEstudiante,
                        'primerApellido' => $estudiante->primerApellido,
                        'segundoApellido' => $estudiante->segundoApellido,
                    ],
                    'promediosPorSprint' => []
                ];

                foreach ($sprints as $sprint) {
                    $semanas = Semana::where('idSprint', $sprint->idSprint)->get();
                    $totalNotas = 0;
                    $cantidadNotas = 0;

                    foreach ($semanas as $semana) {
                        $notasSemana = NotasSemana::where('idSemana', $semana->idSemana)
                            ->where('idEstudiante', $estudiante->idEstudiante)
                            ->get();

                        foreach ($notasSemana as $nota) {
                            $totalNotas += $nota->nota;
                            $cantidadNotas++;
                        }
                    }

                    $promedio = $cantidadNotas > 0 ? $totalNotas / $cantidadNotas : 0;

                    $calificacionesEstudiante['promediosPorSprint'][] = [
                        'sprint' => $sprint->idSprint,
                        'promedio' => $promedio
                    ];
                }

                $calificaciones[] = $calificacionesEstudiante;
            }

            return response()->json([
                'nombre' => $empresa->nombreEmpresa,
                'nombreLargo' => $empresa->nombreLargo,
                'calificaciones' => $calificaciones
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las calificaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSprintsEntregables($idEmpresa)
    {
        try {
            $empresa = Empresa::with(['sprints.entregables'])
                ->where('idEmpresa', $idEmpresa)
                ->first();

            if (!$empresa) {
                return response()->json(['error' => 'Empresa no encontrada'], 404);
            }

            // Retornar solo los sprints y sus entregables
            $sprints = $empresa->sprints->map(function ($sprint) {
                return [
                    'idSprint' => $sprint->idSprint,
                    'numeroSprint' => $sprint->numeroSprint,
                    'fechaIni' => $sprint->fechaIni,
                    'fechaFin' => $sprint->fechaFin,
                    'fechaEntrega' => $sprint->fechaEntrega,
                    'cobro' => $sprint->cobro,
                    'comentario' => $sprint->comentario,
                    'nota' => $sprint->nota,
                ];
            });

            return response()->json(['sprints' => $sprints], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los sprints y entregables: ' . $e->getMessage()], 500);
        }
    }

    public function getSemanasTareas($idEmpresa)
    {
        try {
            // Cargar planificaciones con semanas y tareas asociadas
            $planificaciones = Empresa::findOrFail($idEmpresa)
                ->planificaciones()
                ->with(['semanas' => function ($query) {
                    $query->with(['tareas']);
                }])
                ->get();

            return response()->json($planificaciones, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los datos: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function obtenerSprintsYEstudiantes($idEmpresa)
    {
        try {
            // Obtener la empresa junto con sus sprints y estudiantes
            $empresa = Empresa::with([
                'sprints',
                'estudiantes' => function ($query) {
                    $query->select('estudiante.idEstudiante', 'nombreCuenta', 'nombreEstudiante', 'primerApellido', 'segundoApellido');
                },
            ])->findOrFail($idEmpresa);

            // Formatear la respuesta
            $response = [
                'sprints' => $empresa->sprints,
                'estudiantes' => $empresa->estudiantes,
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }
}
