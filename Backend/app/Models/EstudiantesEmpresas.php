<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstudiantesEmpresas extends Model
{
    protected $table = 'estudiantesempresas';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idEmpresa',
        'idEstudiante'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idEmpresa');
    }

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'idEstudiante');
    }
}
