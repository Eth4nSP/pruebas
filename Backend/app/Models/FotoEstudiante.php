<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoEstudiante extends Model
{
    protected $table = 'fotoestudiante'; // Nombre de la tabla en la base de datos
    protected $primaryKey = 'idFoto'; // Clave primaria
    public $timestamps = false; // No se utilizan timestamps en la tabla

    // Definir los campos que pueden ser asignados en masa
    protected $fillable = [
        'foto', 
        'idEstudiante'
    ];

    /**
     * Relación con el modelo Estudiante (un estudiante tiene una foto).
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(Estudiante::class, 'idEstudiante', 'idEstudiante');
    }
}
