<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $table = 'sprint';
    protected $primaryKey = 'idSprint';
    public $timestamps = false;

    protected $fillable = [
        'idPlanificacion', 
        'numeroSprint',
        'fechaIni',
        'fechaFin',
        'fechaEntrega',
        'cobro',
        'comentario',
        'nota',
    ];

    public function planificacion()
    {
        return $this->belongsTo(Planificacion::class, 'idPlanificacion');
    }


    
    public function entregables()
    {
        return $this->hasMany(Entregables::class, 'idSprint', 'idSprint');
    }

    
}
