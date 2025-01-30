<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterio extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'criterio';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idCriterio';

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
        'descripcion',
        'rangoMaximo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'rangoMaximo' => 'integer',
    ];

    /**
     * Get the evaluacionGrupo that owns the criterio.
     */
    public function evaluacionGrupo()
    {
        return $this->belongsTo(EvaluacionesGrupo::class, 'idEvaluacionesGrupo', 'idEvaluacionesGrupo');
    }
}