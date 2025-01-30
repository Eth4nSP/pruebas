const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useState, useEffect } from "react";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import TablaEvaluacionSemanal from "../../../components/tablaEvaluacionSemanal/tablaEvaluacionSemanal.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import { getSeguimiento } from "../../../api/seguimientoSemanal.jsx";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar.jsx";

const EvaluarHito = () => {
  const idEmpresa = 1;
  const idSprint = 1;
  const idSemana =2; 
  const [data2, setData] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [empresa, setNombreEmpresa] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSeguimiento(idEmpresa);
        const sprintElegido = (data.filter((sprint)=> sprint.idSprint===idSprint))[0]
        const semanaElegida = (sprintElegido.semanas.filter((semana)=>semana.idSemana === idSemana))[0]
        const newData = {
          idSprint:sprintElegido.idSprint,
          numSprint:sprintElegido.numSprint,
          semana: semanaElegida
        }
        setData(newData);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setError(true);
        setSnackbar({
          open: true,
          message: "Error al obtener los datos del sprint",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    const getNombreEmpresa = async () => {
      try {
          const response = await fetch(`${apiHost}/nombreEmpresa/${idEmpresa}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include'
          });

          if (!response.ok) throw new Error('Error al obtener los datos de la empresa');

          const data = await response.json();
          
          setNombreEmpresa({ nombreCorto: data.nombreEmpresa, nombreLargo: data.nombreLargo });
      } catch (error) {
          console.error('Error en la solicitud:', error);
          setError(true);
      }finally{
        setLoading(false)
      }
    };
    const getComentarios = async () => {
      try {
          const response = await fetch(`${apiHost}/seguimientoSemanalComentarios/semanaElegida/${idSemana}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include'
          });
          const responseData = await response.json();
          setComentarios(responseData)
          if (!response.ok) throw new Error('Error al obtener los datos de los comentarios');
      } catch (error) {
          console.error('Error en la solicitud:', error);
          setError(true);
      }finally{
        setLoading(false)
      }
    };
    getComentarios();
    getNombreEmpresa();
    fetchData();
  }, [idEmpresa]);

  return (
    <Fragment>
      <BaseUI
        titulo="EVALUACION SEMANAL"
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack="/"
        loading={loading}
        error={{error:error}}
      >
            <NombreEmpresa
              nombreCorto={empresa.nombreCorto}
              nombreLargo={empresa.nombreLargo}
            />
            {data2 !== undefined && comentarios !== undefined && <TablaEvaluacionSemanal sprint={data2} comenta={comentarios} showButtons={false}/>} 
      </BaseUI>
      <InfoSnackbar
        openSnackbar={snackbar.open}
        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Fragment>
  );
};

export default EvaluarHito;