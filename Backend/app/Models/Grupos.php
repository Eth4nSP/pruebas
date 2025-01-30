<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupos extends Model
{
    protected $table = 'grupo'; // Nombre de la tabla en la base de datos
    protected $primaryKey = 'idGrupo';
    public $timestamps = false;
    protected $fillable = [
        'idDocente',
        'numGrupo',
        'gestionGrupo',
        'codigoAcceso',
        'descripcion',
        'fechaIniGestion',
        'fechaFinGestion',
        'fechaLimiteEntregaEmpresa',
        'fechaLimiteEntregaPlanificacion',
        'fechaFinPlanificacion',
    ];

    public function docentes()
    {
        return $this->belongsTo(Docente::class, 'idDocente'); // Relación con Docente
    }

    public function estudiantes()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiantes_grupos', 'idGrupo', 'idEstudiante');
    }
}
