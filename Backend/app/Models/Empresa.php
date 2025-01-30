<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresa';
    protected $primaryKey = 'idEmpresa';
    public $timestamps = false;
    protected $fillable = [
        'nombreEmpresa',
        'nombreLargo',
        'numerodefaltasempresa',
        'notaproductofinal',
        'publicada'
    ];

    public function estudiantes()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiantesempresas', 'idEmpresa', 'idEstudiante');
    }

    public function planificaciones()
    {
        return $this->hasMany(Planificacion::class, 'idEmpresa');
    }

    public function sprints()
    {
        return $this->hasManyThrough(
            Sprint::class,
            Planificacion::class,
            'idEmpresa', // Foreign key en Planificacion
            'idPlanificacion', // Foreign key en Sprint
            'idEmpresa', // Local key en Empresa
            'idPlanificacion' // Local key en Planificacion
        );
    }
}
