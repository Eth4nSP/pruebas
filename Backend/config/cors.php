<?php

use function PHPUnit\Framework\isTrue;

//return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    /*'paths' => ['api/*', 'sanctum/csrf-cookie','web/*','grupo/*', 'session/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];*/
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],  // Asegúrate de permitir las rutas de la API y el CSRF cookie

    'allowed_methods' => ['*'],  // Permitir todos los métodos HTTP

    'allowed_origins' => ['http://localhost:5173', 'http://creativeharbor.tis.cs.umss.edu.bo'],  // Permite el origen de tu frontend en Vue.js

    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept', 'Origin', 'X-CSRF-TOKEN'],
    'exposed_headers' => [], // Necesario para descargas
    'max_age' => 0,
    //'allow_credentials' => true,
    'supports_credentials' => true,  // Permite que las cookies se envíen
];
