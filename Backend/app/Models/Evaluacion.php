<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluacion extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluacion';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idEvaluacion';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idEvaluacionesGrupo',
        'idEvaluadorEstudiante',
        'idEvaluadoEstudiante',
        'idEvaluadoEmpresa',
        'tipoEvaluacion',
        'horaEvaluacion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'tipoEvaluacion' => 'string',
        'horaEvaluacion' => 'datetime',
    ];

    /**
     * Get the evaluacionGrupo associated with the evaluacion.
     */
    public function evaluacionGrupo()
    {
        return $this->belongsTo(EvaluacionesGrupo::class, 'idEvaluacionesGrupo', 'idEvaluacionesGrupo');
    }

    /**
     * Get the estudiante evaluador associated with the evaluacion.
     */
    public function evaluadorEstudiante()
    {
        return $this->belongsTo(Estudiante::class, 'idEvaluadorEstudiante', 'idEstudiante');
    }

    /**
     * Get the estudiante evaluado associated with the evaluacion.
     */
    public function evaluadoEstudiante()
    {
        return $this->belongsTo(Estudiante::class, 'idEvaluadoEstudiante', 'idEstudiante');
    }
    
    /**
     * Get the empresa evaluadora associated with the evaluacion.
     */
    public function evaluadoEmpresa()
    {
        return $this->belongsTo(Empresa::class, 'idEvaluadoEmpresa', 'idEmpresa');
    }
}