import React from 'react';
import { Box, Typography, Paper, Icon } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function Error({ errorMessage = 'Ha ocurrido un error', errorDetails = 'Por favor, inténtelo de nuevo más tarde.' }) {
  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Icon component={ErrorOutlineIcon} sx={{ fontSize: 60, color: 'error.main' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'error.dark', textAlign: 'center' }}>
          {errorMessage}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'error.dark' }}>
          {errorDetails}
        </Typography>
      </Box>
  );
}