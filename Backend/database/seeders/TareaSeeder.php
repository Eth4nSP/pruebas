<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TareaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semanas = DB::table('semana')
            ->join('planificacion', 'semana.idPlanificacion', '=', 'planificacion.idPlanificacion') // Directamente entre Semana y Planificacion
            ->whereIn('planificacion.idPlanificacion', [1, 2])  // Filtro de Planificación
            ->select('semana.*')
            ->get();


        $tareas = [
            [
                'nombre' => 'Diseñar interfaz de usuario',
                'descripcion' => 'Crear wireframes y mockups de la interfaz de usuario, asegurando una experiencia de usuario intuitiva y atractiva. Incluir diseños responsivos para dispositivos móviles y de escritorio.'
            ],
            [
                'nombre' => 'Implementar autenticación',
                'descripcion' => 'Desarrollar un sistema de autenticación seguro utilizando JWT o OAuth. Implementar registro de usuarios, inicio de sesión, recuperación de contraseña y autenticación de dos factores.'
            ],
            [
                'nombre' => 'Crear base de datos',
                'descripcion' => 'Diseñar y implementar una estructura de base de datos eficiente. Crear tablas, relaciones y índices necesarios. Considerar la normalización y optimización para consultas frecuentes.'
            ],
            [
                'nombre' => 'Desarrollar API RESTful',
                'descripcion' => 'Crear endpoints de API siguiendo los principios REST. Implementar operaciones CRUD para los recursos principales, manejar autenticación y autorización, y documentar la API usando Swagger o similar.'
            ],
            [
                'nombre' => 'Realizar pruebas unitarias',
                'descripcion' => 'Escribir y ejecutar pruebas unitarias para componentes clave del sistema. Asegurar una cobertura de código de al menos 80%. Utilizar frameworks de testing como Jest o PHPUnit según el lenguaje de programación.'
            ],
            [
                'nombre' => 'Optimizar rendimiento',
                'descripcion' => 'Analizar y mejorar el rendimiento de la aplicación. Optimizar consultas de base de datos, implementar caché donde sea necesario, y minimizar el tiempo de carga de la página. Realizar pruebas de carga para verificar mejoras.'
            ],
            [
                'nombre' => 'Documentar código',
                'descripcion' => 'Escribir documentación clara y concisa para el código fuente. Incluir comentarios en el código, crear guías de estilo, y documentar la arquitectura del sistema y los procesos de desarrollo.'
            ],
            [
                'nombre' => 'Implementar funcionalidad de búsqueda',
                'descripcion' => 'Desarrollar un sistema de búsqueda eficiente y preciso. Implementar búsqueda de texto completo, filtros avanzados y posiblemente integrar un motor de búsqueda como Elasticsearch para mejorar la velocidad y relevancia de los resultados.'
            ],
            [
                'nombre' => 'Crear panel de administración',
                'descripcion' => 'Diseñar e implementar un panel de administración con funcionalidades CRUD para gestionar usuarios, contenido y configuraciones del sistema. Asegurar que sea intuitivo y fácil de usar para los administradores.'
            ],
            [
                'nombre' => 'Integrar pasarela de pagos',
                'descripcion' => 'Integrar una pasarela de pagos segura como Stripe o PayPal. Implementar procesamiento de pagos, manejo de suscripciones si es necesario, y asegurar el cumplimiento de estándares de seguridad como PCI DSS.'
            ]
        ];

        $comentarios = [
            "Prioridad alta. Completar antes del fin de semana.",
            "Coordinar con el equipo de diseño para los detalles finales.",
            "Revisar los requisitos de seguridad antes de implementar.",
            "Programar una reunión de revisión al 50% de avance.",
            "Considerar la escalabilidad en la implementación.",
            "Documentar todos los cambios en el wiki del proyecto.",
            "Realizar pruebas de usabilidad con un grupo de usuarios beta.",
            "Optimizar para dispositivos móviles como prioridad.",
            "Integrar con el sistema de logging existente.",
            "Preparar una demo para la próxima reunión de equipo."
        ];
        foreach ($semanas as $semana) {
            $numTareas = rand(2, 5); // Random number of tasks per week
            $tareasDisponibles = $tareas; // Copy of tasks for this week
            for ($i = 0; $i < $numTareas; $i++) {
                $index = array_rand($tareasDisponibles);
                $tarea = $tareasDisponibles[$index];
                unset($tareasDisponibles[$index]);
                $fechaEntrega = Carbon::now()->addDays(rand(1, 7));

                DB::table('tarea')->insert([
                    'idSemana' => $semana->idSemana,
                    'nombreTarea' => $tarea['nombre'],
                    'textoTarea' => $tarea['descripcion'],
                    'comentario' => $comentarios[array_rand($comentarios)],
                    'fechaEntrega' => $fechaEntrega,
                ]);
            }
        }
    }
}
