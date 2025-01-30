<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComentarioTarea extends Model
{
    protected $table = 'comentariotarea';
    
    /**
     * Clave primaria compuesta (no nativo en Laravel)
     */
    protected $primaryKey = ['idEstudiante', 'idSemana'];
    public $incrementing = false; // No es autoincremental por ser compuesta

    public $timestamps = false;

    protected $fillable = [
        'idEstudiante',
        'idSemana',
        'comentario',
    ];

    /**
     * Encuentra un registro por clave primaria compuesta
     */
    public static function findByCompositeKey($idEstudiante, $idSemana)
    {
        return self::where('idEstudiante', $idEstudiante)
            ->where('idSemana', $idSemana)
            ->first();
    }

    /**
     * Crea o actualiza un registro basado en clave compuesta
     */
    public static function createOrUpdate($data)
    {
        // Encuentra el registro existente
        $record = self::findByCompositeKey($data['idEstudiante'], $data['idSemana']);

        if ($record) {
            // Actualiza el registro si ya existe
            $record->update(['comentario' => $data['comentario']]);
        } else {
            // Crea un nuevo registro si no existe
            self::create($data);
        }
    }

    /**
     * Obtiene el estudiante que tiene el comentario
     */
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'idEstudiante');
    }

    /**
     * Obtiene la semana que tiene el comentario
     */
    public function semana()
    {
        return $this->belongsTo(Semana::class, 'idSemana');
    }
}
