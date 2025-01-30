/* eslint-disable react/prop-types */
const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Button,
  TextField,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  AlertTitle,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoSnackbar from "../infoSnackbar/infoSnackbar";
import CuadroDialogo from "../cuadroDialogo/cuadroDialogo";
import DecisionButtons from "../Buttons/decisionButtons";
import AnadirEntregables from "../anadirEntregables/anadirEntregables";

export default function EditarPlanificacion({ planificacionData, idEmpresa }) {
  const [rows, setRows] = useState([]);
  const [openEntregables, setOpenEntregables] = useState(false);
  const [currentSprintIndex, setCurrentSprintIndex] = useState(-1);
  const [totalCharge, setTotalCharge] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [cuadroDialogo, setCuadroDialogo] = useState({
    open: false,
    onConfirm: () => {},
    title: "",
    description: "",
  });
  const handleOpenEntregables = (index) => {
    setCurrentSprintIndex(index);
    setOpenEntregables(true);
  };

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
  const handleCloseEntregables = (newEntregables) => {
    if (currentSprintIndex !== -1) {
      const newRows = [...rows];
      newRows[currentSprintIndex].entregables = newEntregables;
      setRows(newRows);
    }
    setOpenEntregables(false);
    setCurrentSprintIndex(-1);
  };
  const handleCancel = () => {
    setCuadroDialogo({
      open: true,
      title: "Descartar los cambios",
      description:
        "Esta acción no se puede deshacer. Todos los cambios realizados se perderán.  ¿Está seguro?",
      onConfirm: () => window.location.reload(),
    });
  };
  const handleSave = () => {
    setCuadroDialogo({
      open: true,
      title: "Guardar los cambios",
      description:
        "Esta acción guardará todos los cambios realizados en la planificación. ¿Está seguro?",
      onConfirm: subir,
    });
  };

  useEffect(() => {
    const newRows = planificacionData.sprints.map((sprint, index) => {
      return {
        hito: `SPRINT ` + (index + 1),
        fechaIni: sprint.fechaIni,
        fechaFin: sprint.fechaFin,
        fechaEntrega: sprint.fechaEntrega,
        cobro: sprint.cobro,
        entregables: sprint.entregables
          ? sprint.entregables.map(
              (entregable) => entregable.descripcionEntregable
            )
          : [],
      };
    });
    setRows(newRows);
    updateTotalCharge(newRows);
  }, [planificacionData]);

  const updateTotalCharge = (newRows) => {
    const total = newRows.reduce((sum, row) => sum + parseFloat(row.cobro || 0), 0);
    setTotalCharge(total);
  };

  const addRow = () => {
    if (rows.length >= 10) {
      setSnackbar({
        open: true,
        message: "No se pueden añadir más de 10 sprints.",
        severity: "warning",
        autoHide: 6000,
      });
      return;
    } else {
      const newSprint = rows.length + 1;
      const newRow = {
        hito: `SPRINT ${newSprint}`,
        fechaIni: "",
        fechaFin: "",
        fechaEntrega: "",
        cobro: "",
        entregables: [],
      };
      setRows([...rows, newRow]);
    }
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };
  const dialogoEliminar = (index, hito) => {
    setCuadroDialogo({
      open: true,
      title: `Eliminar ${hito}`,
      description:
        "Esta acción no se puede deshacer. Todos los cambios realizados se perderán.  ¿Está seguro?",
      onConfirm: () => {
        deleteRow(index);
        setCuadroDialogo({ ...cuadroDialogo, open: false });
      },
    });
  };
  const handleCellChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    // Validate dates
    if (field.includes("fecha")) {
      const currentDate = new Date().toISOString().split("T")[0];
      const prevSprintEndDate = index > 0 ? rows[index - 1].fechaFin : null;

      if (value < currentDate) {
        setSnackbar({
          open: true,
          message: `${newRows[index].hito}: No se permite seleccionar fechas anteriores al día actual.`,
          severity: "error",
          autoHide: 6000,
        });
      } else if (field === "fechaIni") {
        
          if(index === 0){
            const fechaIni2 = new Date(localStorage.getItem('fechaLimiteEntregaEmpresa'))
            if(new Date(value) > fechaIni2){
              setSnackbar({
                open: true,
                message: `${newRows[index].hito}: La fecha de inicio no puede ser anterior a la fecha inicio de la planificacion.`,
                severity: "error",
                autoHide: 6000
              });
            }
          }

        if (prevSprintEndDate && value < prevSprintEndDate) {
          setSnackbar({
            open: true,
            message: `${newRows[index].hito}: La fecha de inicio no puede ser anterior a la fecha fin del sprint anterior.`,
            severity: "error",
            autoHide: 6000
          });
        } else if (
          newRows[index].fechaFin != "" &&
          value > newRows[index].fechaFin
        ) {
          setSnackbar({
            open: true,
            message: `${newRows[index].hito}: La fecha de inicio no puede ser posterior a la fecha fin del mismo sprint.`,

            severity: "error",
            autoHide: 6000
          });
        }
      } else if (field === "fechaFin" && index === rows.length()-1) {
        const fechaIni2 = new Date(localStorage.getItem('fechaLimiteEntregaPlanificacion'))
            if(new Date(value) < fechaIni2){
              setSnackbar({
                open: true,
                message: `${newRows[index].hito}: La fecha de fin del ultimo sprint no puede ser mayor a la fecha fin de la planificacion.`,
                severity: "error",
                autoHide: 6000
              });
            }
      }else if (field === "fechaFin" && value < newRows[index].fechaIni) {
        setSnackbar({
          open: true,
          message: `${newRows[index].hito}: La fecha fin no puede ser anterior a la fecha de inicio del mismo sprint.`,
          severity: "error",
          autoHide: 6000
        });
      } else if (field === "fechaEntrega" && value < newRows[index].fechaFin) {
        setSnackbar({
          open: true,
          message: `${newRows[index].hito}: La fecha de entrega no puede ser anterior a la fecha fin del mismo sprint.`,
          severity: "error",
          autoHide: 6000
        });
        return;
      }
    }
    setRows(newRows);
    if (field === 'cobro') {
      updateTotalCharge(newRows);
    }
  };

  const fieldNames = {
    fechaIni: "Fecha de inicio",
    fechaFin: "Fecha de Fin",
    fechaEntrega: "Fecha de Entrega",
    cobro: "Cobro",
    entregables: "Entregables",
  };

  const subir = async () => {
    setCuadroDialogo({
      ...cuadroDialogo,
      open: false,
    });
    let rowIndex = 0;
    for (const row of rows) {
      rowIndex++;
      for (const [key, value] of Object.entries(row)) {
        if (value === "" || value === null) {
          const fieldName = fieldNames[key] || key;
          console.error(
            `Campo vacío encontrado en Sprint ${rowIndex}: ${fieldName}`
          );
          setSnackbar({
            open: true,
            message: `Sprint ${rowIndex}: El campo "${fieldName}" está vacío`,
            severity: "warning",
            autoHide: 60000,
          });
          return;
        }
      }
    }

    const dataPlanificacion = {
      idEmpresa: Number(idEmpresa),
      comentarioprivado: String(
        planificacionData.comentarioprivado
          ? planificacionData.comentarioprivado
          : null
      ),
      aceptada: 0,
    };
    const dataSprint = {
      idEmpresa: Number(idEmpresa),
      sprints: rows.map((row) => ({
        fechaIni: row.fechaIni,
        fechaFin: row.fechaFin,
        fechaEntrega: row.fechaEntrega,
        cobro: Number(row.cobro),
        entregables: row.entregables,
      })),
    };
    console.log(dataSprint);
    const response = await fetch(
      `${apiHost}/planificacion/guardarPlanificacion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPlanificacion),
        credentials: 'include'
      }
    );
    const responseData = await response.json();
    if (responseData.error !== undefined && responseData.error !== null) {
      setSnackbar({
        open: true,
        message: `Error al actualizar la planificacion: ${responseData.error}${responseData.message}`,
        severity: "error",
        autoHide: 60000,
      });
    } else {
      console.log("Planificacion modificada con exito.");
      const responseSprint = await fetch(
        `${apiHost}/planificacion/guardarSprints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSprint)
        }
      );
      const responseDataSprint = await responseSprint.json();
      console.log(responseDataSprint);
      console.log(dataSprint);
      if (
        responseDataSprint.error !== undefined &&
        responseDataSprint.error !== null
      ) {
        setSnackbar({
          open: true,
          message: `Error al modificar los Sprints: ${responseDataSprint.error} ${responseDataSprint.message}`,
          severity: "error",
          autoHide: 60000,
        });
      } else if (
        responseDataSprint.errors !== undefined &&
        responseDataSprint.errors !== null
      ) {
        const errorMessages = Object.keys(responseDataSprint.errors)
          .map((key) => {
            const errors = responseDataSprint.errors[key];
            return errors
              .map((error) => `${translateError(error)} `)
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
        console.log("Sprints modificados con exito.");
        setSnackbar({
          open: true,
          message: `${responseDataSprint.message}`,
          severity: "success",
          autoHide: 6000,
        });
        if (
          responseDataSprint.sprints &&
          responseDataSprint.sprints.length > 0
        ) {
          // obtener datos de los entregables
          const entregables = rows.map((row) => row.entregables);

          // obtener id de los sprints de los entregables
          const idSprints = responseDataSprint.sprints.map((sprint) => ({
            idSprint: sprint.idSprint,
          }));
          const entregablesData = idSprints.map((sprint, index) => ({
            idSprint: sprint.idSprint,
            entregables: entregables[index] || [], // Asignar entregables correspondiente o un array vacío
          }));
          const responseEntregables = await fetch(
            `${apiHost}/planificacion/guardarEntregables`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ entregables: entregablesData }),
              credentials: 'include'
            }
          );

          const dataEntregables = await responseEntregables.json();
          if (
            dataEntregables.error !== undefined &&
            dataEntregables.error !== null
          ) {
            setSnackbar({
              open: true,
              message: `Error al modificar los Sprints: ${responseEntregables.error} ${responseDataSprint.message}`,
              severity: "error",
              autoHide: 60000,
            });
          } else if (
            dataEntregables.errors !== undefined &&
            dataEntregables.errors !== null
          ) {
            const errorMessages = Object.keys(dataEntregables.errors)
              .map((key) => {
                const errors = dataEntregables.errors[key];
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
            {
              /** Aun no se manejan los errores tipo {responseDataSprint.errors} */
            }
            console.log("Entregables modificados con exito.");
            setSnackbar({
              open: true,
              message: `${dataEntregables.message}`,
              severity: "success",
              autoHide: 6000,
            });
          }
        }
      }
    }
  };

  return (
    <>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de planificación">
            <TableHead>
              <TableRow>
                <TableCell>Hito</TableCell>
                <TableCell align="left">Fecha Inicio</TableCell>
                <TableCell align="left">Fecha Fin</TableCell>
                <TableCell align="left">Fecha Entrega</TableCell>
                <TableCell align="left">Cobro (%)</TableCell>
                <TableCell align="left">Entregables</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: "70px", maxHeight: "50px" }}>
                    {`SPRINT ${index + 1}`}
                  </TableCell>
                  {["fechaIni", "fechaFin", "fechaEntrega", "cobro"].map(
                    (field) => (
                      <TableCell
                        key={field}
                        align="left"
                        style={{ minWidth: field === "cobro" ? 100 : 100 }}
                      >
                        <TextField
                          value={row[field] ?? ""}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (field === "cobro") {
                              // Permitir solo números y un punto decimal
                              value = value.replace(/[^0-9.]/g, "");
                              // Asegurar que solo haya un punto decimal
                              const parts = value.split(".");
                              if (parts.length > 2) {
                                value =
                                  parts[0] + "." + parts.slice(1).join("");
                              }
                              // Limitar a dos decimales
                              if (parts[1] && parts[1].length > 2) {
                                value = parseFloat(value).toFixed(2);
                              }
                            }
                            handleCellChange(index, field, value);
                          }}
                          type={
                            field.includes("fecha")
                              ? "date"
                              : field === "cobro"
                              ? "number"
                              : "text"
                          }
                          fullWidth
                          variant="standard"
                          inputProps={{
                            "aria-label": `${field} for ${row.hito}`,
                            ...(field === "cobro" && {
                              step: "0.01",
                              min: "0",
                              pattern: "^\\d+(\\.\\d{1,2})?$",
                            }),
                          }}
                        />
                      </TableCell>
                    )
                  )}
                  <TableCell align="left">
                    <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                      {row.entregables.length > 0 && (
                        <List dense sx={{ mb: 0.5 }}>
                          {row.entregables.map((entregable, i) => (
                            <ListItem key={i}>
                              <ListItemText
                                primary={`${i + 1}. ${entregable}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{ minWidth: "250px", maxHeight: "50px" }}
                      onClick={() => handleOpenEntregables(index)}
                    >
                      {row.entregables.length > 0
                        ? "Modificar Entregables"
                        : "Añadir Entregables"}
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    {rows.length > 1 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => dialogoEliminar(index, row.hito)}
                        sx={{ minWidth: "170px", maxHeight: "50px" }}
                      >
                        Eliminar Hito
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Cobro total:
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {totalCharge.toFixed(2)}%
                  </Typography>
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        {rows.length < 10 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addRow}
            sx={{ marginTop: "20px" }}
          >
            Añadir fila
          </Button>
        )}
        <DecisionButtons
          rejectButtonText="Descartar"
          validateButtonText="Guardar cambios"
          onReject={handleCancel}
          onValidate={handleSave}
          disabledButton= {0}
        />
      </Box>
      
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
      />
      <AnadirEntregables
        open={openEntregables}
        handleClose={handleCloseEntregables}
        initialEntregables={
          currentSprintIndex !== -1 ? rows[currentSprintIndex].entregables : []
        }
      />
    </>
  );
}
