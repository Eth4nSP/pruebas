import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

const InfoEmpresa = ({ nombreLargo, nombreCorto, integrantes }) => {
  
  // ordenar por orden alfabetico
  const sortedIntegrantes = [...integrantes].sort((a, b) => {
    const fullNameA = `${a.primerApellido} ${a.segundoApellido} ${a.nombreEstudiante}`.toLowerCase();
    const fullNameB = `${b.primerApellido} ${b.segundoApellido} ${b.nombreEstudiante}`.toLowerCase();
    return fullNameA.localeCompare(fullNameB);
  });

  return (
    <Paper elevation={1} sx={{ p: 2, my: 1 }}>
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="title" component="h1" gutterBottom>
          {nombreCorto}
        </Typography>
        <Typography variant="subtitle" component="h3" color="text.secondary">
          {nombreLargo}
        </Typography>
      </Box>
      <Box sx={{ ml: 4 }}>
        <Typography variant="subtitle" component="h3" gutterBottom>
          Integrantes:
        </Typography>
        <List dense>
          {sortedIntegrantes.map((integrante, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`${integrante.primerApellido} ${integrante.segundoApellido} ${integrante.nombreEstudiante} `}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default InfoEmpresa;