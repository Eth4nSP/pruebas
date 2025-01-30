<?php
/*
esto es un prueba de subir al git 2
*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Estudiante\TareaController;
use App\Http\Controllers\Docente\GrupoController;
use App\Http\Controllers\Estudiante\EstudianteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Empresa\PlanificacionController;
use App\Http\Controllers\Empresa\DocenteController;
use App\Http\Controllers\Empresa\SprintController;
use App\Http\Controllers\Estudiante\EstudiantesEmpresasController;
use App\Http\Controllers\Empresa\EntregablesController;
use App\Http\Controllers\Empresa\EmpresaController;
use App\Http\Controllers\ComentarioTareaController;
use App\Http\Controllers\joaquinController;
use App\Http\Controllers\Estudiante\SesionEstudianteController;
use App\Http\Controllers\Docente\SesionDocenteController;
use App\Http\Controllers\Administrador\AdministradorController;
use App\Http\Controllers\EvaluacionController;
use App\Http\Controllers\EvaluacionesGrupoController;
use App\Http\Controllers\HU_listaGruposDeDocente\GestionController;
use App\Models\EvaluacionesGrupo;

use App\Http\Controllers\RecuperarController;

//============================= GET EMPRESA ================================

/*Route::get('/', function () {
    return view('index');
})*/

Route::get('/empresa/{id}', [EmpresaController::class, 'getEmpresaData']);
Route::get('/nombreEmpresa/{id}', [EmpresaController::class, 'getNombreEmpresa']);
// ----Listar Empresas-----
// ---obtiene una lista de todas las empresas
Route::get('/empresas/listaEmpresas', [EmpresaController::class, 'getListaEmpresas']);
//---Recibe todos los estudiantes del grupo del estudiante logeado
Route::get('/empresas/obtenerEstudiantes',[EstudianteController::class, 'obtenerEstudiantesPorGrupo']);
Route::get('/empresas/{idEmpresa}/calificaciones', [EmpresaController::class, 'getCalificacionesEmpresa']);
//---Recibe la nota del sprint seleccionado
Route::get('/empresas/notaSprint/{idEmpresa}/{semana}', [SprintController::class, 'obtenerResultadoEvaluacionesPrevias']);


//============================= GET ESTUDIANTE =============================
//---Recupera la tarea
Route::get('/tarea/{idTarea}/{idEmpresa}', [TareaController::class, 'obtenerTarea']);
Route::get('/estudiante/gruposDocente', [GrupoController::class, 'obtenerTodosLosGrupos']);
Route::get('/estudiante/descripcionGrupo/{idGrupo}', [GrupoController::class, 'getDescripcion']);
Route::get('/estudiante/sprint/semana/{idSprint}',[SprintController::class, 'sprintsSemanas']);
Route::get('/estudiante/obtenerEmpresasPorGrupoYDocenteEstudiante/{idGrupo}',[GrupoController::class, 'obtenerEmpresasPorGrupoYDocenteEstudiante']);

//============================= GET DOCENTE ================================
//---Recibe la lista de estudiantes de un grupo especifico del docente activo
Route::get('/docente/listaEstudiantes', [GrupoController::class, 'obtenerEstudiantesPorGrupo']);
//---Recibe las empresas del grupo del docente y del docente activo
Route::get('/docente/obtenerEmpresasPorGrupoYDocente',[GrupoController::class, 'obtenerEmpresasPorGrupoYDocente']);


//-- sprints con toda su informacion y los entragables
Route::get('/empresa/{idEmpresa}/sprintsEntregables', [EmpresaController::class, 'getSprintsEntregables']);

Route::get('/empresa/{idEmpresa}/semanasTareas', [EmpresaController::class, 'getSemanasTareas']);

//-- empresas de un grupo
Route::get('/grupo/{idGrupo}/empresas', [GrupoController::class, 'getEmpresasPorGrupo']);
//-- sprints y estudiantes de una empresa
Route::get('/empresa/{idEmpresa}/sprints-estudiantes', [EmpresaController::class, 'obtenerSprintsYEstudiantes']);


//============================= PLANIFICACION ==============================

Route::get('/planificacion/{idEmpresa}', [PlanificacionController::class, 'show']);


