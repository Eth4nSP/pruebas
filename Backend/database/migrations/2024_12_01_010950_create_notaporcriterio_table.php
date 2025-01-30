<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notaporcriterio', function (Blueprint $table) {
            $table->id('idNotaPorCriterio');
            $table->unsignedBigInteger('idEvaluacion');
            $table->unsignedBigInteger('idCriterio');
            $table->decimal('calificacion', 5, 2);

            // * Llaves foraneas
            $table->foreign('idEvaluacion')
                  ->references('idEvaluacion')
                  ->on('evaluacion')
                  ->onDelete('cascade');

            $table->foreign('idCriterio')
                  ->references('idCriterio')
                  ->on('criterio')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notaporcriterio');
    }
};
