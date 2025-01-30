import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  TextField,
  Paper,
  Link,
  FormControl,
  Grid2,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BaseUI from "../../../components/baseUI/baseUI";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PhotoIcon from "@mui/icons-material/Photo";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DecisionButtons from "../../../components/Buttons/decisionButtons";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import { getSprintConEntregables } from "../../../api/getEmpresa";
import { actualizarSprint, aceptarEntregables } from "../../../api/sprintApi";

const FileItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const FileInfo = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

function CalificarSprintU() {
  const idSprint = localStorage.getItem("idSprint")
  const [tieneNota, setTieneNota] = useState(false);
  const [datosSprint, setDatosSprint] = useState({
    idSprint: "2",
    numeroSprint: 2,
    nota: 70,
    comentario: "LO HICIERON BASTANTE BIEN ESTE SPRINT",
    entregables: [
      {
        descripcionEntregable: "Manual técnico",
        archivoEntregable: "url/manual_tecnico.pdf",
      },
    ],
  });
  const [notaSprint, setNotaSprint] = useState("");
  const [comentario, setComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", 
    autoHide: 6000,
  });
  const [cuadroDialogo, setCuadroDialogo] = useState({
    open: false,
    onConfirm: () => {},
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });
  const [aceptados, setAceptados] = useState([]);
  const fetchSprints = async () => {
    try {
      const sprintData = await getSprintConEntregables(idSprint)
      const newSprint = sprintData.sprints
      setDatosSprint(newSprint);
      console.log(newSprint)
      const nota = newSprint.nota;
      const aceptadosResponse = newSprint.entregables.map((entregable)=> {
        const esAceptado = entregable.aceptado !== null? entregable.aceptado:false;
        return esAceptado
      })
      setAceptados(aceptadosResponse)
      setTieneNota(nota!==null);
      setNotaSprint(nota === null ? "" : nota);
      const comentarioNew = newSprint.comentario
        ? newSprint.comentario
        : "";
      setComentario(comentarioNew);
    } catch (error) {
      setError({
        error: true,
        errorMessage: "Ha ocurrido un error",
        errorDetails: error.message,
      });
      console.error("Error al cargar la tarea:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
    fetchSprints();
  }, []);
  const handleComentarioChange = (event) => {
    const value = event.target.value;
    setComentario(value);
    const error = value === "" && value.length < 20;
    setErrorComentario(error);
  };
  const handleNotaChange = (event) => {
    const value = event.target.value;
    setErrorNota(value === '')
    if (!isNaN(value) && Number(value) <= 100 && Number(value) >= 0) {
      setNotaSprint(value);
    }
  };
  const handleCancel = () => {
    setCuadroDialogo({
      open: true,
      title: "Descartar",
      description:
        "Esta acción no se puede deshacer. Todos los cambios realizados se perderán.  ¿Está seguro?",
      onConfirm: () => window.location.reload(),
    });
  };
  const handleSave = () => {
    setCuadroDialogo({
      open: true,
      title: "Guardar",
      description:
        "Esta acción guardará todos los cambios realizados en la tarea. ¿Está seguro?",
      onConfirm: handleSubmit,
    });
  };
  const [errorNota, setErrorNota] = useState(false);
  const handleSubmit = async () => {
    if (comentario === "" && comentario.length < 20) {
      setError(true);
      return;
    }
    if (notaSprint === '') {
      setErrorNota(true)
      return;
    }
    try {
      const response = await actualizarSprint(idSprint, comentario, notaSprint);
      console.log("subir nota y comentario"+response.ok)
    } catch (error) {
      console.error("Error al actualizar calificar sprint:", error);
      setSnackbar({
        open: true,
        message: `Hubo un error al momento de subir las calificaciones, error: ${error}`,
        severity: "error",
        autoHide: 60000,
      });
    }
    try {
      const aceptadosNew = aceptados
        .map((aceptado, index) => {
          if (aceptado && datosSprint?.entregables[index]?.idEntregables) {
            return { idEntregable: Number(datosSprint.entregables[index].idEntregables) };
          }
          return null;
        })
        .filter(item => item !== null);
      console.log(aceptadosNew)
      if(aceptadosNew.length > 0){
        
        const response = await aceptarEntregables(aceptadosNew);
        console.log("check aceptados"+response.ok)
      }
      setSnackbar({
        open: true,
        message: "Se subió correctamente todo",
        severity: "success",
        autoHide: 6000,
      });
      fetchSprints();   
      setCuadroDialogo({
        open: false,
        onConfirm: () => {},
        title: "",
        description: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Hubo un error al momento de subir chekeo entragables, error: ${error}`,
        severity: "error",
        autoHide: 60000,
      });
    }
  };
  const selectIcon = (nombreArchivo, link) => {
    if (nombreArchivo === null) {
      return <DescriptionIcon></DescriptionIcon>;
    }
    const tipo = nombreArchivo.split(".")[1];
    console.log(tipo);
    if (tipo === "pdf") {
      return (
        <Link href={link} target="_blank" className="archivoLink">
          <PictureAsPdfIcon></PictureAsPdfIcon>
        </Link>
      );
    }
    if (tipo === "docx") {
      return (
        <Link href={link} target="_blank" className="archivoLink">
          <DescriptionIcon></DescriptionIcon>
        </Link>
      );
    }
    if (tipo === "zip") {
      return (
        <Link href={link} target="_blank" className="archivoLink">
          <FolderZipIcon></FolderZipIcon>
        </Link>
      );
    }
    if (tipo === "png" || tipo === "jpg") {
      return (
        <Link href={link} target="_blank" className="archivoLink">
          <PhotoIcon></PhotoIcon>
        </Link>
      );
    }
  };
  const handleAceptado = (index)=>{
    const newAceptados = aceptados.map((aceptado, i)=>{
      if(index === i){
        return !aceptado
      }else{
        return aceptado
      }
    })
    setAceptados(newAceptados)
  }
  if (loading) return (
    <BaseUI
      titulo={"CALIFICAR SPRINT"}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={`/homeDocente/listaEmpresaCalificarSprints/empresa`}
      loading={loading}
      error={error}
    >
      <Loading></Loading>  
    </BaseUI>
  )
  if (error.error) return(
    <BaseUI
      titulo={"CALIFICAR SPRINT"}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={`/homeDocente/listaEmpresaCalificarSprints/empresa`}
      loading={loading}
      error={error}
    >
      <Error></Error>;
    </BaseUI>
  )

  const handleDownloadFile = async (file) => {
    const url = file
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'archivo';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  return (
    <BaseUI
      titulo={"CALIFICAR SPRINT"}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={`/homeDocente/listaEmpresaCalificarSprints/empresa`}
      loading={loading}
      error={error}
    >
      <Container>
        <Box >
          <div>
            <Typography variant="h4" className="titulo">
              SPRINT {datosSprint?.numeroSprint} 
            </Typography>
          </div>
          <Box display="flex" flexWrap={'wrap'}>
              <Box display="flex" alignItems="center" m={2}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Fecha de Inicio:</strong>{" "}
                  {datosSprint?.fechaIni} a las 00:00                  
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" m={2}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Fecha de Fin:</strong>{" "}
                  {datosSprint?.fechaFin} a las 23:59
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon sx={{ m: 2 }} />
                <Typography variant="body1">
                  <strong>Fecha de Entrega precencial:</strong>{" "}
                  {datosSprint?.fechaEntrega}
                </Typography>
            </Box>
          </Box>
        </Box>
        <Grid2 container className="datosSprint">
          <Paper className="entregables">
            <Typography variant="h6">Entregables</Typography>
            {datosSprint?.entregables?.map((entregable, index) => (
              <Box key={index} className="entregableItem">
                <Checkbox
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent", // Quita el fondo al hacer hover
                    },
                    transition: "none", // Desactiva la transición de animación
                    cursor: "default",
                  }}
                  checked={aceptados[index]}
                  onChange={()=>handleAceptado(index)}
                  disabled={tieneNota}
                />
                <Typography>{entregable.descripcionEntregable}</Typography>
              </Box>
            ))}
          </Paper>
          <Paper className="archivos">
            <Typography variant="h6" sx={{ mb: 2.3 }}>
              Archivos
            </Typography>
            {datosSprint?.entregables?.map((entregable, index) => (
              <FileItem key={index}>
                {selectIcon(entregable.nombreArchivo)}
                <FileInfo>
                  {entregable.archivoEntregable ? (
                    <Link
                      onClick={() => handleDownloadFile(entregable.archivoEntregable)}
                      target="_blank"
                      underline="hover"
                    >
                      {entregable.nombreArchivo}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {entregable.descripcionEntregable}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    color={
                      entregable.archivoEntregable
                        ? "success.main"
                        : "error.main"
                    }
                    sx={{ mx: 2 }}
                  >
                    {entregable.archivoEntregable ? "Entregado" : "No entregado"}
                  </Typography>
                </FileInfo>
              </FileItem>
            ))}
          </Paper>
        </Grid2>

        <Paper className="comentarioNota">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <Typography variant="subtitle1"></Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={comentario}
                onChange={handleComentarioChange}
                variant="outlined"
                placeholder="Comentario para el grupo (máximo 200 caracteres)"
                inputProps={{ maxLength: 200 }}
                className="inputComentario"
                error={errorComentario}
                disabled={tieneNota}
                helperText={
                  errorComentario && "Debe tener un minimo de 20 caracteres"
                }
              />
              <Box className="notaField">
                <Box display={'flex'}>
                  <Typography variant="h6" className="notaLabel">
                    NOTA:
                  </Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={notaSprint}
                    onChange={handleNotaChange}
                    inputProps={{
                      type: "number",
                    }}
                    className="notaInput"
                    disabled={tieneNota}
                    error={errorNota}
                  />
                </Box>
                <div>
                  <span style={{color:'red'}}>{ errorNota && "Es Obligatorio ingresar una nota"}</span>
                </div>
              </Box>
              {!tieneNota && <DecisionButtons
                rejectButtonText="Descartar"
                validateButtonText="Guardar"
                onReject={handleCancel}
                onValidate={handleSave}
                disabledButton={0}
              />}
            </FormControl>
          </form>
        </Paper>
        <CuadroDialogo
          open={cuadroDialogo.open}
          onClose={() => setCuadroDialogo({ ...cuadroDialogo, open: false })}
          title={cuadroDialogo.title}
          description={cuadroDialogo.description}
          onConfirm={cuadroDialogo.onConfirm}
        />
        <InfoSnackbar
          openSnackbar={snackbar.open}
          setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
          message={snackbar.message}
          severity={snackbar.severity}
          autoHide={snackbar.autoHide}
        />
      </Container>
    </BaseUI>
  );
}

export default CalificarSprintU;

// Definición de estilos usando styled-components
const Container = styled("div")`
  padding: 1.5rem;
  .datosSprint {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .titulo {
    margin-bottom: 1rem;
  }

  .entregables,
  .archivos {
    padding: 1rem;
    margin-top: 1rem;
    flex: 1;
    box-sizing: border-box;
  }

  .entregableItem,
  .archivoItem {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  .archivoItem {
    margin-bottom: 0.6rem;
  }

  .archivoLink {
    color: #3f51b5;
    text-decoration: none;
  }

  .estadoArchivo {
    color: gray;
  }
  .estadoArchivo-red {
  }
  .comentarioNota {
    padding: 1rem;
    margin-top: 1rem;
  }

  .inputComentario {
    margin-top: 0.5rem;
  }

  .notaField {
    margin-top: 1rem;

    .notaLabel {
      margin-right: 0.5rem;
    }

    .notaInput {
      width: 5rem;
    }
  }
  .archivosTexto {
    margin-left: 1rem;
  }
`;
