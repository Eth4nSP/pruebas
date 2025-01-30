<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Estudiante;
use App\Models\Docente;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class RecuperarController extends Controller{
    public function recuperarContrasena(Request $request){
        try{   
            //recibo los datos
            $validated = $request->validate([
                'correo' => 'required|string|email',
                'codigo' => 'required|string',
            ]);
            //compruebo si existe algun usuario con ese correo
            $userE = Estudiante::where('email', $validated['correo'])->first();
            $userD = Docente::where('email', $validated['correo'])->first();
           if($userE){
            //una vez verificado envio un email con el codigo
            Mail::raw('Usuario: '. $userE->nombreCuenta .', Su codigo de recuperacion es: '.$validated['codigo'], function ($message) use ($validated) {
                $message->to($validated['correo'])
                        ->subject('Recuperar contraseña')  // Usamos el subject desde la entrada
                        ->from('ethan1705.gerl@gmail.com', 'Creative Harbor');
            });
            return response()->json(['correo_enviado' => $validated['correo'],
                    'id' => $userE->idEstudiante,
                    'role' => 'estudiante'], 200);
           }elseif($userD){
            Mail::raw('Docente: '. $userD->nombreCuenta .', Su codigo de recuperacion es: '.$validated['codigo'], function ($message) use ($validated) {
                $message->to($validated['correo'])
                        ->subject('Recuperar contraseña')  // Usamos el subject desde la entrada
                        ->from('ethan1705.gerl@gmail.com', 'Creative Harbor');
            });
            return response()->json(['correo_enviado' => $validated['correo'],
                        'id' => $userD->idDocente,
                        'role' => 'docente'], 200);
           }else{
            return response()->json(['error' => 'correo no encontrado'], 400);
           }
            
            
        } catch (Exception $e) {
            //en caso de error
            return response()->json([
                'error' => 'Correo no enviado',
                'mensaje' => $e->getMessage(),
            ], 400);
        }
    }
    public function cambiarContrasena(Request $request){
        try{
            //recibo los datos
            $validated = $request->validate([
                'contrasena' => 'required|string', 
                'repetirContrasena' => 'required|string',
                'id' => 'required|integer',
                'role' => 'required|string'
            ]);
            //compruebo la
            if ($validated['contrasena'] !== $validated['repetirContrasena']) {
                return response()->json(['error' => 'Las contraseñas no coinciden.'], 400);
            }
            if($validated['role'] === 'estudiante'){
                $estudiante = Estudiante::find($validated['id']);
                if (!$estudiante) {
                    return response()->json(['error' => 'Estudiante no encontrado.'], 404);
                }
                $estudiante->contrasena = Hash::make($validated['contrasena']);  
                $estudiante->save();
        
                return response()->json(['mensaje E' => 'Contraseña actualizada correctamente.'], 200);
                
            }elseif($validated['role'] === 'docente'){
                $docente = Docente::find($validated['id']);
                if (!$docente) {
                    return response()->json(['error' => 'Docente no encontrado.'], 404);
                }
                $docente->contrasena = Hash::make($validated['contrasena']);    
                $docente->save();
                return response()->json(['mensaje D' => 'Contraseña actualizada correctamente.'], 200);
                
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar la contraseña',
                'mensaje' => $e->getMessage(),
            ], 500);
        }
    }

}