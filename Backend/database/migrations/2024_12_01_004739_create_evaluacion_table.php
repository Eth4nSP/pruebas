<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluacionTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('evaluacion', function (Blueprint $table) {
            $table->id('idEvaluacion');
            $table->unsignedBigInteger('idEvaluacionesGrupo');
            $table->unsignedBigInteger('idEvaluadorEstudiante')->nullable();
            $table->unsignedBigInteger('idEvaluadoEstudiante')->nullable();
            $table->unsignedBigInteger('idEvaluadoEmpresa')->nullable();
            
            $table->time('horaEvaluacion')->nullable();
            $table->integer('notaTotal')->nullable()->default(null);

            // * Llaves foráneas
            $table->foreign('idEvaluacionesGrupo')->references('idEvaluacionesGrupo')->on('evaluacionesgrupo');
            $table->foreign('idEvaluadorEstudiante')->references('idEstudiante')->on('estudiante');
            $table->foreign('idEvaluadoEstudiante')->references('idEstudiante')->on('estudiante');
            $table->foreign('idEvaluadoEmpresa')->references('idEmpresa')->on('empresa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluacion');
    }
};
