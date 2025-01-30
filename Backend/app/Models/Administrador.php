<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'administrador';

    /**
     * Clave primaria de la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'idAdministrador';

    /**
     * Indica si la clave primaria es incremental.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * Indica si las marcas de tiempo (timestamps) se manejan automáticamente.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atributos asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'nombreCuenta',
        'contrasena',
        'email',
    ];

    /**
     * Oculta ciertos atributos al serializar el modelo.
     *
     * @var array
     */
    protected $hidden = [
        'contrasena', // Oculta la contraseña
    ];
}
