<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionesGrupo extends Model
{
    protected $table = 'evaluacionesgrupo';
    protected $primaryKey = 'idEvaluacionesGrupo';
    public $timestamps = false;
    protected $fillable = [
        'idGrupo',
        'fechaEvaluacion',
    ];

    // * Relación con la tabla grupo (pertenece a)
    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'idGrupo', 'idGrupo');
    }
    // * Relacion con la tabla Evaluacion (tiene varios)
    public function evaluaciones()
    {
        return $this->hasMany(Evaluacion::class, 'idEvaluacionesGrupo', 'idEvaluacionesGrupo');
    }
    public function criterios()
    {
        return $this->hasMany(Criterio::class, 'idEvaluacionesGrupo', 'idEvaluacionesGrupo');
    }
}
