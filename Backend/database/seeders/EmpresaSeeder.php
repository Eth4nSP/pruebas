<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('empresa')->insert([
            [
                'idEmpresa' => 1,
                'idGrupo' => 1,
                'nombreEmpresa' => 'Creative Harbor',
                'nombreLargo' => 'Creative Harbor Innovations S.R.L',
                'numerodefaltasempresa' => 0,
                'notaproductofinal' => null,
                'publicada' => 1.
            ],
            [
                'idEmpresa' => 2,
                'idGrupo' => 1,
                'nombreEmpresa' => 'SoftCraft',
                'nombreLargo' => 'SoftCraft Technology S.R.L.',
                'numerodefaltasempresa' => 0,
                'notaproductofinal' => 0,
                'publicada' => 1.
            ],
            [
                'idEmpresa' => 3,
                'idGrupo' => 1,
                'nombreEmpresa' => 'BlueWave',
                'nombreLargo' => 'BlueWave Software Development S.R.L.',
                'numerodefaltasempresa' => 0,
                'notaproductofinal' => 0,
                'publicada' => 1.
            ],
            [
                'idEmpresa' => 4,
                'idGrupo' => 1,
                'nombreEmpresa' => 'LogicTree',
                'nombreLargo' => 'LogicTree Digital Systems S.A.',
                'numerodefaltasempresa' => 0,
                'notaproductofinal' => 0,
                'publicada' => 1.
            ],
            [
                'idEmpresa' => 5,
                'idGrupo' => 1,
                'nombreEmpresa' => 'PixelForge',
                'nombreLargo' => 'PixelForge Software Development S.R.L.',
                'numerodefaltasempresa' => null,
                'notaproductofinal' => null,
                'publicada' => 0.
            ],
            [
                'idEmpresa' => 6,
                'idGrupo' => 1,
                'nombreEmpresa' => 'CodeLovers',
                'nombreLargo' => 'CodeLovers Solutions S.R.L.',
                'numerodefaltasempresa' => null,
                'notaproductofinal' => null,
                'publicada' => 0.
            ],
            [
                'idEmpresa' => 7,
                'idGrupo' => 1,
                'nombreEmpresa' => 'CodeNest',
                'nombreLargo' => 'CodeNest Innovations S.R.L.',
                'numerodefaltasempresa' => null,
                'notaproductofinal' => null,
                'publicada' => 0.
            ],
            
        ]);
    }
}