// ----Visualizar Sprint-----
// Devuelve todos los datos del Sprint por id
Route::get('/getSprintPorId', [SprintController::class, 'getSprintPorId']);
// Devuelve una lista de Sprints por idEmpresa
Route::get('/getListaSprintsPorIdEmpresa', [SprintController::class, 'getListaSprintsPorIdEmpresa']);
// ----añadir revision-----
// cambia la revision como valida
Route::put('/validar', [PlanificacionController::class, 'validar']);
// cambia la revision como rechazada
Route::put('/rechazar', [PlanificacionController::class, 'rechazar']);

// ----publicar planificacion-----
// publica una planificacion
Route::put('/publicarPlanificacion', [PlanificacionController::class, 'publicar']);

// añade los comentarios y la nota
Route::post('/addRevision', [PlanificacionController::class, 'addRevision']);

// ----Listar Empresas-----
// obtiene una lista de todas las empresas
Route::get('/empresas/', [EmpresaController::class, 'getListaEmpresas']);

// obtiene una lista de todas las empresas que aun no fueron validadas
Route::get('/planificacionesSinValidar', [PlanificacionController::class, 'planificacionesSinValidar']);
// obtiene una lista de todas las empresas que no fueron publicadas
Route::get('/planificacionesSinPublicar', [PlanificacionController::class, 'planificacionesSinPublicar']);
// obtiene una lista de todas las empresas de las que se puede modificar su planificacion
Route::get('/planificacionesParaModificar', [PlanificacionController::class, 'planificacionesParaModificar']);

Route::get('/planificacion/notaComentario/{idPlanificacion}', [PlanificacionController::class, 'notaComentario']);
Route::get('/planificacionAceptadas', [PlanificacionController::class, 'planificacionAceptadas']);
Route::get('/planificacionRechazadas', [PlanificacionController::class, 'planificacionRechazadas']);
Route::get('/getEvaluacionesGrupo/{idGrupo}', [EvaluacionesGrupoController::class, 'getEvaluacionesGrupo']);

Route::get('/getDatosEvaluacion/{idGrupo}', [EvaluacionesGrupoController::class, 'getDatosEvaluacion']);

// ===================== NO SE DONDE IRIA ESTO  {Checkar los creadores}===============
//Route::get('/docente/empresa/{idEmpresa}', [PlanificacionController::class, 'obtenerDocentePorEmpresa']);
//tests
//---Modificar planificacion---
//tests para ver lista de sprints y sprints por ID
Route::get('/testGetSprint',[SprintController::class, 'testSprintPorId']);

Route::get('/testGetListaSprints',[SprintController::class, 'testListaSprintsPorIdEmpresa']);
//tests para ver si los sprints insertados se guardan
Route::get('/testGuardar', [SprintController::class, 'testModificarSprint']);
//tests para  ver si la planificacion se actualiza o se crea si no existe
Route::get('/testGuardarPlanificacion', [PlanificacionController::class, 'testModificarPlanificacion']);
Route::get('/testGuardarEntregables', [EntregablesController::class, 'testGuardarEntregables']);

Route::get('/testConfigurarEvaluacion', [EvaluacionesGrupoController::class, 'testConfigurarEvaluacion']);
Route::get('/testEvaluacion', [EvaluacionController::class, 'testEvaluacion']);

//============================= EVALUACION ==============================

Route::get('/getDatosParaEvaluar/{idEstudiante}', [EvaluacionController::class, 'getDatosParaEvaluar']);
// ==================================   RUTAS POST =================================

//============================= POST EVALUACION ==============================
//configurar la evaluacion final
Route::post('/configurarEvaluacion', [EvaluacionesGrupoController::class, 'configurarEvaluacion']);
//realizar una evaluacion, calificarla
Route::post('/evaluar', [EvaluacionController::class, 'evaluar']);
// ==================================   POST PLANIFICACION    ==================================

// ---Cambia la revision como valida---
Route::put('/planificacion/validar', [PlanificacionController::class, 'validar']);
Route::put('/planificacion/publicarPlanificacion', [PlanificacionController::class, 'publicar']);
// ---añade los comentarios y la nota
Route::post('/planificacion/addRevision', [PlanificacionController::class, 'addRevision']);

Route::post('/aceptarEntregables', [EntregablesController::class, 'aceptarEntregables']);




