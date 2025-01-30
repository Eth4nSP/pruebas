<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotaPorCriterio extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notaporcriterio';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idNotaPorCriterio';

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
        'idEvaluacion',
        'idCriterio',
        'calificacion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'calificacion' => 'decimal:2',
    ];

    /**
     * Get the evaluacion that owns the nota por criterio.
     */
    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'idEvaluacion', 'idEvaluacion');
    }

    /**
     * Get the criterio that owns the nota por criterio.
     */
    public function criterio()
    {
        return $this->belongsTo(Criterio::class, 'idCriterio', 'idCriterio');
    }
}