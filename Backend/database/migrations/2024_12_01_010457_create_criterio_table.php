<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriterioTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('criterio', function (Blueprint $table) {
            $table->id('idCriterio');
            $table->unsignedBigInteger('idEvaluacionesGrupo');
            $table->string('descripcion');
            $table->integer('rangoMaximo');

            // * Llave foranea
            $table->foreign('idEvaluacionesGrupo')
                  ->references('idEvaluacionesGrupo')
                  ->on('evaluacionesgrupo')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criterio');
    }
};