// ==================================   POST ESTUDIANTE     =====================================
// ---Ruta para crear una tarea
Route::post('/tarea/crear', [TareaController::class, 'store']);
// ---Para asignar grupos
Route::post('/estudiante/asignarEstudiante', [EstudianteController::class, 'asignarEstudianteAGrupo']);
// ---Crea la empresa
Route::post('/estudiante/crearEmpresa', [EstudiantesEmpresasController::class, 'crearEmpresa']);

// ===================================   POST EMPRESA       =======================================

// * Para Crear y modificar una Planificacion
Route::post('/planificacion/guardarPlanificacion', [PlanificacionController::class, 'guardarPlanificacion']);
// * Para Crear y modificar los Sprints
Route::post('/planificacion/guardarSprints', [SprintController::class, 'guardarSprints']);
// * Para Crear y modificar los Entregables
Route::post('/planificacion/guardarEntregables', [EntregablesController::class, 'guardarEntregables']);

// ===================================   POST DOCENTE       =======================================

// ---barras de busqueda
Route::post('/docente/listaEstudiante/barraBusqueda', [GrupoController::class, 'barraBusquedaEstudiante']);
Route::post('/docente/listaEmpresa/barraBusqueda', [GrupoController::class, 'barraBusquedaEmpresas']);
Route::post('/docente/darDeBaja', [GrupoController::class, 'darDeBaja']);

// ---Ruta para modificar una tarea con sus archivos
Route::post('/tarea/{idTarea}/guardar', [TareaController::class, 'update']);

// ---Realizar evaluacion semanal
Route::post('/docente/evaluacion', [SprintController::class, 'crearOActualizarNotaTarea']);

Route::get('/docente/notasTarea/{idEmpresa}', [SprintController::class, 'getNotasTareasEstudiantes']);


Route::get('/empresa/{idEmpresa}/sprint/{idSprint}/tareas', [SprintController::class, 'getSprintEvaluar']);
Route::get('/empresa/{idEmpresa}/semana/{idSemana}/tareas', [TareaController::class, 'getTareasSemana']);
Route::get('/empresa/{idEmpresa}/sprintsEntregables', [EmpresaController::class, 'getSprintsEntregables']);



Route::put('/empresa/{idEmpresa}/sprint/{idSprint}/semana/{idSemana}/tareas', [TareaController::class, 'updateTareasSemana']);
Route::post('/empresa/{idEmpresa}/sprint/{idSprint}/evaluacion', [SprintController::class, 'updateSprintEvaluar']);

// ----post docente nota sprint
Route::post('/sprint/{idSprint}/actualizar', [SprintController::class, 'actualizarNotaComentario']);


// ============================      SESIONES DOCENTE     ======================================

Route::get('/session/active/docente', [AuthController::class, 'isSessionActiveDocente']);
Route::get('/docente/getGrupo/{idGrupo}', [SesionDocenteController::class, 'getGrupoSesion']);

// ============================      SESIONES ESTUDIANTE  ====================================

Route::get('/session/active/estudiante', [AuthController::class, 'isSessionActiveEstudiante']);
Route::get('/estudiante/getEmpresa', [SesionEstudianteController::class, 'getEmpresaSesion']);
Route::get('/estudiante/getDataEstudiante/{idGrupo}', [SesionEstudianteController::class, 'getDataEstudiante']);
Route::get('/estudiante/getGrupo', [SesionEstudianteController::class, 'getGrupoSesion']);

// ============================         SESIONES COMPARTIDAS    ==================================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginAdmin', [AuthController::class, 'loginAdmin']);

Route::get('/logout', [AuthController::class, 'logout']);

Route::get('/session/active/admin', [AuthController::class, 'isSessionActiveAdmin']);
Route::post('/crearCuentaEstudiante', [AdministradorController::class, 'crearEstudiante']);
Route::post('/crearCuentaDocente', [AdministradorController::class, 'crearDocente']);


Route::get('/obtenerDatosDocente', [AdministradorController::class, 'obtenerDatosDocente']);
Route::get('/obtenerDatosEstudiante', [AdministradorController::class, 'obtenerDatosEstudiante']);
Route::put('/modificarDatosEstudiante', [AdministradorController::class, 'actualizarEstudiante']);
Route::post('/modificarDatosDocente', [AdministradorController::class, 'actualizarDocente']);



