import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
} from "@mui/material";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import TablaPlanificacion from "../../../components/tablaPlanificacionDeDesarollo/tablaPlanificacion.jsx";
import { getEmpresaData } from "../../../api/getEmpresa.jsx";
import { getPlanificacion } from "../../../api/getPlanificacion.jsx";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo.jsx";
import { publicarPlanificacion } from "../../../api/publicarPlanificacion/publicarPlanificacion.jsx";

function PublicarPlanificacion() {
  const [openPublicarDialog, setOpenPublicarDialog] = useState(false);
  const navigate = useNavigate();

  let { idEmpresa } = useParams();
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [planificacionData, setPlanificacionData] = useState({
    aceptada: false,
  });
  

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresa, planificacion] = await Promise.all([
          getEmpresaData(idEmpresa),
          getPlanificacion(idEmpresa),
        ]);
        setEmpresaData(empresa);
        setPlanificacionData(planificacion);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idEmpresa]);

  const handlePublicar = () => {
    setOpenPublicarDialog(true);
  };

  const confirmPublicar = async () => {
    setOpenPublicarDialog(false);
    console.log(idEmpresa);
    const publicacionResult = await publicarPlanificacion(
      idEmpresa,
    );
    if (publicacionResult.error == null) {
      setSnackbar({
        open: true,
        message: publicacionResult.message,
        severity: "success",
      });
      setTimeout(() => {
        setPlanificacionData((prevState) => ({
          ...prevState,
          publicada: true,
        }));
      }, 3000);
    } else {
      setSnackbar({
        open: true,
        message: validarResult.error,
        severity: "error",
      });
    }
  };

  return (
    <Fragment>
      <BaseUI
        titulo={"PUBLICAR PLANIFICACION"}
        ocultarAtras={false}
        confirmarAtras={true}
        dirBack={"/homeEstu"}
        loading={loading}
        error={error}
      >
          <>
            <NombreEmpresa
              nombreLargo={empresaData?.nombreLargo}
              nombreCorto={empresaData?.nombreEmpresa}
            />
            {planificacionData?.publicada || planificacionData?.aceptada ? (
              <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",}}>
              <Typography variant="h4">
                <b>PLANIFICACIÓN PUBLICADA</b>
              </Typography>
              </Box>
            ) : planificacionData?.message !== null &&
              planificacionData?.message !== undefined ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {planificacionData?.message}
                </Typography>
              </Box>
            ) : (
              <>
                <TablaPlanificacion sprints={planificacionData?.sprints} />
                <Box sx={{ m: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePublicar}
                  >
                    Publicar Planificación
                  </Button>
                </Box>
                <CuadroDialogo
                  open={openPublicarDialog}
                  onClose={() => setOpenPublicarDialog(false)}
                  title="Confirmar Publicar planificación"
                  description="¿Está seguro de que desea publicar esta planificación?"
                  onConfirm={confirmPublicar}
                />

                <InfoSnackbar
                  openSnackbar={snackbar.open}
                  setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                  message={snackbar.message}
                  severity={snackbar.severity}
                />
              </>
            )}
          </>
        
      </BaseUI>
    </Fragment>
  );
}

export default PublicarPlanificacion;
