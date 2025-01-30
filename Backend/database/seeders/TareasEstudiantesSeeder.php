<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class TareasEstudiantesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tareas = DB::table('tarea')
            ->join('semana', 'tarea.idSemana', '=', 'semana.idSemana')
            ->join('planificacion', 'semana.idPlanificacion', '=', 'planificacion.idPlanificacion') // Relación directa entre semana y planificacion
            ->select('tarea.idTarea', 'planificacion.idEmpresa')
            ->get();

        foreach ($tareas as $tarea) {
            $estudiantes = DB::table('estudiantesempresas')
                ->where('idEmpresa', $tarea->idEmpresa)
                ->pluck('idEstudiante')
                ->toArray();

            if (!empty($estudiantes)) {
                $estudianteAsignado = $estudiantes[array_rand($estudiantes)];

                DB::table('tareasestudiantes')->insert([
                    'idEstudiante' => $estudianteAsignado,
                    'idTarea' => $tarea->idTarea,
                ]);
            }
        }
    }
}
