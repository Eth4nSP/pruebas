<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planificacion extends Model
{
    protected $table = 'planificacion';
    protected $primaryKey = 'idPlanificacion';
    public $timestamps = false;

    protected $fillable = [
        'idEmpresa', 
        'aceptada', 
        'publicada',
        'fechaEntrega',
        'comentariopublico',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idEmpresa');
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class, 'idPlanificacion');
    }

    public function semanas()
    {
        return $this->hasMany(Semana::class, 'idPlanificacion');
    }

}
