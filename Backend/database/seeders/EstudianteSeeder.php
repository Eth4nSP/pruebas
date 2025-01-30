<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EstudianteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estudiantes = [
            ['agarcia', 'Ana', 'García', 'Sanchez', 'passAna1', NULL],
            ['lhernandez', 'Luis', 'Hernández', 'Torres', 'passLuis2', NULL],
            ['jmendez', 'Juan', 'Méndez', 'Lopez', 'passJuan3', NULL],
            ['srodriguez', 'Sofia', 'Rodríguez', 'Ramirez', 'passSofia4', NULL],
            ['cdiaz', 'Carlos', 'Díaz', 'Fernández', 'passCarlos5', NULL],
            ['lmorales', 'Lucía', 'Morales', 'González', 'passLucia6', NULL],
            ['dcruz', 'David', 'Cruz', 'Muñoz', 'passDavid7', NULL],
            ['emartinez', 'Elena', 'Martínez', 'Vargas', 'passElena8', NULL],
            ['jlopez', 'Jorge', 'Lopez', 'Pacheco', 'passJorge9', NULL],
            ['pperez', 'Paula', 'Pérez', 'Gómez', 'passPaula10', NULL],
            ['acastro', 'Antonio', 'Castro', 'Silva', 'passAntonio11', NULL],
            ['mfernandez', 'María', 'Fernández', 'Rojas', 'passMaria12', NULL],
            ['rmolina', 'Raquel', 'Molina', 'Torres', 'passRaquel13', NULL],
            ['fcarrasco', 'Felipe', 'Carrasco', 'Ramírez', 'passFelipe14', NULL],
            ['scampos', 'Sara', 'Campos', 'López', 'passSara15', NULL],
            ['malonso', 'Miguel', 'Alonso', 'Ortiz', 'passMiguel16', NULL],
            ['cmoreno', 'Claudia', 'Moreno', 'Jiménez', 'passClaudia17', NULL],
            ['areyes', 'Antonio', 'Reyes', 'Castillo', 'passAntonio18', NULL],
            ['ivega', 'Isabel', 'Vega', 'Espinoza', 'passIsabel19', NULL],
            ['aflores', 'Alberto', 'Flores', 'Salinas', 'passAlberto20', NULL],
            ['rmontes', 'Rosa', 'Montes', 'Hernández', 'passRosa21', NULL],
            ['tvillar', 'Tomás', 'Villar', 'García', 'passTomas22', NULL],
            ['squintana', 'Sandra', 'Quintana', 'Ramos', 'passSandra23', NULL],
            ['hpena', 'Hugo', 'Peña', 'Maldonado', 'passHugo24', NULL],
            ['vjoaco', 'Joaquin', 'Villarpando', 'Maldonado', 'passJoaco25', NULL],
            ['aricky', 'Ricardo', 'Aguilar', 'Choque', 'passRicky26', NULL],
            ['jsilva', 'Juan', 'Silva', 'Perez', 'passJuan27', NULL],
            ['cgomez', 'Clara', 'Gomez', 'Rivera', 'passClara28', NULL],
            ['dsantos', 'Diego', 'Santos', 'Sanchez', 'passDiego29', NULL],
            ['eperez', 'Elena', 'Perez', 'Quispe', 'passElena30', NULL],
            ['framos', 'Fernando', 'Ramos', 'Medina', 'passFernando31', NULL],
            ['mlopez', 'Maria', 'Lopez', 'Hernandez', 'passMaria32', NULL],
            //para grupo 3
            ['ajimenez', 'Ana', 'Jiménez', 'Torres', 'passAna33', NULL],
            ['dperez', 'David', 'Pérez', 'Mendoza', 'passDavid34', NULL],
            ['cgarcia', 'Carlos', 'García', 'Morales', 'passCarlos35', NULL],
            ['fmartinez', 'Francisco', 'Martínez', 'Rojas', 'passFrancisco36', NULL],
            ['nrodriguez', 'Nina', 'Rodríguez', 'Guzmán', 'passNina37', NULL],
            ['bvasquez', 'Berta', 'Vásquez', 'López', 'passBerta38', NULL],
            ['jmartinez', 'Jorge', 'Martínez', 'Salazar', 'passJorge39', NULL],
            ['mmorales', 'Marta', 'Morales', 'Fernández', 'passMarta40', NULL],
            ['rgarcia', 'Ricardo', 'García', 'Ramírez', 'passRicardo41', NULL],
            //sin grupo matriculado
            ['pcastro', 'Patricia', 'Castro', 'Paredes', 'passPatricia42', NULL],
            ['asanchez', 'Antonio', 'Sánchez', 'Vega', 'passAntonio43', NULL],
            ['lrojas', 'Lucía', 'Rojas', 'Alvarado', 'passLucia44', NULL],

        ];

        foreach ($estudiantes as $index => $estudiante) {
            DB::table('estudiante')->insert([
                'idEstudiante' => $index + 1,
                'nombreCuenta' => $estudiante[0],
                'nombreEstudiante' => $estudiante[1],
                'primerApellido' => $estudiante[2],
                'segundoApellido' => $estudiante[3],
                'contrasena' => Hash::make($estudiante[4]),
                'numerodefaltasest' => $estudiante[5],
                'email' => strtolower($estudiante[1] . '.' . $estudiante[2] . $index . '@gmail.com')
            ]);
        }
    }
}
