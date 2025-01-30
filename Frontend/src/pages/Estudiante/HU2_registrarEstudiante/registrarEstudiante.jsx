import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Container,
  styled
} from "@mui/material";

let FooterContainer = styled("footer")`
    display: flex;
    color: white;
    background-color: #114093;
    margin-top: 0rem;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, 
              rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, 
              rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
 
    .footer{
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        margin-left: calc(0.6vw + 1rem);
        margin-right: 2rem;
        margin-bottom: 0;
        
    }
    .footer_links{
        margin: 0;
        padding: 0;
    }
    .footer_name{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .links{
        margin: 0;
    }
    p{
        width: 98vw;
        padding-bottom:0.5rem;
        text-align: center;
        font-size: calc(0.4vw + 0.3rem);
        display: block;
    }
`

const CrearCuentaEstudiante = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    nombreCuenta: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellidoPaterno.trim())
      tempErrors.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!formData.apellidoMaterno.trim())
      tempErrors.apellidoMaterno = "El apellido materno es obligatorio";
    if (!formData.correo.trim()) tempErrors.correo = "El correo es obligatorio";
    if (!formData.nombreCuenta.trim()) tempErrors.nombreCuenta = "El nombre de la Cuenta es obligatorio";
    
    if (!formData.contraseña.trim())
      tempErrors.contraseña = "La contraseña es obligatoria";
    if (!formData.confirmarContraseña.trim())
      tempErrors.confirmarContraseña = "Debe confirmar su contraseña";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo))
      tempErrors.correo = "El correo no tiene un formato válido";

    if (formData.contraseña && formData.contraseña.length < 8)
      tempErrors.contraseña = "La contraseña debe tener al menos 8 caracteres";
    if (formData.contraseña && !/[A-Z]/.test(formData.contraseña))
      tempErrors.contraseña =
        "La contraseña debe tener al menos una letra mayúscula";
    if (formData.contraseña && !/[0-9]/.test(formData.contraseña))
      tempErrors.contraseña =
        "La contraseña debe tener al menos un número";

    if (formData.contraseña !== formData.confirmarContraseña)
      tempErrors.confirmarContraseña = "Las contraseñas no coinciden";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Formulario enviado con éxito");
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            WEB TIS
          </Typography>
          <div>
            <Button color="inherit">Iniciar Sesión</Button>
            <Button color="inherit" variant="outlined">
              Crear Cuenta
            </Button>
          </div>
        </Toolbar>
      </AppBar>


      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh", 
          backgroundColor: "#f5f5f5",
          padding: 3,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
              gutterBottom
            >
              REGISTRO ESTUDIANTE
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Primer Nombre"
                    variant="outlined"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno"
                    variant="outlined"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    error={!!errors.apellidoPaterno}
                    helperText={errors.apellidoPaterno}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Materno"
                    variant="outlined"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    error={!!errors.apellidoMaterno}
                    helperText={errors.apellidoMaterno}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    variant="outlined"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    error={!!errors.correo}
                    helperText={errors.correo}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre Cuenta"
                    variant="outlined"
                    name="nombreCuenta"
                    value={formData.nombreCuenta}
                    onChange={handleChange}
                    error={!!errors.nombreCuenta}
                    helperText={errors.nombreCuenta}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    variant="outlined"
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    error={!!errors.contraseña}
                    helperText={errors.contraseña}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Repita su contraseña"
                    variant="outlined"
                    type="password"
                    name="confirmarContraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleChange}
                    error={!!errors.confirmarContraseña}
                    helperText={errors.confirmarContraseña}
                    required
                  />
                </Grid>
              </Grid>

              <Box mt={3} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  REGISTRARSE
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <FooterContainer >
        <div>
            <footer className='footer'>
                <div className='footer_links'>
                    <h6 className='links'>Politica de Privacidad</h6>
                    <h6 className='links'>Terminos y Condiciones</h6>
                    <h6 className='links'>Politicas de Cokiees</h6>
                    <h6 className='links'>Contactar</h6>
                </div>
                <div className='footer_name'>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <h5>WEB TIS</h5>
                    </Typography>
                </div>              
            </footer>
            <p>© 2024 CREATIVE HARBOR S.R.L. All rights reserved.</p>
        </div>        
    </FooterContainer>

    </>
  );
};

export default CrearCuentaEstudiante;
