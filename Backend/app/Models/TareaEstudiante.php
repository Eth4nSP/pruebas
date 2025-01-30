<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TareaEstudiante extends Model
{
    protected $table = 'tareasestudiantes';
    protected $primaryKey = ['idEstudiante', 'idTarea']; 
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['idTarea', 'idEstudiante'];

    public function tareas()
    {
        return $this->belongsTo(Tarea::class, 'idTarea');
    }

    public function estudiantes()
    {
        return $this->belongsTo(Estudiante::class, 'idEstudiante');
    }
}
