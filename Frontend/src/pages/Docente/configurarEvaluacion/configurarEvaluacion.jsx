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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseUI from "../../../components/baseUI/baseUI";
import {
  configurarEvaluacion,
  getEvaluacionesGrupo,
} from "../../../api/configurarEvaluaciones/configurarEvaluaciones";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo";
const ConfigurarEvaluacion = () => {
  const [criterios, setCriterios] = useState([
    { descripcion: "", notaMaxima: 0 },
  ]);
  const [tipoEvaluacion, setTipoEvaluacion] = useState("");
  const [totalNota, setTotalNota] = useState(0);
  const [fechaEvaluacion, setFechaEvaluacion] = useState("");
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
  const tiposEvaluacion = [
    { id: "autoevaluacion", nombre: "Autoevaluación" },
    { id: "evaluacionCruzada", nombre: "Evaluación Cruzada" },
    { id: "evaluacionPares", nombre: "Evaluación a Pares" },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      const idGrupo = localStorage.getItem("idGrupo");
      const response = await getEvaluacionesGrupo(idGrupo);
      console.log(response);
      if (!response.error) {
        setCriterios(
          response.criterios.map((criterio) => ({
            descripcion: criterio.descripcion,
            notaMaxima: criterio.rangoMaximo,
          }))
        );
        setTipoEvaluacion(response.tipoEvaluacion);
        setFechaEvaluacion(response.fechaEvaluacion);
      } else {
        setError({
          error: true,
          errorMessage: "Hubo un error",
          errorDetails: response.error,
        });
      }
      setLoading(false);
      console.log(error);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const nuevoTotal = criterios.reduce(
      (total, criterio) => total + Number(criterio.notaMaxima),
      0
    );
    setTotalNota(nuevoTotal);
  }, [criterios]);

  const handleAddCriterio = () => {
    if (totalNota < 100) {
      setCriterios([...criterios, { descripcion: "", notaMaxima: 0 }]);
    }
  };

  const handleCriterioChange = (index, field, value) => {
    const nuevosCriterios = [...criterios];
    if (field === "notaMaxima") {
      const nuevaNota = Number(value);
      const notaAnterior = Number(nuevosCriterios[index].notaMaxima);
      if (totalNota - notaAnterior + nuevaNota > 100) {
        return; // No permitir el cambio si excede 100
      }
    }
    nuevosCriterios[index][field] = value;
    setCriterios(nuevosCriterios);
  };

  const handleDeleteCriterio = (index) => {
    const nuevosCriterios = criterios.filter((_, i) => i !== index);
    setCriterios(nuevosCriterios);
  };

  const handleTipoEvaluacionClick = (tipo) => {
    setTipoEvaluacion(tipo);
  };

  const handleFechaChange = (event) => {
    setFechaEvaluacion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const idGrupo = localStorage.getItem("idGrupo");
    const dataEvaluacion = {
      idGrupo: Number(idGrupo),
      criterios: criterios.map((criterio) => ({
        descripcion: criterio.descripcion,
        notaMaxima: Number(criterio.notaMaxima),
      })),
      tipoEvaluacion: tipoEvaluacion,
      fechaEvaluacion: fechaEvaluacion,
    };
    const respuesta = await configurarEvaluacion(dataEvaluacion);
    console.log(respuesta);
    if (respuesta.error) {
      console.log(respuesta);
      setSnackbar({
        open: true,
        message: `${respuesta.error}`,
        severity: "error",
        autoHide: 60000,
      });
    } else if (respuesta.errors) {
      console.log(respuesta);
      setSnackbar({
        open: true,
        message: `${respuesta.message}`,
        severity: "error",
        autoHide: 60000,
      });
    } else {
      setSnackbar({
        open: true,
        message: `${respuesta.message}`,
        severity: "success",
        autoHide: 60000,
      });
    }
  };

  return (
    <BaseUI
      titulo={"CONFIGURAR EVALUACION"}
      ocultarAtras={false}
      confirmarAtras={true}
      dirBack={"/homeDocente"}
      loading={loading}
      error={error}
    >
      
      <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
        Criterios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Criterio</TableCell>
              <TableCell align="right">Nota Máxima</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {criterios.map((criterio, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    value={criterio.descripcion}
                    onChange={(e) =>
                      handleCriterioChange(index, "descripcion", e.target.value)
                    }
                    placeholder={`Criterio ${index + 1}`}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={criterio.notaMaxima}
                    onChange={(e) =>
                      handleCriterioChange(index, "notaMaxima", e.target.value)
                    }
                    inputProps={{
                      min: 0,
                      max: 100 - (totalNota - criterio.notaMaxima),
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteCriterio(index)}
                    disabled={criterios.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCriterio}
        style={{ marginTop: "20px" }}
        disabled={totalNota >= 100}
      >
        Agregar Criterio
      </Button>
      <Box mt={3}>
        <Typography variant="h6">Nota Total: {totalNota}</Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Tipo de Evaluación
        </Typography>
        <List>
          {tiposEvaluacion.map((tipo) => (
            <ListItem key={tipo.id} disablePadding>
              <ListItemButton
                onClick={() => handleTipoEvaluacionClick(tipo.id)}
              >
                <ListItemIcon>
                  <Radio
                    checked={tipoEvaluacion === tipo.id}
                    onChange={() => handleTipoEvaluacionClick(tipo.id)}
                    value={tipo.id}
                    name="tipo-evaluacion-radio"
                    inputProps={{ "aria-label": tipo.nombre }}
                  />
                </ListItemIcon>
                <ListItemText primary={tipo.nombre} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Fecha de Evaluación
        </Typography>
        <TextField
          type="date"
          value={fechaEvaluacion}
          onChange={handleFechaChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
      >
        Guardar Configuración
      </Button>
      <InfoSnackbar
        openSnackbar={snackbar.open}
        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </BaseUI>
  );
};

export default ConfigurarEvaluacion;
