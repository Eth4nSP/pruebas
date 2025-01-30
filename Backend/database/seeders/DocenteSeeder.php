<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DocenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('docente')->insert([
            [
                'idDocente' => 1,
                'nombreCuenta' => 'letiGod',
                'nombreDocente' => 'Leticia',
                'primerApellido' => 'Blanco',
                'segundoApellido' => 'Coca',
                'contrasena' => Hash::make('Password1'),
                'email' => 'leticiaBlanco@gmail.com'
            ],
            [
                'idDocente' => 2,
                'nombreCuenta' => 'corina123',
                'nombreDocente' => 'Corina',
                'primerApellido' => 'Flores',
                'segundoApellido' => 'Villaroel',
                'contrasena' => Hash::make('Password2'),
                'email' => 'carlosfloresvilla@gmail.com'
            ],
            
            [
                'idDocente' => 3,
                'nombreCuenta' => 'griego123',
                'nombreDocente' => 'Esteban',
                'primerApellido' => 'Griego',
                'segundoApellido' => 'Vazquez',
                'contrasena' => Hash::make('Password3'),
                'email' => 'griegoEsteban_30@gmail.com'
            ]
        ]);
    }
}
