<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFotoEstudianteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fotoestudiante', function (Blueprint $table) {
            $table->id('idFoto');  // Clave primaria con autoincremento
            $table->longText('foto');  // Campo para almacenar el contenido de la foto
            $table->unsignedBigInteger('idEstudiante');  // Llave foránea idDocente como bigint

            // Índices
            $table->index('idEstudiante', 'FK_fk_FotoEstudiante_Estudiante');  // Índice en idDocente

            // Relación foránea con la tabla docentes
            $table->foreign('idEstudiante')
                  ->references('idEstudiante')  // Debe ser la clave primaria de la tabla docente
                  ->on('estudiante')
                  ->onDelete('cascade')      // Elimina las fotos si se elimina el docente
                  ->onUpdate('cascade');     // Actualiza en cascada si cambia el idDocente
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fotoestudiante');
    }
}
