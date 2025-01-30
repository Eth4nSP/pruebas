const apiHost = import.meta.env.VITE_HOST;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseUI from '../../../components/baseUI/baseUI.jsx';
import { styled, Box, Button, Stack, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getGrupoDescripcion = async (idGrupo) => {
  try {
    const response = await fetch(`${apiHost}/estudiante/descripcionGrupo/${idGrupo}`, {credentials: 'include'});
    if (!response.ok) {
      throw new Error('Error al obtener la descripción');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

const enviarClave = async (idGrupo, clave, idEstudiante) => {
  try {
    const response = await fetch(`${apiHost}/estudiante/asignarEstudiante`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idGrupo, clave, idEstudiante }),
      credentials: 'include'
    });

    const data = await response.json();

    return { status: response.status, message: data.message };
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};



function GrupoDescripcion() {
  const idGrupo = localStorage.getItem("idGrupoQuieroInscribirme")
  const idEstudiante = localStorage.getItem("idEstudiante")
  const [codigo, setCodigo] = useState('');
  const [datos, setDatos] = useState(null); 
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGrupoDescripcion(idGrupo);
        setDatos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idGrupo]);

  const validarCodigo = async () => {
  
      try {
        const response = await enviarClave(idGrupo, codigo, idEstudiante);
  
        if (response.status === 200) {
          setSnackbar({ open: true, message: 'Se matriculó correctamente', severity: 'success' });
          setTimeout(() => {
            setSnackbar(prevState => ({ ...prevState, open: false }));
            navigate('/');
          }, 2500);

        } else if(response.status === 201) {
          setSnackbar({ open: true, message:'Código de Acceso inválido.', severity: 'error' });
        }else {
          setSnackbar({ open: true, message: response.message || 'Error al matricularse', severity: 'error' });
          setTimeout(() => {
            setSnackbar(prevState => ({ ...prevState, open: false }));
            navigate('/');
          }, 2500);
        }       
      } catch (error) {
        console.log(error)
        setSnackbar({ open: true, message: 'Error al matricularse', severity: 'error' });
      }
  };
  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  return (
    <BaseUI titulo="MATRICULARSE CON UN DOCENTE" ocultarAtras={false} confirmarAtras={true} dirBack={`/GruposDocente`}error={{error:error}} loading={loading}>
      <Box component="section" sx={{ p: 2, pb: 0, border: '1p' }}>
        <h1 style={{ fontSize: '25px' }}>
          {datos?.apellidoPaternoDocente} {datos?.apellidoMaternoDocente} {datos?.nombreDocente} G{datos?.numGrupo}
        </h1>
      </Box>
      <Box component="section" m={2.8} minHeight={150} sx={{ p: 0.5, fontSize: '0.8rem' }}>
        {datos?.descripcion}
      </Box>
      <Stack direction='row' spacing={2} pt={8} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Box>Código de Acceso:</Box>
        <StyledWrapper>
          <input
            placeholder="CODIGO"
            className="input"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </StyledWrapper>
      </Stack>
      <Box pt={1} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 50, width: '200px', height: '30px' }}
          onClick={validarCodigo}
          disabled={!codigo}>
          MATRICULARSE
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseUI>
  );
}

export default GrupoDescripcion;

const StyledWrapper = styled('div')`
  .input {
    border: 2px solid transparent;
    width: 15em;
    height: 2.5em;
    padding-left: 0.8em;
    outline: none;
    overflow: hidden;
    background-color: #cfd4e1;
    border-radius: 3px;
    transition: all 0.5s;
  }

  .input:hover,
  .input:focus {
    border: 2px solid #4A9DEC;
    background-color: white;
  }
`;
