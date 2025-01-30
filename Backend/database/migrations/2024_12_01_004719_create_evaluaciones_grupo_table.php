<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluacionesGrupoTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('evaluacionesgrupo', function (Blueprint $table) {
            $table->id('idEvaluacionesGrupo');
            $table->unsignedBigInteger('idGrupo');
            $table->date('fechaEvaluacion');
            $table->enum('tipoEvaluacion', ['evaluacionCruzada', 'autoevaluacion', 'evaluacionPares']);
            // * Llave foranea
            $table->foreign('idGrupo')->references('idGrupo')->on('grupo');
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