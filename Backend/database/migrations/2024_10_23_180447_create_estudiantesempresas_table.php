<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstudiantesempresasTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estudiantesempresas', function (Blueprint $table) {
            $table->unsignedBigInteger('idEmpresa');
            $table->unsignedBigInteger('idEstudiante');

            $table->primary(['idEmpresa', 'idEstudiante']);

            // * Definir las claves foráneas
            $table->foreign('idEstudiante')
                ->references('idEstudiante')
                ->on('estudiante')
                ->onDelete('cascade');

            $table->foreign('idEmpresa')
                ->references('idEmpresa')
                ->on('empresa')
                ->onDelete('cascade');

            // * Índices de llave foranea
            $table->index('idEstudiante', 'FK_Relationship_14');
            $table->index('idEmpresa', 'FK_Relationship_15');


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
        Schema::dropIfExists('estudiantesempresas');
    }
};
