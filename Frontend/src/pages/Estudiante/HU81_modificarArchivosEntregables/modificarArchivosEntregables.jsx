import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BaseUI from "../../../components/baseUI/baseUI";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import DesitionsButtons from "../../../components/Buttons/decisionButtons";
import { getSprintConEntregables } from "../../../api/getEmpresa";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {actualizarEntregable} from "../../../api/getEmpresa";
import ClearIcon from "@mui/icons-material/Clear";
const UploadContainer = styled(Box)(({ theme, hasFile }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(2),
  cursor: hasFile ? "default" : "pointer",
  transition: "0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));
const FileActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));
const FileItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  width: "100%",
  backgroundColor: theme.palette.background.paper,
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflow:'hidden',
  textOverflow:'ellipsis'
}));

function CalificarSprintU() {
  const idSprint = localStorage.getItem("idSprint");
  const [datosSprint, setDatosSprint] = useState({
    idSprint: "",
    numeroSprint: "",
    entregables: [],
  });
  const [archivos, setArchivos] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHide: 6000,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });
  const [cuadroDialogo, setCuadroDialogo] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const fetchSprints = async () => {
    try {
      const sprintData = await getSprintConEntregables(idSprint);
      setDatosSprint(sprintData.sprints);
      console.log(sprintData.sprints.entregables);  
      const newArchivos = sprintData.sprints.entregables.map((entregable) => {
        if (entregable.archivoEntregable !== null) {
          const archivo = entregable.archivoEntregable;
          return {
            name: entregable.nombreArchivo,
            lastModified: new Date(),
            lastModifiedDate: new Date(),
            size: Number(entregable.tamanioArchivo) , // 1 MB
            type: entregable.nombreArchivo.split(".").pop(),
            webkitRelativePath: archivo || null,
            isUploaded: false,
          };
        } else {
          return null;
        }
      });
  
      setArchivos(newArchivos);
      setLoading(false);
      console.log(newArchivos)
    } catch (error) {
      setError({
        error: true,
        errorMessage: "Ha ocurrido un error",
        errorDetails: error.message,
      });
      console.error("Error al cargar la tarea:", error);
    }
  };
  

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleFileChange = async (event, index) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile.name.length > 30 ) {
      setSnackbar({
        open: true,
        message: 'El nombre del archivo no puede superar los 30 caracteres.',
        severity: "info",
        autoHide: 6000,
      });
      return;
    }
    if (uploadedFile.size > 100 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: 'El archivo no puede superar los 100 MB.',
        severity: "info",
        autoHide: 6000,
      });
      return;
    }
    const newArchivos = [...archivos];
    newArchivos[index] = uploadedFile
    console.log(newArchivos)
    setArchivos(newArchivos);
    
    const entregables = await Promise.all(
      datosSprint.entregables.map(async (entregable, i) => {
        if (i !== index) return entregable;
        const newArchivo = await convertFileToBase64(uploadedFile);
        return {
          ...entregable,
          nombreArchivo: uploadedFile.name,
          archivoEntregable: newArchivo,
        };
      })
    );
  
    setDatosSprint({
      ...datosSprint,
      entregables,
    });
  };
  
  const handleSave = async () => {
    try {
      const entregables = datosSprint.entregables.map((entregable, i) => {
        return {
          idEntregables: entregable.idEntregables,
          nombreArchivo: entregable.nombreArchivo,
          archivoEntregable: entregable.archivoEntregable,
        };
      });
      console.log("entregables", entregables)
      const response = await actualizarEntregable({entregables: entregables});
      console.log("response", response)
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Entregables enviados correctamente.",
          severity: "success",
          autoHide: 6000,
        });
      }else {
        setSnackbar({
          open: true,
          message: "Error al enviar los entregables.",
          severity: "error",
          autoHide: 6000,
        });
      }
    } catch (error) {
      console.error("Error al enviar entregables:", error);
      setSnackbar({
        open: true,
        message: `Hubo un error al momento de enviar entregables: ${error.message}`,
        severity: "error",
        autoHide: 6000,
      });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => {
    setArchivos(datosSprint.entregables.map(() => null));
  };

  const confirmSave = () => {
    setCuadroDialogo({
      open: true,
      title: "Confirmar envío",
      description: "¿Estás seguro de que deseas enviar los entregables?",
      onConfirm: () => {
        handleSave();
        setCuadroDialogo({ ...cuadroDialogo, open: false });
      },
    });
  };

  const selectFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <PictureAsPdfIcon color="error" />;
      case "zip":
      case "rar":
        return <FolderZipIcon color="primary" />;
      case "docx":
      case "doc":
        return <DescriptionIcon color="action" />;
      case "xlsx":
      case "xls":
        return <InsertDriveFileIcon color="success" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <ImageIcon color="primary" />;
      default:
        return <InsertDriveFileIcon />;
    }
  };


  const handleDownloadFile = async (file) => {
    if (file.isUploaded!==false) {
      // Si es un archivo subido por el usuario
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      try {
        const url = file.webkitRelativePath || '';
          if (url) {
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name || 'archivo';
              a.click();
              URL.revokeObjectURL(url);
          }
         else {
          console.error("No se pudo obtener la URL del archivo del servidor.");
          setSnackbar({
            open: true,
            message: "No se encontró la URL del archivo.",
            severity: "error",
            autoHide: 6000,
          });
        }
      } catch (error) {
        console.error("Error al intentar descargar el archivo:", error);
        setSnackbar({
          open: true,
          message: `Error al descargar el archivo: ${error.message}`,
          severity: "error",
          autoHide: 6000,
        });
      }
    }
  };
  
  
  const handleRemoveFile = (index) => {
    const newArchivos = [...archivos];
    newArchivos[index] = null;
    setArchivos(newArchivos);
    console.log(newArchivos)
    const entregables = datosSprint.entregables.map((entregable, i) => {
      if (i !== index) return entregable;
      return {
        ...entregable,
        nombreArchivo: null,
        archivoEntregable: null
      };
    });
    
    setDatosSprint({
      ...datosSprint,
      entregables,
    });
  };

  if (loading)
    return (
      <BaseUI titulo={"CALIFICAR SPRINT"} loading={loading} error={error}>
        <Loading />
      </BaseUI>
    );

  if (error.error)
    return (
      <BaseUI titulo={"CALIFICAR SPRINT"} loading={loading} error={error}>
        <Error />
      </BaseUI>
    );

  return (
    <BaseUI 
      confirmarAtras={true} 
      dirBack={'/homeEstu'} 
      titulo={"MODIFICAR ARCHIVOS ENTREGABLES SPRINT"} 
      loading={loading} 
      error={error}
    >
      <Container>
        <Box>
          <Typography variant="h4" className="titulo">
            SPRINT {datosSprint.numeroSprint}
          </Typography>
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
        <Paper className="entregables">
          <Typography variant="h6">Entregables</Typography>
          {datosSprint.entregables.map((entregable, index) => (
            <FileItem key={index} sx={{flexWrap:'wrap'}}>
              <Box>
                <Typography>{entregable.descripcionEntregable}</Typography>
              </Box>
              <Box>
                <UploadContainer hasFile={archivos[index]!==null} sx={{width:'calc(18vw + 6rem)', display:"flex", minWidth:'calc(18vw + 6rem)', maxWidth:'calc(18vw + 6rem)'}}>
                  <input
                    type="file"
                    id={`file-upload-${index}`}
                    style={{ display: "none" }}
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  {archivos[index] ? (
                    <FileItem sx={{margin:'0', padding:'0', width:'auto', maxWidth:'calc(18vw + 6rem)', justifyContent:"start"}}>   
                      <IconButton onClick={() => handleDownloadFile(archivos[index])} sx={{marginLeft:'0'}}>
                        {selectFileIcon(archivos[index].name)}
                      </IconButton>
                      <FileInfo>
                        <Typography variant="body2" 
                          noWrap
                          color="blue"
                          onClick={() => handleDownloadFile(archivos[index])}
                          sx={{textDecoration:'underline', cursor:'pointer'}}
                        >
                          {archivos[index].name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {(archivos[index].size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </FileInfo>
                      <FileActions>
                        <IconButton 
                          onClick={() => handleRemoveFile(index)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </FileActions>
                    </FileItem>
                  ) : (
                    <label htmlFor={`file-upload-${index}`}>
                      <Box sx={{ display: "flex", alignItems: "center"}}>
                        <IconButton component="span">
                          <InsertDriveFileIcon fontSize="large" />
                        </IconButton>
                        <Typography>Subir archivo</Typography>
                        <Typography variant="caption" color="textSecondary">
                          100 MB máximo
                        </Typography>
                      </Box>
                    </label>
                  )}
                </UploadContainer>
              </Box>
            </FileItem>
          ))}
        </Paper>
        <DesitionsButtons
            rejectButtonText="Descartar"
            validateButtonText="Guardar cambios"
            onReject={handleCancel}
            onValidate={confirmSave}
            disabledButton={0}
        />
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

const Container = styled("div")`
  padding: 1.5rem;
  .titulo {
    margin-bottom: 1rem;
  }
  .entregables {
    padding: 1rem;
    margin-top: 1rem;
  }
`;
