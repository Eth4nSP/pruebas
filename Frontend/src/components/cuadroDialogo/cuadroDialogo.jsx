import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const CuadroDialogo = ({ open, onClose, title, description, onConfirm }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6" component="h2" id="customized-dialog-title">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[300],
            '&:hover': {
              color: (theme) => theme.palette.grey[100],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">{description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CuadroDialogo;