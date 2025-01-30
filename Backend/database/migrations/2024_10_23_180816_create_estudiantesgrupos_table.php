<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstudiantesgruposTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estudiantesgrupos', function (Blueprint $table) {

            $table->unsignedBigInteger('idEstudiante');
            $table->unsignedBigInteger('idGrupo');
            $table->boolean('disponibleEstudiante')->default('1');
            $table->primary(['idEstudiante', 'idGrupo']);

            // * Definir las claves foráneas
            $table->foreign('idEstudiante')
                ->references('idEstudiante')
                ->on('estudiante')
                ->onDelete('cascade');

            $table->foreign('idGrupo')
                ->references('idGrupo')
                ->on('grupo')
                ->onDelete('cascade');

            // * indice relationship 12
            $table->index('idGrupo', 'FK_Relationship_11');
            $table->index('idGrupo', 'FK_Relationship_12');

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
        Schema::dropIfExists('estudiantesgrupos');
    }
};
