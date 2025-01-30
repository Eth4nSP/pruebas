<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrupoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('grupo')->insert([
            [
                'idGrupo' => 1,
                'numGrupo' => 1,
                'gestionGrupo' => '2024-2',
                'idDocente' => 1,
                'codigoAcceso' => 'hamilton',
                'descripcion' => 'descripcion de leticia desde la base',
                'fechaIniGestion' => '2024-07-28',
                'fechaLimiteEntregaEmpresa' => '2024-08-05',
                'fechaLimiteEntregaPlanificacion' => '2024-08-12',
                'fechaFinPlanificacion' => '2024-12-20',
                'fechaFinGestion' => '2024-12-30'
            ],
            [
                'idGrupo' => 2,
                'numGrupo' => 2,
                'gestionGrupo' => '2024-2',
                'idDocente' => 2,
                'codigoAcceso' => 'hamilton2',
                'descripcion' => 'descripcion de grupo2',
                'fechaIniGestion' => '2024-09-28',
                'fechaLimiteEntregaEmpresa' => '2024-10-05',
                'fechaLimiteEntregaPlanificacion' => '2024-10-12',
                'fechaFinPlanificacion' => '2025-02-02',
                'fechaFinGestion' => '2025-02-20',
            ],
            [
                'idGrupo' => 3,
                'numGrupo' => 3,
                'gestionGrupo' => '2024-2',
                'idDocente' => 3,
                'codigoAcceso' => 'hamilton3',
                'descripcion' =>  'descripcion de grupo3 de Taller de ingenieria de software con docente 2',
                'fechaIniGestion' => '2024-11-28',
                'fechaLimiteEntregaEmpresa' => '2024-12-05',
                'fechaLimiteEntregaPlanificacion' => '2024-12-12',
                'fechaFinPlanificacion' => '2025-03-02',
                'fechaFinGestion' => '2025-03-20',
            ],
        ]);
    }
}
