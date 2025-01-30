import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Comentario from "../../../components/comentario/comentario.jsx";
import EditarPlanificacion from "../../../components/editarTablaPlanificacion/editarTablaPlanificacion.jsx";
import { getPlanificacion } from "../../../api/getPlanificacion.jsx";
import { getNombreEmpresa } from "../../../api/getNombreEmpresa.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import EstadoPlanificacion from "../../../components/estadoPlanificacion/estadoPlanificacion.jsx";
import Redirecting from "../../../components/redirecting/redirecting.jsx";
import { Box, Typography } from "@mui/material";

function ModificarPlanificacion() {
  let { idEmpresa } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error:false,
    errorMessage: "",
    errorDetails: "",
  });
  const [planificacionData, setPlanificacionData] = useState();
  const [datosEmpresa, setDatosEmpresa] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planificacion, nombreEmpresa] = await Promise.all([
          getPlanificacion(idEmpresa),
          getNombreEmpresa(idEmpresa),
        ]);
        setPlanificacionData(planificacion);
        console.log(planificacion);
        setDatosEmpresa(nombreEmpresa);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
        setError({
          error:true,
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
      } finally {
        console.log(planificacionData)
        setLoading(false);
      }
    };
    fetchData();
  }, [idEmpresa]);

  useEffect(() => {
    if (planificacionData && planificacionData.aceptada) {
      const timer = setTimeout(() => {
        navigate(`/visualizarPlanificacion/empresa/${idEmpresa}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [planificacionData, idEmpresa, navigate]);

  return (
    <Fragment>
      <BaseUI
        titulo={"MODIFICAR PLANIFICACION"}
        ocultarAtras={false}
        confirmarAtras={true}
        dirBack={"/homeEstu"}
        loading={loading}
        error={error}
      >
          <>
            <NombreEmpresa
              nombreLargo={datosEmpresa?.nombreLargo}
              nombreCorto={datosEmpresa?.nombreEmpresa}
            />
            <EstadoPlanificacion
              estado={planificacionData?.aceptada}
              comentariopublico={planificacionData?.comentariopublico}
              publicada={planificacionData?.publicada}
            />
            {planificacionData?.aceptada ? (
              <Redirecting />
            ) : (planificacionData?.publicada==0 || planificacionData?.publicada==null) ? (
              <>
                <EditarPlanificacion
                  planificacionData={planificacionData}
                  idEmpresa={planificacionData?.idEmpresa}
                />
                {planificacionData?.comentariopublico !== null &&
                  planificacionData?.comentariopublico !== "" && (
                    <>
                      <Comentario
                        titulo="MOTIVOS DE RECHAZO:"
                        comentario={planificacionData?.comentariopublico}
                      />
                    </>
                  )}
              </>
            ) :(

              <Box >
                <Typography  variant="h2" gutterBottom>

                  <strong>Planificación publicada</strong>
                </Typography>
              </Box>
            )}
          </>
      </BaseUI>
    </Fragment>
  );
}

export default ModificarPlanificacion;
