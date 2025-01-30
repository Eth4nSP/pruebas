<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGrupoTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grupo', function (Blueprint $table) {
            $table->id('idGrupo');
            $table->unsignedBigInteger('idDocente');
            $table->integer('numGrupo')->nullable();
            $table->string('gestionGrupo',6)->nullable();
            $table->string('codigoAcceso',20)->nullable();
            $table->longText('descripcion')->nullable();
            $table->date('fechaIniGestion')->nullable();
            $table->date('fechaFinGestion')->nullable();
            $table->date('fechaLimiteEntregaEmpresa')->nullable();
            $table->date('fechaLimiteEntregaPlanificacion')->nullable();
            $table->date('fechaFinPlanificacion')->nullable();

            // * Llave foranea idDocente
            $table->foreign('idDocente')
                  ->references('idDocente')
                  ->on('docente')
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
        Schema::dropIfExists('grupo');
    }
};
