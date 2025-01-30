// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#114093',
    },
    secondary: {
      main: '#E30613',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto, Arial, sans-serif'
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        textPrimary: {
          color: '#ffff', // Color del texto en botones de tipo texto
        },
      },
    },
    
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#fffff', // Texto en negro en general
        },
      },
    },
  },
});

export default theme;
