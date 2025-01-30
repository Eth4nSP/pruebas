<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupo';
    protected $primaryKey = 'idGrupo';
    public $timestamps = false; // Especificar si no usas timestamps automáticos
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
        'fechaFinPlanificacion'
    ];

    public function estudiantesGrupos()
    {
        return $this->hasMany(EstudiantesGrupos::class, 'idGrupo');
    }

    public function estudiantes()
    {
        return $this->belongsToMany(Estudiante::class, 'estudiantesgrupos', 'idGrupo', 'idEstudiante')
                    ->withPivot('disponibleEstudiante'); // Agregar el campo del pivote
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'idDocente');
    }
    
    public function empresas(){
        return $this->hasMany(Empresa::class, 'idGrupo');
    }
}
