import { Box, Typography } from "@mui/material";

function EstadoPlanificacion({ estado, comentariopublico, publicada}) {
  console.log(estado);
  console.log(comentariopublico);
  console.log(publicada);
  return (
    <Box display="flex" sx={{ textAlign: "center", mb: 1 }}>
      <Typography variant="subtitle" component="h2" gutterBottom sx={{ mr: 2 }}>
        Estado:
      </Typography>
      {estado === 1 ? (
        <Typography variant="subtitle" component="h2" color="green">
          Validada
        </Typography>
      ) : estado === 0 && (comentariopublico !== null && comentariopublico !== undefined) && publicada==0 ? (
        <Typography variant="subtitle" component="h2" color="red">
          No aceptada, debe corregir.
        </Typography>
      ) : estado === 0 && (comentariopublico !== null && comentariopublico !== undefined) && publicada==1 ? (
        <Typography variant="subtitle" component="h2" color="red">
        No aceptada, corregida.
      </Typography>
      ) : (
        <Typography variant="subtitle" component="h2" color="red">
          No revisada
        </Typography>
      )}
    </Box>
  );
}

export default EstadoPlanificacion;