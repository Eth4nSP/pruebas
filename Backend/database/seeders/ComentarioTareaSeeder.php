<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ComentarioTarea;
use App\Models\Planificacion;
use App\Models\Semana;
use App\Models\EstudiantesEmpresas;
use Illuminate\Support\Facades\Log;

class ComentarioTareaSeeder extends Seeder
{
    public function run()
    {
        Log::info('Iniciando ComentarioTareaSeeder');

        try {
            // Obtener la planificación de id 1
            $planificacion = Planificacion::findOrFail(1);
            Log::info('Planificación encontrada', ['id' => $planificacion->idPlanificacion]);

            // Obtener todas las semanas de la planificación (sin necesidad de los sprints)
            $semanas = Semana::where('idPlanificacion', $planificacion->idPlanificacion)->get();
            Log::info('Semanas encontradas', ['count' => $semanas->count()]);

            // Obtener todos los estudiantes asociados a la empresa de la planificación
            $estudiantes = EstudiantesEmpresas::where('idEmpresa', $planificacion->idEmpresa)->get();
            Log::info('Estudiantes encontrados', ['count' => $estudiantes->count()]);

            $comentariosCreados = 0;

            // Crear comentarios para cada estudiante y semana
            foreach ($estudiantes as $estudiante) {
                foreach ($semanas as $semana) {
                    ComentarioTarea::create([
                        'idEstudiante' => $estudiante->idEstudiante,
                        'idSemana' => $semana->idSemana,
                        'comentario' => $this->generateRandomComment(),
                    ]);
                    $comentariosCreados++;
                }
            }

            Log::info('Comentarios creados', ['count' => $comentariosCreados]);
        } catch (\Exception $e) {
            Log::error('Error en ComentarioTareaSeeder', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate a random comment.
     *
     * @return string
     */
    private function generateRandomComment(): string
    {
        $comments = [
            "Demostró habilidades sólidas al implementar funcionalidades clave.",
            "El manejo de los tiempos en la resolución de tareas fue deficiente.",
            "Se evidenció una buena comprensión de los conceptos de programación aplicados.",
            "Hubo dificultades al depurar errores en el código, lo que retrasó el avance.",
            "Excelente iniciativa al investigar soluciones por cuenta propia.",
            "Falta de consistencia en la calidad del código presentado.",
            "Integró correctamente módulos complejos con resultados funcionales.",
            "No cumplió con algunos requisitos fundamentales establecidos para esta semana.",
            "El trabajo en equipo fue destacable, con aportaciones significativas al proyecto.",
            "Se observó poca atención a los detalles en la documentación del proyecto."
        ];
        
        return $comments[array_rand($comments)];
    }
}
