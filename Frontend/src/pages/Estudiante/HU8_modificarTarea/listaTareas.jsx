import { getSemanasTareas } from "../../../api/getEmpresa";
import BaseUI from '../../../components/baseUI/baseUI';
import { useState, useEffect } from 'react';
import SprintSemanas from "../../../components/SprintTareas/sprintSemanas";
function ListaTareas() {
    const idEmpresa = localStorage.getItem("idEmpresa")
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
        titulo={'SELECCIONE UNA TAREA PARA MODIFICAR'}
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack={'/homeEstu'}
        loading={loading}
        error={error}
    >
      <SprintSemanas 
          key={1} 
          title={`Semana ${semana?.numeroSemana}`} 
          semana={semana} 
          idSprint={1} 
          navigateLink={`/homeEstu/listaTareas/modificarTarea`}
          semanaTexto = {true}
          isOpenSprint = {false}
      >
      </SprintSemanas>
    </BaseUI>
  );
}

export default ListaTareas;