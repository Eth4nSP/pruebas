<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotasSemana extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'notassemana';

    // Clave primaria (opcional si no usas 'id')
    protected $primaryKey = 'idNota';

    // Campos que se pueden asignar en masa
    protected $fillable = [
        'idSemana',
        'idEstudiante',
        'nota',
        'semana', // La columna que agregaste recientemente
    ];

    // Deshabilitar timestamps si no usas created_at y updated_at
    public $timestamps = false;

    // Si las relaciones están definidas, puedes agregar las relaciones como métodos:

    // Relación con la tabla 'semana'
    public function semana()
    {
        return $this->belongsTo(Semana::class, 'idSemana', 'idSemana');
    }

    // Relación con la tabla 'estudiante'
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'idEstudiante', 'idEstudiante');
    }
}
