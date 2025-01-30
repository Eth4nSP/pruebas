<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocenteTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('docente', function (Blueprint $table) {
            $table->id('idDocente');
            $table->string('nombreCuenta',15)->unique();
            $table->string('nombreDocente',10)->nullable();
            $table->string('primerApellido',10)->nullable();
            $table ->string('segundoApellido',10)->nullable();
            $table->string ('contrasena',60)->nullable();
            $table->string ('descripcionDocente',500)->nullable();
            $table->string ('email',40)->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docente');
    }
};
