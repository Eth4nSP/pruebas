/* eslint-disable react/prop-types */
const apiHost = import.meta.env.VITE_HOST;
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box
} from "@mui/material";
import DecisionButtons from "../Buttons/decisionButtons";
import CuadroDialogo from "../cuadroDialogo/cuadroDialogo";
import InfoSnackbar from "../infoSnackbar/infoSnackbar";

const TablaEvaluacionSemanal = ({ semana, comentariosN, showButtons = true, setSeSubio }) => {
  const [comentarios, setComentarios] = useState([])
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
  
  useEffect(() => {
    const iniciarComentarios = (
      semana?.estudiantes && Array.isArray(semana.estudiantes)
        ? semana.estudiantes.map((estudiante) => ({
            idSemana: semana.idSemana,
            idEstudiante: estudiante.idEstudiante,
            comentario: '',
            subido: false
          }))
        : []
    );
    const newComentarios = iniciarComentarios.map((comentario) => {
      const indice = comentariosN.findIndex(
        (estudiante) => estudiante.idEstudiante === comentario.idEstudiante
      );
      return indice === -1 
        ? comentario  // Si no se encuentra, deja el comentario vacío
        : { ...comentario, comentario: comentariosN[indice].comentario, subido: true }; // Si se encuentra, actualiza el comentario
    });  
    setComentarios(newComentarios);
  }, [comentariosN]);

  const handleComentarioChange = (index, value) => {
    const newComentarios = [...comentarios];
    newComentarios[index] = {
      ...newComentarios[index],
      comentario: value,
    };
    setComentarios(newComentarios);
  };
  

  const handleSave = () => {
    setCuadroDialogo({
      open: true,
      title: "Guardar los cambios",
      description: "Esta acción guardará todos los cambios realizados en la tarea. ¿Está seguro?",
      onConfirm: handleSubmit,
    });
  };

  const handleCancel = () => {
    setCuadroDialogo({
      open: true,
      title: "Descartar los cambios",
      description: "Esta acción no se puede deshacer. Todos los cambios realizados se perderán. ¿Está seguro?",
      onConfirm: () => window.location.reload(),
    });
  };

  const handleSubmit = async () => {
    const comentariosNoSubidos = comentarios.filter((comentario)=> comentario.subido === false && comentario.comentario !== '')
    try {  
      const response = await fetch(
        `${apiHost}/docente/evaluacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comentariosNoSubidos),
          credentials: 'include'
        }
      );
      if(response.ok){
        console.log('se subio correctamente')
        setSnackbar({
            open: true,
            message: `Se guardo los comentarios correctamente`,
            severity: "success",
            autoHide: 6000,
        });
        setSeSubio(true)
        setCuadroDialogo({
          open: false,
          onConfirm: () => {},
          title: "",
          description: "",
        });
      }
    } catch (error) {
    console.error("Error al actualizar la tarea:", error);
        setSnackbar({
            open: true,
            message: `Hubo un error al momento de subir, error: ${error}`,
            severity: "error",
            autoHide: 60000,
        });
    } finally{
      setCuadroDialogo({
        open: false,
        title: "Guardar los cambios",
        description: "Esta acción guardará todos los cambios realizados en la tarea. ¿Está seguro?",
        onConfirm: handleSubmit,
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="team evaluation table">
          <TableHead>
            <TableRow>
              <TableCell>Integrante</TableCell>
              <TableCell>Tareas</TableCell>
              <TableCell>Comentario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {semana?.estudiantes?.map((estudiante, index) => {
              console.log(comentarios)
              return <TableRow key={index}>
                <TableCell>{estudiante.nombre} {estudiante.apellido}</TableCell>
                <TableCell>
                  <ul>
                    {estudiante?.tareas.length > 0 ?
                      estudiante?.tareas.map((tarea, idx) => (
                        <li key={idx}>{tarea.nombreTarea}</li>
                      ))
                      :
                      <li style={{color:'red'}}>Sin tareas asignadas</li>
                    }
                  </ul>
                </TableCell>
                <TableCell>
                  {!(comentarios[index]?.subido) && showButtons?
                    <TextField
                      multiline
                      rows={3}
                      defaultValue={''}
                      value={comentarios[index]?.comentario}
                      onChange={(e) => handleComentarioChange(index, e.target.value)}
                      fullWidth
                      placeholder="Ingrese un comentario"
                    />
                    :
                    <Box
                        
                        sx={{
                            textAlign: 'left',
                            minHeight: '70px',
                            padding: '8px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px'
                        }}
                    >
                        {comentarios[index]?.comentario}
                    </Box>
                  }
                </TableCell>
              </TableRow>
            })}
            
          </TableBody>
        </Table>
      </TableContainer>
      {
        showButtons && <DecisionButtons
          rejectButtonText="Descartar"
          validateButtonText="Guardar Evaluación"
          onReject={handleCancel}
          onValidate={handleSave}
          disabledButton={0}
        />
      }

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
    </>
  );
};

export default TablaEvaluacionSemanal;
