<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PlanificacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $planificaciones = [
            [
                // * Planificacion aceptada con Sprints, tareas y entregables
                'idEmpresa' => 1,
                'aceptada' => true,
                'publicada' => true,
                'fechaEntrega' => Carbon::now()->addDays(30),
                'comentariopublico' => null,
            ],
            [
                // * Planificacion aceptada con Sprints sin calificar, solo con tareas
                'idEmpresa' => 2,
                'aceptada' => true,
                'publicada' => true,
                'fechaEntrega' => Carbon::now()->addDays(45),
                'comentariopublico' => null,
            ],
            [
                // * Planificacion aceptada que no tenga nada de nada
                'idEmpresa' => 3,
                'aceptada' => true,
                'publicada' => true,
                'fechaEntrega' => Carbon::now()->addDays(60),
                'comentariopublico' => null,
            ],
            [
                // * Planificacion rechazada  y publicada con su comentario
                'idEmpresa' => 4,
                'aceptada' => false,
                'publicada' => true,
                'fechaEntrega' => Carbon::now()->addDays(20),
                'comentariopublico' => 'Tienen que corregir las fechas de entrega de los Sprint 1, 2 y 4',
            ],
            [
                // * Planificacion no revisada y publicada
                'idEmpresa' => 5,
                'aceptada' => false,
                'publicada' => true,
                'fechaEntrega' => Carbon::now()->addDays(50),
                'comentariopublico' => null,
            ],
            [
                // * Planificacion no revisada y no publicada
                'idEmpresa' => 6,
                'aceptada' => false,
                'publicada' => false,
                'fechaEntrega' => Carbon::now()->addDays(50),
                'comentariopublico' => null,
            ],

            // * La empresa 7 no tiene planificacion para usar de ejemplo al crear una grupo
        ];

        foreach ($planificaciones as $planificacion) {
            DB::table('planificacion')->insert($planificacion);
        }
    }
}