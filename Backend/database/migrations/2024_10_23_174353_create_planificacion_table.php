<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanificacionTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('planificacion', function (Blueprint $table) {
            $table->id('idPlanificacion');
            $table->unsignedBigInteger('idEmpresa');
            $table->boolean('aceptada')->nullable();
            $table->boolean('publicada')->nullable();
            $table->dateTime('fechaEntrega');
            $table->text('comentariopublico')->nullable();
            // * Llave foranea idEmpresa
            $table->foreign('idEmpresa')
                ->references('idEmpresa')
                ->on('empresa')
                ->onDelete('cascade');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planificacion');
    }
};
