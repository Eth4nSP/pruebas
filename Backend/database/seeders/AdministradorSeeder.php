<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class AdministradorSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('administrador')->insert([
            [
                'idAdministrador' => 1,
                'nombreCuenta' => 'admin1',
                'contrasena' => Hash::make('admin1'),
                'email' => 'administrador2@gmail.com',
            ],
            [
                'idAdministrador' => 2,
                'nombreCuenta' => 'admin2',
                'contrasena' => Hash::make('admin2'),
                'email' => 'administrador2@gmail.com',
            ],
        ]);
    }
}
