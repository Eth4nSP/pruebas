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
        Schema::create('semana', function (Blueprint $table) {
            $table->id('idSemana');
            $table->unsignedBigInteger('idPlanificacion');
            $table->integer('numeroSemana');
            $table->date('fechaIni');
            $table->date('fechaFin');

            // Llave foránea idPlanificacion
            $table->foreign('idPlanificacion')
                ->references('idPlanificacion')
                ->on('planificacion')
                ->onDelete('cascade');

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
        Schema::dropIfExists('semana');
    }
};
