<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // * Poblar clase docente
        $this->call(DocenteSeeder::class);

        // * Poblar clase Grupo
        $this->call(GrupoSeeder::class);

        // * Poblar clase Empresa
        $this->call(EmpresaSeeder::class);

        // * Poblar clase Estudiante
        $this->call(EstudianteSeeder::class);

        // * Poblar clase EstudiantesEmpresas
        $this->call(EstudiantesEmpresasSeeder::class);

        // * Poblar clase EstudiantesGrupos
        $this->call(EstudiantesGruposSeeder::class);

        // * Poblar clase Planificacion
        $this->call(PlanificacionSeeder::class);

        // * Poblar clase Sprint
        $this->call(SprintSeeder::class);

        // * Poblar clase Semana
        $this->call(SemanaSeeder::class);

        // * Poblar clase Tarea
        $this->call(TareaSeeder::class);

        // * Poblar clase TareasEstudiantes
        $this->call(TareasEstudiantesSeeder::class);

        // * Poblar clase Entregables
        $this->call(EntregablesSeeder::class);

        // * Poblar clase ComentarioTareaSeeder
        $this->call(ComentarioTareaSeeder::class);

        $this->call(AdministradorSeeder::class);
    }
}
