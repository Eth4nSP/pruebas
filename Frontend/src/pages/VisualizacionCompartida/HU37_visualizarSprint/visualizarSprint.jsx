import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { getSprintPorId } from "../../../api/visualizarSprint/visualizarSprint";
import {
  Typography,
  Paper,
  Box,
  Button,
  Link,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import PhotoIcon from "@mui/icons-material/Photo";
import BaseUI from "../../../components/baseUI/baseUI";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.breakpoints.down("sm")}`]: {
    fontSize: "0.8rem",
    padding: "8px 4px",
  },
}));

function VisualizarSprint() {
  const [sprint, setSprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorDetails: "",
  });

  const { idEmpresa, idSprint } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const sprintData = await getSprintPorId(idSprint);
        setSprint(sprintData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError({
          error: true,
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
        setLoading(false);
      }
    }

    fetchData();
  }, [idSprint]);

  const handleVerTareas = () => {
    navigate(`/1/homeGrupoE/1/empresas/${idEmpresa}`);
  };

  const selectIcon = (nombreArchivo) => {
    if (!nombreArchivo) return <DescriptionIcon />;
    const tipo = nombreArchivo.split(".").pop().toLowerCase();
    switch (tipo) {
      case "pdf":
        return <PictureAsPdfIcon />;
      case "docx":
        return <DescriptionIcon />;
      case "zip":
        return <FolderZipIcon />;
      case "png":
      case "jpg":
        return <PhotoIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <BaseUI
      titulo="VISUALIZAR SPRINT"
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={`/visualizarSprint/empresa/${idEmpresa}`}
      loading={loading}
      error={error}
    >
      <Container>
        {!sprint ? (
          <Typography align="center">
            No se encontró información para este sprint.
          </Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              SPRINT {sprint.numeroSprint}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Inicio:</strong>{" "}
                    {new Date(sprint.fechaIni).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Fin:</strong>{" "}
                    {new Date(sprint.fechaFin).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Entrega:</strong>{" "}
                    {new Date(sprint.fechaEntrega).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" alignItems="center" mt={2}>
              <MonetizationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Cobro:</strong> {sprint.cobro}%
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="tabla de entregables y archivos"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Entregable</StyledTableCell>
                    <StyledTableCell>Archivo</StyledTableCell>
                    <StyledTableCell align="center">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sprint.entregables.map((entregable, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>
                        {entregable.descripcionEntregable}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center">
                          {selectIcon(entregable.nombreArchivo)}
                          <Box ml={1}>
                            {entregable.nombreArchivo ? (
                              <Link
                                href={`http://http://creativeharbor.tis.cs.umss.edu.bo/api:8000/storage/archivos/${entregable.nombreArchivo}`}
                                target="_blank"
                                underline="hover"
                              >
                                {entregable.nombreArchivo}
                              </Link>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No hay archivo adjunto
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography
                          variant="body2"
                          color={
                            entregable.nombreArchivo
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {entregable.nombreArchivo
                            ? "Entregado"
                            : "No entregado"}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </>
        )}
      </Container>
    </BaseUI>
  );
}

const Container = styled("div")`
  padding: 1.5rem;
`;

export default VisualizarSprint;
