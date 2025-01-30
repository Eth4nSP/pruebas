import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";
import BaseUI from "../../../components/baseUI/baseUI";
import {
  evaluar,
  getDatosParaEvaluar,
} from "../../../api/realizarEvaluacion/realizarEvaluacion";

const RealizarEvaluacion = () => {
  const [evaluationData, setEvaluationData] = useState({
    tipoEvaluacion: "",
    fechaEvaluacion: "",
    evaluado: "",
    criterios: [],
    idEvaluacion: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [notas, setNotas] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idEstudiante = localStorage.getItem("idEstudiante");
        const response = await getDatosParaEvaluar(idEstudiante);

        if (response.error) {
          setError({
            error: true,
            errorMessage: "Error al cargar los datos de evaluación",
            errorDetails: response.error,
          });
        } else {
          // Establece los datos de evaluación
          setEvaluationData(response);

          // If notaTotal is present, we don't need to initialize the notas
          if (response.notaTotal === undefined || typeof response.notaTotal !== 'number') {
            // Inicializa las notas con los criterios de la respuesta
            const initialScores = {};
            response.criterios.forEach((criterio) => {
              initialScores[criterio.id] = 0;
            });
            setNotas(initialScores);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError({
          error: true,
          errorMessage: "Error al cargar los datos de evaluación",
          errorDetails: error.message,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScoreChange = (id, value) => {
    const criterio = evaluationData.criterios.find((c) => c.id === id);
    const newValue = Math.min(
      Math.max(0, parseInt(value, 10) || 0),
      criterio ? criterio.rangoMaximo : 0
    );
    setNotas((prevScores) => ({
      ...prevScores,
      [id]: newValue,
    }));
  };

  const calculateTotalScore = () => {
    return evaluationData.criterios.reduce(
      (sum, criterio) => sum + (notas[criterio.id] || 0),
      0
    );
  };

  const handleSubmit = async () => {
    const datosEvaluar = {
      idEvaluacion: evaluationData.idEvaluacion,
      notas: notas,
    };
    console.log("datos enviados:", datosEvaluar);
    try {
      const respuesta = await evaluar(datosEvaluar);
      console.log("Respuesta de la evaluación:", respuesta);

      if (respuesta.error) {
        setSnackbar({
          open: true,
          message: respuesta.message || "Error al realizar la evaluación",
          severity: "error",
          autoHide: 60000,
        });
      } else {
        setSnackbar({
          open: true,
          message: respuesta.message || "Evaluación realizada correctamente.",
          severity: "success",
          autoHide: 60000,
        });
        setTimeout(() => {
            window.location.reload(); // Cambia el estado tras 5 segundos
          }, 5000);
      }
    } catch (error) {
      console.error("Error al enviar la evaluación:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error al realizar la evaluación",
        severity: "error",
        autoHide: 60000,
      });
    }
    
  };
  return (
    <BaseUI
      titulo={"REALIZAR EVALUACION"}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={"/homeEstu "}
      loading={loading}
      error={error}
    >
    {evaluationData.notaTotal !== undefined && typeof evaluationData.notaTotal === 'number' ? (
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">
            Ya se realizó la evaluación
          </Typography>
        </Paper>
      ) : (
        <>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6">
          Tipo de Evaluacion:{" "}
          {evaluationData.tipoEvaluacion === "autoevaluacion"
            ? "Autoevaluación"
            : evaluationData.tipoEvaluacion === "evaluacionCruzada"
            ? "Evaluación Cruzada"
            : "Evaluación de Pares"}
        </Typography>
        <Typography variant="h6">
          Evaluando a: {evaluationData.evaluado ? evaluationData.evaluado : ""}
        </Typography>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Criterios</TableCell>
              <TableCell align="right">Nota Maxima</TableCell>
              <TableCell align="right">Tu Calificacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluationData.criterios &&
              evaluationData.criterios.map((criterio) => (
                <TableRow key={criterio.id}>
                  <TableCell>{criterio.descripcion}</TableCell>
                  <TableCell align="right">{criterio.rangoMaximo}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={notas[criterio.id] || 0}
                      onChange={(e) =>
                        handleScoreChange(criterio.id, e.target.value)
                      }
                      inputProps={{
                        min: 0,
                        max: criterio.rangoMaximo,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          Nota Total: {calculateTotalScore()} / 100
        </Typography>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Calificar Evaluacion
        </Button>
      </Box>
      <InfoSnackbar
        openSnackbar={snackbar.open}
        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
      </>
      )}
    </BaseUI>
  );
};

export default RealizarEvaluacion;
