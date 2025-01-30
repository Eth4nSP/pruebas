import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Redirecting() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "70%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5">
          Esta planificación ya ha sido validada.
        </Typography>
        <Typography variant="body1" style={{ marginTop: "16px" }}>
          Serás redirigido en 5 segundos...
        </Typography>
      </Box>
    </>
  );
}
