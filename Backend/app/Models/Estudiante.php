<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;

class Estudiante extends Model implements Authenticatable
{
    use AuthenticatableTrait;  // Asegura que el modelo cumpla con los requisitos de autenticación.

    protected $table = 'estudiante';
    protected $primaryKey = 'idEstudiante';
    public $timestamps = false;

    protected $fillable = [
        'nombreCuenta',
        'nombreEstudiante',
        'primerApellido',
        'segundoApellido',
        'contrasena',
        'numerodefaltasest',
        'email'
    ];

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'estudiantesgrupos', 'idEstudiante', 'idGrupo')
                    ->withPivot('disponibleEstudiante');
    }

    public function empresas()
    {
        return $this->belongsToMany(Empresa::class, 'estudiantesempresas', 'idEstudiante', 'idEmpresa');
    }
}
