<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tarea;
class ArchivoTarea extends Model
{
    protected $table = 'archivostarea';
    protected $primaryKey = 'idArchivo';
    public $timestamps = false;

    protected $fillable = ['idTarea', 'archivo', 'nombreArchivo', 'fechaEntrega']; // Agregar fechaEntrega aquí
    // Relación con la tarea
    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'idTarea');
    }
}