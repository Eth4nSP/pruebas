<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTareasestudiantesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tareasestudiantes', function (Blueprint $table) {
            $table->unsignedBigInteger('idEstudiante');
            $table->unsignedBigInteger('idTarea');

            $table->primary(['idEstudiante', 'idTarea']);

            // * Definir las claves foráneas
            $table->foreign('idEstudiante')
                ->references('idEstudiante')
                ->on('estudiante')
                ->onDelete('cascade');

            $table->foreign('idTarea')
                ->references('idTarea')
                ->on('tarea')
                ->onDelete('cascade');

            // * Índices de llave foranea
            $table->index('idEstudiante', 'FK_Relationship_18');
            $table->index('idTarea', 'FK_Relationship_17');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareasestudiantes');
    }
};
