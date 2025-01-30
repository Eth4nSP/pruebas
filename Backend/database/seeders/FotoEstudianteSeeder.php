<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FotoEstudianteSeeder extends Seeder
{
    public function run()
    {
        DB::table('fotoestudiante')->insert([
            ['idFoto' => 1, 'foto' => 'foto_estudiante1.jpg', 'idEstudiante' => 1],
            // Agrega más registros según sea necesario...
        ]);
    }
}
