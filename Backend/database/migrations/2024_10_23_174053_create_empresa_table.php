<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmpresaTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('empresa', function (Blueprint $table) {
            $table->id('idEmpresa');
            $table->unsignedBigInteger('idGrupo');
            $table->string('nombreEmpresa',24)->unique()->nullable();
            $table->string('nombreLargo',50)->unique()->nullable();
            $table->tinyInteger('numerodefaltasempresa')->nullable();
            $table->tinyInteger('notaproductofinal')->nullable();
            $table->boolean('publicada')->nullable();

            // * Llave foranea idGrupo
            $table->foreign('idGrupo')
                ->references('idGrupo')
                ->on('grupo')
                ->onDelete('cascade');
        });
    }

    /**
     * 
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresa');
    }
};
