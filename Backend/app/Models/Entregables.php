<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entregables extends Model
{

    protected $table = 'entregables';
    protected $primaryKey = 'idEntregables';

    // * Deshabilitar timestamps porque no hay
    public $timestamps = false;

    protected $fillable = [
        'idSprint',
        'descripcionEntregable',
        'archivoEntregable',
        'nombreArchivo',
        'aceptado',
        'fechaEntrega',
    ];

    /**
     * * Relación con el modelo Sprint
     * Varios entregables pertenecen a un sprint
     */
    public function sprint()
    {
        return $this->belongsTo(Sprint::class, 'idSprint', 'idSprint');
    }
}
