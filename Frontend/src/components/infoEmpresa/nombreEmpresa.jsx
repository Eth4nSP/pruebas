import { Fragment } from 'react';
import styled from '@emotion/styled'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
  } from "@mui/material";
function NombreEmpresa({nombreLargo, nombreCorto}) {
  return (
    <Paper elevation={1} sx={{ p: 2, my: 1 }}>
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="subtitle" component="h1" gutterBottom>
          {nombreCorto}
        </Typography>
        <Typography variant="subtitle" component="h3" color="text.secondary">
          {nombreLargo}
        </Typography>
        </Box>
    </Paper>
  );
}

export default NombreEmpresa;

