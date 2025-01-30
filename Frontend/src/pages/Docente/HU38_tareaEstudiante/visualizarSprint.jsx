import { useState, useEffect } from 'react';
import BaseUI from '../../../components/baseUI/baseUI.jsx';
import SprintSemanas from "../../../components/SprintTareas/sprintSemanas";
import { getSemanasTareas } from "../../../api/getEmpresa";
const VisualizarSprintEst = () => {
    const idEmpresa = localStorage.getItem("idEmpresa")
    const idEstudiante = localStorage.getItem("idEstudiante")
    const [error, setError] = useState({error:false});
    const [loading, setLoading] = useState(true); 
    const [semana, setSemana] = useState([]);
    useEffect(() => {
      const fetchSprints = async () => {
        try {
          const data = await getSemanasTareas(idEmpresa);
          const dateNow = new Date()
          const newData = data[0]
          console.log(newData)
          const semanaActual = newData?.semanas.filter((semana) => {
            console.log()
            const a = semana.fechaIni <= normalizeDate(dateNow) && 
                      normalizeDate(dateNow) <= semana.fechaFin;
            return a}
          ) || [];
          console.log(semanaActual);
          const semanaActualV = semanaActual[0]
          setSemana(semanaActualV)
        } catch (error) {
          setError({error:true})
          console.error("Error al obtener los datos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSprints();
    }, []); 
    function normalizeDate(date) {
      const array = (date.toISOString()).split('T')
      const formatoDate =  array[0]
      return formatoDate;
    }
    return (
        <BaseUI
            titulo={'SELECCIONE UNA TAREA PARA VISUALIZAR'}
            ocultarAtras={false}
            confirmarAtras={false}
            dirBack={idEstudiante===null?`/homeDocente/listaEmpresasVerTareas`:'/homeEstu'}
            loading={loading}
            error={error}
        >
             <SprintSemanas 
                key={1} 
                title={`Semana ${semana?.numeroSemana}`} 
                semana={semana} 
                idSprint={1} 
                navigateLink={idEstudiante===null?`/homeDocente/listaEmpresasVerTareas/sprints/tarea`:'/homeEstu/listaSprintsSemanasTareas/verTarea'}
                semanaTexto = {true}
                isOpenSprint = {false}
            >
            </SprintSemanas>
        </BaseUI>
    );
}

export default VisualizarSprintEst;
