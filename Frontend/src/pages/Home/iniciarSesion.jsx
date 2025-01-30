const apiHost = import.meta.env.VITE_HOST;

import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
  } from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import myImage from '../../assets/img/inicio.jpg';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { Link, useNavigate} from "react-router-dom";
import InfoSnackbar from '../../components/infoSnackbar/infoSnackbar'
import { useState } from "react";
  function IniciarSesion() {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "info",
    });
    const login = async (nombreCuenta, contrasena) => {
      
        console.log(nombreCuenta)
        console.log(contrasena)
      try {
        const response = await fetch(`${apiHost}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
             nombreCuenta: nombreCuenta,
             contrasena: contrasena
            }
            ),
            credentials: 'include',
        });
        
        if (response.ok) {
          setSnackbar({
            open: true,
            message: "Se logro iniciar sesion",
            severity: "success",
          });  
          const data = await response.json();
          const ENCRYPTION_KEY = 'mi_clave_super_segura';
          const encryp = CryptoJS.AES.encrypt(data.role, ENCRYPTION_KEY).toString();
          Cookies.set('random', encryp, {
            path: '/',
            sameSite: 'strict',
            expires: 2/24
          });
          window.location.reload();
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error;
          if (errorMessage === 'Usuario no encontrado') {
            setSnackbar({
                open: true,
                message: 'Usuario no encontrado. Verifica tus credenciales.',
                severity: 'info',
            });
          } else if (errorMessage === 'Credenciales incorrectas E' || errorMessage === 'Credenciales incorrectas D') {
            setSnackbar({
                open: true,
                message: 'Contraseña incorrecta.',
                severity: 'warning',
            });
          }else {
            setSnackbar({
                open: true,
                message: 'Hubo un problema con el servidor. Intenta nuevamente más tarde.',
                severity: 'error',
            });
          }
        }
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
      }
    };
  
    const validationSchema = Yup.object({
      nombreCuenta: Yup.string().required('El nombre de la cuenta es obligatorio'),
      contrasena: Yup.string().required('La contraseña es obligatoria'),
    });

  
    return (
      <Container
        sx={{
          margin: '0',
          display: "flex",
          minHeight: "100vh",
          minWidth: '100VW',
          alignItems: "center",
          justifyContent: "center",
          background: '#114093;'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            width: "calc(50vw + 10rem)",
            maxWidth: "100vw",
            borderRadius: "12px",
            overflow: "hidden",
            minHeight: "60vh",
            flexWrap: 'wrap'
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundImage: `url(${myImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#fff",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems:'center',
              border: 'solid white 1rem',
              borderRadius: '1.5rem',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold"}}>
              WEB TIS
            </Typography>
          </Box>
  
          {/* Sección del Formulario */}
          <Box sx={{ flex: 1, padding: "2.8rem", paddingTop:{xs:'0',sm: '1rem' ,md:'2.8rem'} }}>
            <Typography variant="h4" gutterBottom sx={{ marginTop:{xs:'0',sm: '1rem', md:'2rem'}, marginBottom:{xs:'0', sm: '1rem',md:'2.rem'}, fontWeight: 'bold' }}>
              BIENVENIDO
            </Typography>
            <Divider sx={{ marginBottom: "20px" }} />
  
            <Formik
              initialValues={{ nombreCuenta: "", contrasena: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => login(values.nombreCuenta, values.contrasena)}
            >
              {({ touched, errors, handleChange, handleBlur, values }) => (
                <Form>
                  <Typography sx={{ fontWeight: 'medium' }}>Nombre de la cuenta</Typography>
                  <Field
                    name="nombreCuenta"
                    placeholder="Nombre de la cuenta"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nombreCuenta}
                    error={touched.nombreCuenta && Boolean(errors.nombreCuenta)}
                    helperText={touched.nombreCuenta && errors.nombreCuenta ? errors.nombreCuenta : " "} // Espacio en blanco para evitar cambios de tamaño
                  />
  
                  <Typography sx={{ fontWeight: 'medium' }}>Contraseña</Typography>
                  <Field
                    name="contrasena"
                    placeholder="Contraseña"
                    type="password"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.contrasena}
                    error={touched.contrasena && Boolean(errors.contrasena)}
                    helperText={touched.contrasena && errors.contrasena ? errors.contrasena : " "} // Espacio en blanco para evitar cambios de tamaño
                  />
  
                  <Link 
                    to={`/RecuperarContraseña`}
                  >
                    olvidaste tu contraseña?
                  </Link>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{marginTop:'1rem'}}>
                    Iniciar Sesion
                  </Button>
                </Form>
              )}
            </Formik>
            <Typography variant="body2" align="center" sx={{ marginTop: "20px" }}>
              No tienes cuenta? <Button onClick={()=>navigate(`/crearCuentaEstudiante`)} style={{ color: "blue", cursor: "pointer", fontWeight:'600'}}>Crear Cuenta</Button>
            </Typography>
          </Box>
        </Paper>
        <InfoSnackbar
          openSnackbar={snackbar.open}
          setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Container>
    );
  }
  
  export default IniciarSesion;
  