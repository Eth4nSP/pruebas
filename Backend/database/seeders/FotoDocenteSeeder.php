<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FotoDocenteSeeder extends Seeder
{
    public function run()
    {
        DB::table('fotodocente')->insert([
            ['idFoto' => 1, 'foto' => 'foto_docente1.jpg', 'idDocente' => 1],
            // Agrega más registros según sea necesario...
        ]);
    }
}
