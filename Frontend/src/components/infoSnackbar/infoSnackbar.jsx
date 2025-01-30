import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { styled } from "@mui/system";

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '12px 24px',
  '& .MuiAlert-icon': {
    fontSize: '24px',
  },
  ...(severity === 'success' && {
    backgroundColor: '#4caf50',
    color: '#fff',
  }),
  ...(severity === 'error' && {
    backgroundColor: '#f44336',
    color: '#fff',
  }),
  ...(severity === 'warning' && {
    backgroundColor: '#ff9800',
    color: '#fff',
  }),
  ...(severity === 'info' && {
    backgroundColor: '#2196f3',
    color: '#fff',
  }),
}));

const InfoSnackbar = ({
  openSnackbar,
  setOpenSnackbar,
  message = "This is a default message",
  severity = "info",
  autoHide = 6000,
}) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={openSnackbar}
      autoHideDuration={autoHide}
      onClose={handleClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <StyledAlert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled"
        elevation={6}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default InfoSnackbar;