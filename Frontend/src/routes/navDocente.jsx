import { Routes, Route, Navigate } from 'react-router-dom';
import HomeGrupoDocente from "../pages/Docente/homeGrupoDocente/homeGrupoDocente.jsx";
import EvaluacionSemanal from "../pages/Docente/HU7_evaluacionSemanal/evaluacionSemanal.jsx";
import VerEvaluacionSemanal from "../pages/Docente/HU77_calificarEstudiante/calificarEstSemana.jsx";
import CalificarSprint from "../pages/Docente/HU34_calificarSprint/calificarSprintU.jsx";
import ListaSprints from "../pages/Docente/HU34_calificarSprint/listaSprints.jsx";
import ObtenerEstudiantesPorGrupo from "../pages/Docente/HU32_listaEstudiantes/listaEstudiantes.jsx";
import EmpresasPorDocente from "../pages/Docente/HU31_listaEmpresas/listaEmpresaPorDocente.jsx";
import SeleccionarEmpresaVisualizar from "../pages/VisualizacionCompartida/HU36_verPlanificacionDeDesarollo/seleccionarEmpresaVisualizar/seleccionarEmpresaVisualizar.jsx";
import SeleccionarEmpresaModificar from "../pages/Docente/AHUCompartidasDelEstudiante/seleccionarEmpresaModificar/seleccionarEmpresaModificar.jsx";
import SeleccionarEmpresaPublicar from "../pages/Docente/AHUCompartidasDelEstudiante/seleccionarEmpresaPublicar/seleccionarEmpresaPublicar.jsx";
import SeleccionarEmpresaVerSprints from "../pages/Docente/listas/seleccionarEmpresaVerSprints/seleccionarEmpresaVerSprints.jsx";
import SeleccionarEmpresaSinValidar from "../pages/Docente/HU33_validarPlanificacion/seleccionarEmpresaSinValidar/seleccionarEmpresaSinValidar.jsx";
import ValidarPlanificacion from "../pages/Docente/HU33_validarPlanificacion/validarPlanificacion.jsx";
import ConfigurarEvaluacion from '../pages/Docente/configurarEvaluacion/configurarEvaluacion.jsx';
//import ListaVerPlanificacion from "../pages/Docente/listas/seleccionarEmpresaVisualizar/seleccionarEmpresaVisualizar.jsx";
import ListaEmpresaSprints from "../pages/Docente/HU34_calificarSprint/listaEmpresaSprints.jsx";
import EvaluacionSemanalListaEmpresas from "../pages/Docente/HU7_evaluacionSemanal/EvaluacionSemanalListaEmpresas.jsx";
import EvaluacionSemanalSprints from "../pages/Docente/HU7_evaluacionSemanal/EvaluacionSemanalSprints.jsx";
//ACCIONES COMPARTIDAS
import VerPlanificacionDeDesarollo from "../pages/VisualizacionCompartida/HU36_verPlanificacionDeDesarollo/VerPlanifacionDeDesarollo.jsx";
import SeleccionarSprintVisualizar from '../pages/VisualizacionCompartida/HU37_visualizarSprint/seleccionarSprintVisualizar/seleccionarSprintVisualizar.jsx';
import VisualizarSprint from '../pages/VisualizacionCompartida/HU37_visualizarSprint/visualizarSprint.jsx';
import ListaCali from "../pages/Docente/AHUCompartidasDelEstudiante/HU18_listaVerCalificaciones/listaCalificaciones.jsx";
import CalificacionesHitoEmpresa from "../pages/Estudiante/HU18_verCalificaciones/calificacionesHitoEmpresa.jsx";
import EmpresasParaTareas from "../pages/Docente/HU38_tareaEstudiante/seleccionarEmpresaParaVisualizar.jsx";
import VisualizarTarea from "../pages/Docente/HU38_tareaEstudiante/viualizarTarea.jsx";
import VisualizarSprintEst from "../pages/Docente/HU38_tareaEstudiante/visualizarSprint.jsx";
import VerEvaluacionSemanalSprints from '../pages/Docente/HU77_calificarEstudiante/listaSprintsVerCalificacionesSemanales.jsx'
import VerEvaluacionSemanalListaEmpresas from '../pages/Docente/HU77_calificarEstudiante/listaEmpresasVerCalificaciones.jsx'
import ModificarFechasLimiteGrupo from '../pages/Docente/80_modificarFechasLimites/modificarFechasLimitesGrupo.jsx'
import ListaGruposDocente from '../pages/Docente/homeGrupoDocente/listaGruposDocente.jsx'
import CrearFechasGestion from '../pages/Docente/crear_fechas_semestre/crearFechasLimitesGrupo.jsx';
function NavDocente() {
  return (
    <Routes>
      <Route
        path="/"
        element={<ListaGruposDocente/>}
      />
      <Route
        path="/homeDocente"
        element={<HomeGrupoDocente />}
      />
      <Route
        path="/modificarFechasLimitesGrupo"
        element={<ModificarFechasLimiteGrupo />}
      />
      <Route
        path="/crearFechasLimitesGrupo"
        element={<CrearFechasGestion />}
      />
      {/** ROUTES JHON NUEVOFORMATO*/}
      <Route
        path="/homeDocente/listaEstudiantes"
        element={<ObtenerEstudiantesPorGrupo />}
      />
      <Route
        path="/homeDocente/listaEmpresas"
        element={<EmpresasPorDocente />}
      />
      <Route
        path="/homeDocente/listaEmpresasEvaluacionSemanal"
        element={<EvaluacionSemanalListaEmpresas />}
      />
      <Route
        path="/homeDocente/listaEmpresasEvaluacionSemanal/empresaSprints"
        element={<EvaluacionSemanalSprints />}
      />
      <Route
        path="/homeDocente/listaEmpresasEvaluacionSemanal/empresaSprints/semana"
        element={<EvaluacionSemanal />}
      />

      <Route
        path="/homeDocente/listaEmpresaCalificarSprints"
        element={<ListaEmpresaSprints />}
      />
      <Route
        path="/homeDocente/listaEmpresaCalificarSprints/empresa"
        element={<ListaSprints />}
      />
      <Route
        path="/homeDocente/listaEmpresaCalificarSprints/empresa/sprint"
        element={<CalificarSprint />}
      />
          {/** ROUTES COMPARTIDAS JHON NUEVO FORMATO*/} 
          <Route
            path="/homeDocente/listaEmpresaCalificaciones"
            element={<ListaCali/>}
          />
          <Route
            path="/homeDocente/listaEmpresaCalificaciones/empresa"
            element={<CalificacionesHitoEmpresa/>}
          />
      {/** ROUTES JOAQUIN NUEVO FORMATO*/}
      <Route
        path="/homeDocente/listaEmpresaVerCalificacionesSemanal"
        element={<VerEvaluacionSemanalListaEmpresas />}
      />
      <Route
        path="/homeDocente/listaEmpresaVerCalificacionesSemanal/empresaSprints"
        element={<VerEvaluacionSemanalSprints />}
      />
      <Route
        path="/homeDocente/listaEmpresaVerCalificacionesSemanal/empresaSprints/semana"
        element={<VerEvaluacionSemanal />}
      />
      {/** ROUTES JOAQUIN*/}
      <Route
          path="/homeDocente/listaEmpresasVerTareas"
          element={<EmpresasParaTareas />}
      />
      <Route
          path="/homeDocente/listaEmpresasVerTareas/sprints"
          element={<VisualizarSprintEst />}
      />
      <Route
          path="/homeDocente/listaEmpresasVerTareas/sprints/tarea"
          element={<VisualizarTarea />}
      />

      {/** ROUTES JHAIR*/}

      {/** Seleccionar una planificacion para visualizar*/}
      <Route
        path="/visualizarPlanificacion"
        element={<SeleccionarEmpresaVisualizar />}
      />

      {/** Visualizar Planificacion*/}
      <Route
        path="/visualizarPlanificacion/Empresa/:idEmpresa"
        element={<VerPlanificacionDeDesarollo />}
      />
      {/** Seleccione una empresa para ver sus sprints*/}
      <Route
        path="/visualizarSprint/"
        element={<SeleccionarEmpresaVerSprints />}
      />
      {/** Seleccione un Sprint para  visualizar*/}
      <Route
        path="/visualizarSprint/Empresa/:idEmpresa"
        element={<SeleccionarSprintVisualizar />}
      />
      {/** Visualizar Sprint*/}
      <Route
        path="/visualizarSprint/Empresa/:idEmpresa/Sprint/:idSprint"
        element={<VisualizarSprint />}
      />
      {/** Seleccionar una planificacion para validar*/}
      <Route
        path="/validarPlanificacion/"
        element={<SeleccionarEmpresaSinValidar />}
      />
      {/** Validar Planificacion */}
      <Route
        path="/validarPlanificacion/empresa/:idEmpresa"
        element={<ValidarPlanificacion />}
      />

      {/** Configurar planilla de evaluacion*/}
      <Route
        path="/configurarEvaluacion"
        element={<ConfigurarEvaluacion />}
      />



      {/** Seleccione una Planificacion para Modificar */}
      <Route
        path="/modificarPlanificacion/"
        element={<SeleccionarEmpresaModificar />}
      />
      {/** Seleccione una Planificacion para Publicar */}
      <Route
        path="/publicarPlanificacion/"
        element={<SeleccionarEmpresaPublicar />}
      />




      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default NavDocente;
