<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstudiantesEmpresasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estudiantes = range(1, 29);
        $empresas = [1, 2, 3, 4, 5, 6, 7];
        $numEmpresas = count($empresas);

        // Shuffle the students to ensure random distribution
        shuffle($estudiantes);

        $asignaciones = [];

        foreach ($estudiantes as $estudiante) {
            // Assign each student to a random company
            $empresa = $empresas[array_rand($empresas)];

            $asignaciones[] = [
                'idEmpresa' => $empresa,
                'idEstudiante' => $estudiante,
            ];
        }

        // Insert all assignments in a single query for better performance
        DB::table('estudiantesempresas')->insert($asignaciones);

        // Verify distribution
        foreach ($empresas as $empresa) {
            $count = array_count_values(array_column($asignaciones, 'idEmpresa'))[$empresa] ?? 0;
            echo "Empresa $empresa: $count estudiantes\n";
        }
    }
}
