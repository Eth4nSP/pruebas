<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SprintSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $planificaciones = DB::table('planificacion')
            ->whereIn('idPlanificacion', [1,2,3,4,5,6])
            ->pluck('idPlanificacion');

        foreach ($planificaciones as $idPlanificacion) 
        {
            if($idPlanificacion===4 || $idPlanificacion===5 || $idPlanificacion===6){   
                $startDate = Carbon::now()->addDays(rand(1, 30));
            }else{
                $startDate = Carbon::now()->subDays(25);
            }
            $totalCobro = 100.00;
            $sprints = rand(3, 6); // Número aleatorio de sprints entre 3 y 6
            $cobros = [];

            // Generar cobros aleatorios para todos los sprints excepto el último
            for ($i = 1; $i < $sprints; $i++) {
                $maxCobro = $totalCobro - ($sprints - $i) * 0.01; // Asegurar que quede al menos 0.01 para cada sprint restante

                // Decidir si este sprint tendrá cobro cero o no
                if (rand(0, 3) == 0 && $i < $sprints - 1) { // 25% de probabilidad de cobro cero, excepto para el penúltimo sprint
                    $cobro = 0;
                } else {
                    $cobro = min(max(round(mt_rand(0, $maxCobro * 100) / 100, 2), 0), $maxCobro);
                }

                $cobros[] = $cobro;
                $totalCobro -= $cobro;
            }

            // El último sprint toma el resto para asegurar que sume exactamente 100
            $cobros[] = round($totalCobro, 2);

            // Mezclar los cobros para que el último no sea siempre el que ajusta
            shuffle($cobros);

            // Insertar los Sprints en la base de datos
            for ($i = 0; $i < $sprints; $i++) {
                DB::table('sprint')->insert([
                    'idPlanificacion' => $idPlanificacion,
                    'numeroSprint' => $i + 1,
                    'fechaIni' => $startDate,
                    'fechaFin' => $startDate->copy()->addDays(14),
                    'cobro' => $cobros[$i],
                    'fechaEntrega' => $startDate->copy()->addDays(15),
                    'comentario' => $idPlanificacion == 1 ? $this->generateRandomComment() : null,
                    'nota' => $idPlanificacion == 1 ? $this->generateRandomNote() : null,
                ]);

                $startDate->addDays(15);
            }
        }
    }

    /**
     * Generate a random comment.
     *
     * @return string
     */
    private function generateRandomComment(): string
    {
        $comments = [
            "Buen progreso en este sprint.",
            "Se necesita mejorar la velocidad de desarrollo.",
            "Excelente trabajo en equipo.",
            "Algunos objetivos no se cumplieron.",
            "Implementación satisfactoria de nuevas características.",
        ];

        return $comments[array_rand($comments)];
    }

    /**
     * Generate a random note.
     *
     * @return int
     */
    private function generateRandomNote(): int
    {
        // Generar una nota aleatoria entre 1 y 100
        return rand(1, 100);
    }
}