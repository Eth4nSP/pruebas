<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Semana;
use Carbon\Carbon;

class SemanaSeeder extends Seeder
{
    public function run()
    {
        $planificaciones = DB::table('planificacion')
            ->whereIn('idPlanificacion', [1, 2, 3])
            ->get();

        foreach ($planificaciones as $planificacion) {
            // Definir las fechas de inicio y fin
            $fechaIni = Carbon::parse('2024-8-12');
            $fechaFin = Carbon::parse('2024-12-20');
            
            // Calcular la duración en días y número de semanas
            $duracionEnDias = $fechaIni->diffInDays($fechaFin);
            $numeroSemanas = ceil($duracionEnDias / 7);
            
            // Inicializar el inicio de la primera semana
            $semanaIni = $fechaIni->copy();
            $numeroSemana = 1;

            // Iterar para crear las semanas
            for ($i = 1; $i <= $numeroSemanas; $i++) {
                // Definir el inicio y fin de la semana
                $inicioSemana = $semanaIni->copy();
                $finSemana = $inicioSemana->copy()->endOfWeek(Carbon::SUNDAY);

                // Evitar que la última semana exceda la fecha final
                if ($finSemana->gt($fechaFin)) {
                    $finSemana = $fechaFin;
                }

                // Depuración: Verifica las fechas generadas
                echo "Semana: $numeroSemana | Inicio: {$inicioSemana->toDateString()} | Fin: {$finSemana->toDateString()}\n";

                // Si la fecha de inicio ya es mayor que la fecha final, salir del ciclo
                if ($inicioSemana->gt($fechaFin)) {
                    break;
                }

                // Crear la semana en la base de datos
                Semana::create([
                    'idPlanificacion' => $planificacion->idPlanificacion,
                    'numeroSemana' => $numeroSemana,
                    'fechaIni' => $inicioSemana->toDateString(),
                    'fechaFin' => $finSemana->toDateString(),
                ]);

                // Aumentar el número de semana
                $numeroSemana++;

                // Establecer la fecha de inicio para la siguiente semana
                $semanaIni = $finSemana->addDay(); // Comenzar el lunes siguiente
            }
        }
    }
}
