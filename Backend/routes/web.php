<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{any}', function () {
    return view('index');
})->where('any','.*');


// Ruta para el admin (manejada por el frontend)
/*Route::get('/estotienequeserunlinkrandomsuperlargo/{any}', function () {
    return view('index'); // Sigue cargando el mismo index
})->where('any','.*');;
*/