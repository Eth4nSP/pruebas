const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useState, useEffect } from "react";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import TablaEvaluacionSemanal from "../../../components/tablaEvaluacionSemanal/tablaEvaluacionSemanal.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import { getSemanaSeguimiento } from "../../../api/seguimientoSemanal.jsx";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar.jsx";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Error from "../../../components/error/error.jsx";
const SeguimientoSemanal = () => {
  const idEmpresa = localStorage.getItem("idEmpresa")
  const idSemana = localStorage.getItem("idSemana")
  const idEstudiante = localStorage.getItem("idEstudiante")
  const [data2, setData] = useState([]);
  const [empresa, setNombreEmpresa] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seSubio, setSeSubio] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [comentarios, setComentarios] = useState([])
  useEffect(() => {
    setLoading(true)
    getNombreEmpresa();
    fetchData();
    setLoading(false)
  }, [seSubio]);
  
  
  const fetchData = async () => {
    try {
      const data = await getSemanaSeguimiento(idEmpresa, idSemana)
      setData(data);
      const newComentarios = data?.comentarios
      setComentarios(newComentarios)
      console.log(newComentarios)
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError(true);
      setSnackbar({
        open: true,
        message: error.message || "Error al obtener los datos del sprint",
        severity: "error",
      });
    }

  };

  const getNombreEmpresa = async () => {
    try {
        const response = await fetch(`${apiHost}/empresa/${idEmpresa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Error al obtener los datos de la empresa');

        const data = await response.json();
        setNombreEmpresa({ nombreCorto: data.nombreEmpresa, nombreLargo: data.nombreLargo, integrantes: data.integrantes });
        console.log(data)
    } catch (error) {
        console.error('Error en la solicitud:', error);
        setError(true);
    }
  };
  return (
    <Fragment>
      <BaseUI
        titulo="RECUPERAR RESULTADOS DE SEGUIMIENTO SEMANAL PREVIO"
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack={idEstudiante===null?`/homeDocente/listaEmpresaVerCalificacionesSemanal/empresaSprints`:`/homeEstu/listaSprintsVerSeguimiento`}
        loading={loading}
        error={{error:error}}
      >
            <NombreEmpresa
              nombreCorto={empresa.nombreCorto}
              nombreLargo={empresa.nombreLargo}
            />
            <Box>
              <div>
                <h2>SEMANA {data2.numSemana}</h2>
              </div>
              <Box display="flex">
                <Box display="flex" alignItems="center" m={2}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Inicio Semana:</strong>{" "}
                    {data2?.fechaIni} a las 00:00
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" m={2}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Fin Semana:</strong>{" "}
                    {data2?.fechaFin} a las 23:59
                  </Typography>
                </Box>
              </Box>
            </Box>
            {data2 !== undefined && 
              <TablaEvaluacionSemanal 
                semana={data2 !== null? data2:[]} 
                comentariosN={comentarios} 
                showButtons={false} 
                setSeSubio={(subio)=> setSeSubio(subio)}
              />
            } 
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

export default SeguimientoSemanal;