<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComentarioTareaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comentarioTarea', function (Blueprint $table) {
            $table->unsignedBigInteger('idEstudiante'); // Clave foránea hacia estudiantes.idEstudiante
            $table->unsignedBigInteger('idSemana');         // Clave foránea hacia semanas.idSemana
            $table->text('comentario');                            // Comentario

            // Clave primaria compuesta
            $table->primary(['idEstudiante', 'idSemana']);

            // Llave foranea idEstudiante
            $table->foreign('idEstudiante')
                ->references('idEstudiante')->on('estudiante')
                ->onDelete('cascade'); // Borra comentarios al eliminar estudiante

            // Llave foranea idSemana
            $table->foreign('idSemana')
                ->references('idSemana')->on('semana')
                ->onDelete('cascade'); // Borra comentarios al eliminar semana
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comentarioTarea');
    }
}
