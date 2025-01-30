<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstudianteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estudiante', function (Blueprint $table) {
            $table->id('idEstudiante');
            $table->string('nombreCuenta', 20)->unique()->nullable();
            $table->string('nombreEstudiante', 20)->nullable();
            $table->string('primerApellido', 20)->nullable();
            $table->string('segundoApellido', 20)->nullable();
            $table->string('contrasena', 60)->nullable();
            $table->tinyInteger('numerodefaltasest')->nullable();
            $table->string ('email',40)->nullable();


            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estudiante');
    }
}