// ============================  Funciones Joaquin  ====================================

Route::get('/estudiante/getDatosEst/{id}', [joaquinController::class, 'obtenerDatoEst']);
Route::get('/estudiante/getDatosEstEmpresa/{idEstudiante}', [joaquinController::class, 'obtenerIntegrantesPorEstudiante']);
Route::get('/estudiante/getDisponibles/{idEstudiante}',[joaquinController::class, 'obtenerEstudiantesSinEmpresa']);
Route::post('/crearGrupoEmpresa/paso1',[joaquinController::class, 'crearEmpresa']);
Route::put('/crearGrupoEmpresa/paso2/{idEmpresa}',[joaquinController::class, 'actualizarIntegrantes']);
Route::post('/crearGrupoEmpresa/paso3/{idEstudiante}',[joaquinController::class, 'publicarEmpresaPorEstudiante']);

Route::get('/estaMatriculado/{idEstudiante}',[joaquinController::class, 'estaMatriculado']);

Route::get('prueba/notaSprintV2/{idEmpresa}/{semana}', [joaquinController::class, 'notaSprintV2']);
Route::get('/estaMatriculado',[joaquinController::class, 'estaMatriculado']);

Route::get('/prueba/notaSprintV2/{idEmpresa}/{semana}', [joaquinController::class, 'notaSprintV2']);

Route::post('/estudiante/crearListaTareas',[TareaController::class, 'createOrUpdateTareas']);

Route::post('/estudiante/eliminarTareas',[TareaController::class, 'deleteTareas']);





// ============================  Funciones ComentarioTareaController  ====================================
Route::get('/seguimientoSemanal/{idPlanificacion}/SprintHastaSemanalActual', [ComentarioTareaController::class, 'seguimientoSemanalEmpresaHastaSemanaActual']);//utilizado
Route::get('/empresa/{idEmpresa}/seguimientoSemanal/semana/{idSemana}', [ComentarioTareaController::class, 'getSemanaSeguimiento']);//utilizado

Route::get('/seguimientoSemanalComentarios/semanaElegida/{idSemana}', [ComentarioTareaController::class, 'seguimientoSemanaElegidaComentarios']);
Route::post('/seguimientoSemanal/actualizarComentarios',[ComentarioTareaController::class, 'agregarComentarios']);
Route::get('/seguimientoSemanal/{idEmpresa}/SprintHastaSemanalActualComentarios',[ComentarioTareaController::class, 'seguimientoSemanalHastaSemanaActualcomentarios']);
Route::get('/modificarTarea/{idEmpresa}/semanaActualTareas', [ComentarioTareaController::class, 'getSemanaActualTareas']);

Route::get('/empresasSinSprintCalificado', [SprintController::class, 'empresasSinSprintCalificado']);//utilizado
Route::get('/empresasSinSemanaCalificada', [SprintController::class, 'empresasSinSemanaCalificada']);//utilizado
Route::get('/empresa/sprintConEntregables/{idSprint}', [SprintController::class, 'sprintConEntregables']);//utilizado

Route::post('/grupo/actualizar', [GrupoController::class, 'actualizarGrupo']);//utilizado
Route::post('/empresa/sprintConEntregables/sprint/actualizar', [SprintController::class, 'actualizarEntregable']);//utilizado



//========================================== Cuentas  =======================================


Route::post('/recuperarContrasena', [RecuperarController::class, 'recuperarContrasena']);

Route::post('/cambiarContrasena', [RecuperarController::class, 'cambiarContrasena']);

// ================================= HU listaGruposDeDocente ========================
Route::get('/docente/visualizarSemestres', [GestionController::class, 'visualizarSemestresDocente']);//utilizado

Route::get('/estudiante/visualizarSemestres', [GestionController::class, 'visualizarSemestresEstudiante']);//utilizado


Route::post('/docente/guardarGestionSeleccionada', [GestionController::class, 'guardarGestionSeleccionadaDocente']);

Route::post('/docente/crearGrupo', [GrupoController::class, 'crearGrupoDocente']);
Route::post('/crearGrupo', [GestionController::class, 'crearGrupoDocenteGestion']);



