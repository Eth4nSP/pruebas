import { Fragment, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

function TablaPlanificacion({ sprints, ocultarBotones }) {

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Hito</TableCell>
                <TableCell align="left">Fecha Inicio</TableCell>
                <TableCell align="left">Fecha Fin</TableCell>
                <TableCell align="left">Fecha Entrega</TableCell>
                <TableCell align="left">Cobro (%)</TableCell>
                <TableCell align="left">Entregables</TableCell>
                {!ocultarBotones && <TableCell align="left"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sprints.map((sprint, index) => {
                const fechaInicioSprint = new Date(sprint.fechaIni);
                const fechaActual = new Date(); // Define fechaActual
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {"SPRINT " + (index + 1)}
                    </TableCell>
                    <TableCell align="left">{sprint.fechaIni}</TableCell>
                    <TableCell align="left">{sprint.fechaFin}</TableCell>
                    <TableCell align="left">{sprint.fechaEntrega}</TableCell>
                    <TableCell align="left">{sprint.cobro}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxHeight: 200 , overflowY: "auto" }}>

                        <List dense disablePadding>
                          {sprint.entregables.map(
                            (entregable, entregableIndex) => (
                              <ListItem key={entregableIndex} disableGutters>
                                <ListItemText
                                  primary={`${entregableIndex + 1}. ${
                                    entregable.descripcionEntregable
                                  }`}
                                  primaryTypographyProps={{ variant: "body2" }}
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      </Box>
                    </TableCell>
                    {!ocultarBotones && (
                      <TableCell align="left">
                        {fechaActual >= fechaInicioSprint && (
                          <Button variant="contained">Ver Sprint</Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
           
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default TablaPlanificacion;
