<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTareaTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tarea', function (Blueprint $table) {
            $table->id('idTarea');
            $table->unsignedBigInteger('idSemana');
            $table->string('nombreTarea',40)->nullable();
            $table->tinyText('textoTarea')->nullable();
            $table->tinyText('comentario')->nullable();

            // * Llave foranea idSemana
            $table->foreign('idSemana')
                ->references('idSemana')
                ->on('semana')
                ->onDelete('cascade');
                
            $table->dateTime('fechaEntrega')->nullable();
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
        Schema::dropIfExists('tarea');
    }
};
