import { Routes, Route, Navigate } from 'react-router-dom';
import HomeGrupoEstudiante from "../pages/Estudiante/homeGrupoEstudiante/homeGrupoEstudiante.jsx";
import ModificarListaTareas from "../pages/Estudiante/HU40_modificarListaTareas/modificarListaTareas.jsx";
import ModificarGrupoEmpresa from "../pages/Estudiante/HU3_HU71_HU69_grupoEmpresa/modificarGrupoEmpresa.jsx";
import GruposDisponibles from "../pages/Estudiante/HU16_gruposDisponibles/gruposDisponibles.jsx"; // Import the new page
import InscribirGrupo from "../pages/Estudiante/HU16_gruposDisponibles/inscribirGrupo.jsx";
import ModificarTarea from "../pages/Estudiante/HU8_modificarTarea/modificarTarea.jsx";
import ListaTareas from "../pages/Estudiante/HU8_modificarTarea/listaTareas.jsx";
import CalificacionesHitoEmpresa from "../pages/Estudiante/HU18_verCalificaciones/calificacionesHitoEmpresa.jsx";
import CrearGrupoEmpresa from "../pages/Estudiante/HU3_HU71_HU69_grupoEmpresa/crearGrupoEmpresa.jsx";
import PublicarGrupoEmpresa from "../pages/Estudiante/HU3_HU71_HU69_grupoEmpresa/publicarGrupoEmpresa.jsx";
import RedirigirHome from '../pages/Estudiante/homeGrupoEstudiante/redirigirHomeEstu.jsx';
import VisualizarSprint from '../pages/VisualizacionCompartida/HU37_visualizarSprint/visualizarSprint.jsx';
import SeleccionarSprintVisualizar from '../pages/VisualizacionCompartida/HU37_visualizarSprint/seleccionarSprintVisualizar/seleccionarSprintVisualizar.jsx';
//traido desde docnete
import ModificarPlanificacion from '../pages/Estudiante/HU4_editarPlanificacion/editarPlanificacion.jsx';
import PublicarPlanificacion from '../pages/Estudiante/publicarPlanificacion/publicarPlanificacion.jsx';
import VerPlanificacionDeDesarollo from "../pages/VisualizacionCompartida/HU36_verPlanificacionDeDesarollo/VerPlanifacionDeDesarollo.jsx";
import ListaSprintsVerTareas from '../pages/Docente/HU38_tareaEstudiante/visualizarSprint.jsx'
import VerTarea from '../pages/Docente/HU38_tareaEstudiante/viualizarTarea.jsx'
import ListaEstudiantes from '../pages/Docente/HU32_listaEstudiantes/listaEstudiantes.jsx'
import ListaEmpresas from '../pages/Docente/HU31_listaEmpresas/listaEmpresaPorDocente.jsx'
import ListaSprintsVerSeguimiento from '../pages/Docente/HU77_calificarEstudiante/listaSprintsVerCalificacionesSemanales.jsx'
import VerSeguimientoSemanal from '../pages/Docente/HU77_calificarEstudiante/calificarEstSemana.jsx'
import RealizarEvaluacion from '../pages/Estudiante/realizarEvaluacion/realizarEvaluacion.jsx';

import ListaGruposEstudiante from '../pages/Estudiante/homeGrupoEstudiante/listaDeGruposEstudiante.jsx';
import ModificarArchivosEntregables from "../pages/Estudiante/HU81_modificarArchivosEntregables/modificarArchivosEntregables.jsx";
function NavEstudiante() {
    return (
      <Routes>
        <Route
          path="/"
          element={<ListaGruposEstudiante/>}
        />
        <Route path="/homeEstu" element={<HomeGrupoEstudiante />} />
        {/** ROUTES JHON NUEVO FORMATO*/}
        <Route
          path="/homeEstu/modificarListaTareas"
          element={<ModificarListaTareas />}
        />
        <Route path="/homeEstu/modificarArchivosEntregables" element={<ModificarArchivosEntregables />} />
        <Route
          path="/homeEstu/listaTareas"
          element={<ListaTareas />}
        />
        <Route  
          path="/homeEstu/listaTareas/modificarTarea"
          element={<ModificarTarea />}
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
        <Route
          path="/homeEstu/VerCalificacionesSprints"
          element={<CalificacionesHitoEmpresa />}
        />
        <Route
          path="/homeEstu/listaEmpresasGrupo"
          element={<ListaEmpresas/>}
        />
        <Route
          path="/homeEstu/listaEstudiantesGrupo"
          element={<ListaEstudiantes />}
        />
        {/** ROUTES JHON*/}
        
        {/** ROUTES JOAQUIN*/}
        <Route
          path="/homeEstu/listaSprintsSemanasTareas"
          element={<ListaSprintsVerTareas />}
        />
        <Route
          path="/homeEstu/listaSprintsSemanasTareas/verTarea"
          element={<VerTarea />}
        />
        <Route
          path="/homeEstu/listaSprintsVerSeguimiento"
          element={<ListaSprintsVerSeguimiento />}
        />
        <Route
          path="/homeEstu/listaSprintsVerSeguimiento/verSeguimientoSemanal"
          element={<VerSeguimientoSemanal />}
        />
        {/** ROUTES JHAIR */}
        
        {/** Visualizar Planificacion*/}
        <Route
          path="/visualizarPlanificacion/Empresa/:idEmpresa"
          element={<VerPlanificacionDeDesarollo />}
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
        {/** Modificar Planificacion */}
        <Route
          path="/modificarPlanificacion/Empresa/:idEmpresa"
          element={<ModificarPlanificacion />}
        />
        {/** Publicar Planificacion */}
        <Route
          path="/publicarPlanificacion/Empresa/:idEmpresa"
          element={<PublicarPlanificacion />}
        />
        {/** Realizar Evaluacion */}
        <Route
          path="/realizarEvaluacion"
          element={<RealizarEvaluacion />}
        />


        <Route
          path="/homeEstu/CrearGrupoEmpresa"
          element={<CrearGrupoEmpresa />}
        />
        <Route
          path="/homeEstu/ModificarGrupoEmpresa"
          element={<ModificarGrupoEmpresa />}
        />

        <Route
          path="/homeEstu/PublicarGrupoEmpresa"
          element={<PublicarGrupoEmpresa />}
        />
        <Route
          path="/GruposDocente"
          element={<GruposDisponibles />}
        />
        <Route
          path="/GruposDocente/incribirse"
          element={<InscribirGrupo />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  
  export default NavEstudiante;