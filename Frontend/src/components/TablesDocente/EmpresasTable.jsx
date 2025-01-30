const apiHost = import.meta.env.VITE_HOST;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

function EmpresasTable() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiHost}/empresas/`, {credentials: 'include'})
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEmpresas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError("Failed to load empresas. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleEmpresaClick = (idEmpresa) => {
    navigate(
      `/validarPlanificacion/Empresa/${idEmpresa}`
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: "80vh",
        overflow: "auto",
        minHeight: "200px",
      }}
    >
      <List sx={{ width: "100%", flexGrow: 1 }}>
        {empresas.map((empresa) => (
          <ListItem key={empresa.idEmpresa} disablePadding>
            <ListItemButton
              onClick={() => handleEmpresaClick(empresa.idEmpresa)}
            >
              <ListItemText
                primary={empresa.nombreEmpresa}
                secondary={empresa.nombreLargo}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default EmpresasTable;
