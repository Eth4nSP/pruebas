<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFotoDocenteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fotodocente', function (Blueprint $table) {
            $table->id('idFoto');  // Clave primaria con autoincremento
            $table->longText('foto');  // Campo para almacenar el contenido de la foto
            $table->unsignedBigInteger('idDocente');  // Llave foránea idDocente como bigint

            // Índices
            $table->index('idDocente', 'FK_fk_FotoDocente_Docente');  // Índice en idDocente

            // Relación foránea con la tabla docentes
            $table->foreign('idDocente')
                  ->references('idDocente')  // Debe ser la clave primaria de la tabla docente
                  ->on('docente')
                  ->onDelete('cascade')      // Elimina las fotos si se elimina el docente
                  ->onUpdate('cascade');     // Actualiza en cascada si cambia el idDocente
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fotodocente');
    }
}
