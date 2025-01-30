import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import BaseUI from "../../../components/baseUI/baseUI.jsx";
import TablaPlanificacion from "../../../components/tablaPlanificacionDeDesarollo/tablaPlanificacion.jsx";
import { getEmpresaData } from "../../../api/getEmpresa.jsx";
import { getPlanificacion } from "../../../api/getPlanificacion.jsx";
import { validar } from "../../../api/validarPlanificacion/validar.jsx";
import { rechazar } from "../../../api/validarPlanificacion/rechazar.jsx";
import { addRevision } from "../../../api/validarPlanificacion/addRevision.jsx";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar.jsx";
import CuadroComentario from "../../../components/cuadroComentario/cuadroComentario.jsx";
import NombreEmpresa from "../../../components/infoEmpresa/nombreEmpresa.jsx";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo.jsx";
import DecisionButtons from "../../../components/Buttons/decisionButtons.jsx";
import Redirecting from "../../../components/redirecting/redirecting.jsx";
import EstadoPlanificacion from "../../../components/estadoPlanificacion/estadoPlanificacion.jsx";
import Comentario from "../../../components/comentario/comentario.jsx";
function ValidarPlanificacion() {
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [groupComment, setGroupComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  const [nota, setNota] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });

  let { idEmpresa } = useParams();
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planificacionData, setPlanificacionData] = useState({
    aceptada: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const errorTranslations = {
    "The comentario field must be a string.":
      "El comentario para el grupo no debe estar vacio.",
    "The nota field must be at least 0.": "La nota debe ser al menos 0.",
    "The nota field must not be greater than 100.":
      "La nota no debe ser mayor que 100.",
    "The nota field must be a number.": "El campo nota está vacío.",
    "The group comment field is required.":
      "El campo de comentario para el grupo es obligatorio.",
    // aca se añaden los demas errores de ser necesario
  };

  const translateError = (error) => {
    return errorTranslations[error] || `Error: ${error}`;
  };

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
        setError({
          error: true,
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
      } finally {
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

  const handleValidate = () => {
    setOpenValidateDialog(true);
  };

  const handleReject = () => {
    setOpenRejectDialog(true);
  };

  const confirmValidate = async () => {
    setOpenValidateDialog(false);

    const validarResult = await validar(idEmpresa);
    if (validarResult.error == null) {
      setSnackbar({
        open: true,
        message: validarResult.message,
        severity: "success",
      });
      setTimeout(() => {
        setPlanificacionData((prevState) => ({
          ...prevState,
          aceptada: true,
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

  const confirmReject = async () => {
    setOpenRejectDialog(false);
    console.log(idEmpresa);
    console.log(groupComment);
    const revisionResult = await addRevision(idEmpresa, groupComment);

    if (revisionResult.errors != null) {
      const errorMessages = Object.keys(revisionResult.errors)
        .map((key) => {
          const errors = revisionResult.errors[key];
          return errors
            .map((error) => `${key}: ${translateError(error)}`)
            .join("\n");
        })
        .join("\n");
      console.log(errorMessages);
      setSnackbar({
        open: true,
        message: errorMessages,
        severity: "error",
      });
    } else {
      const rechazarResult=await rechazar(idEmpresa);
      console.log(rechazarResult);
      if (rechazarResult.error == null) {
        setSnackbar({
          open: true,
          message: `${revisionResult.message} Redireccionando a la lista de empresas`,
          severity: "success",
        });
        setTimeout(() => {
          navigate(`/validarPlanificacion/`);
        }, 5000);
      }else{
        setSnackbar({
          open: true,
          message: rechazarResult.error,
          severity: "error",
        });
      }


    }
  };

  return (
    <Fragment>
      <BaseUI
        titulo={"VALIDAR PLANIFICACION"}
        ocultarAtras={false}
        confirmarAtras={true}
        dirBack={"/validarPlanificacion"}
        loading={loading}
        error={error}
      >
        <>
          <NombreEmpresa
            nombreLargo={empresaData?.nombreLargo}
            nombreCorto={empresaData?.nombreEmpresa}
          />
          <EstadoPlanificacion
            estado={planificacionData.aceptada}
            comentariopublico={planificacionData.comentariopublico}
            publicada={planificacionData.publicada}
          />
          {planificacionData.aceptada ? (
            <Redirecting />
          ) : planificacionData.message !== null &&
            planificacionData.message !== undefined ? (
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
                {planificacionData.message}
              </Typography>
            </Box>
          ) : planificacionData.publicada === 0 ? (
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
                La planificación no ha sido publicada
              </Typography>
            </Box>
          ) : (
            <>
              <TablaPlanificacion sprints={planificacionData.sprints} />
              {planificacionData.comentariopublico && (
                <Comentario
                  titulo="MOTIVOS DE RECHAZO PREVIOS:"
                  comentario={planificacionData.comentariopublico}
                />
              )}
              <CuadroComentario
                title="Motivos de rechazo"
                maxChars={200}
                onTextChange={(text) => setGroupComment(text)}
              />

              <DecisionButtons
                rejectButtonText="Rechazar Planificación"
                validateButtonText="Validar Planificación"
                onReject={handleReject}
                onValidate={handleValidate}
                disabledButton={0}
              />
              <CuadroDialogo
                open={openValidateDialog}
                onClose={() => setOpenValidateDialog(false)}
                title="Confirmar Validar planificación"
                description="¿Está seguro de que desea validar esta planificación?, si es la primera planificacion aceptada, se deshabilitarán todos los campos de edición de fechas."
                onConfirm={confirmValidate}
              />
              <CuadroDialogo
                open={openRejectDialog}
                onClose={() => setOpenRejectDialog(false)}
                title="Confirmar Rechazar Planificacion"
                description="¿Está seguro de que desea rechazar esta planificación?"
                onConfirm={confirmReject}
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

export default ValidarPlanificacion;
