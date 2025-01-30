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
        Schema::create('entregables', function (Blueprint $table) {
            $table->id('idEntregables');
            $table->unsignedBigInteger('idSprint');
            $table->text('descripcionEntregable');
            $table->string('nombreArchivo',30)->nullable()->default(null);
            $table->longText('archivoEntregable')->nullable()->default(null);
            $table->boolean('aceptado')->nullable();
            $table->dateTime('fechaEntrega')->nullable();
            // * Llave foranea idSprint
            $table->foreign('idSprint')
                ->references('idSprint')
                ->on('sprint')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregables');
    }
};
