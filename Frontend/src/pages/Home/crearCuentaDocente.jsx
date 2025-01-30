// eslint-disable-next-line no-unused-vars
const apiHost = import.meta.env.VITE_HOST;
import React from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Container,
  Divider,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nombre: Yup.string().trim().required("El nombre es obligatorio"),
  apellidoPaterno: Yup.string()
    .trim()
    .required("El apellido paterno es obligatorio"),
  apellidoMaterno: Yup.string()
    .trim()
    .required("El apellido materno es obligatorio"),
  correo: Yup.string()
    .email("El correo no tiene un formato válido")
    .required("El correo es obligatorio"),
  nombreCuenta: Yup.string()
    .trim()
    .required("El nombre de la cuenta es obligatorio"),
  contrasena: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .matches(/[0-9]/, "La contraseña debe tener al menos un número")
    .required("La contraseña es obligatoria"),
  repetirContrasena: Yup.string()
    .oneOf([Yup.ref("contrasena"), null], "Las contraseñas no coinciden")
    .required("Debe confirmar su contraseña"),
});

const CrearCuentaDocente = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`${apiHost}/crearCuentaDocente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Docente registrado exitosamente");
        resetForm();
      } else {
        alert(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      alert("Ocurrió un error inesperado al registrar el docente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#114093",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: 6,
            borderRadius: 3,
            boxShadow: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "1.5rem",
            }}
          >
            REGISTRO DOCENTE
          </Typography>
          <Divider sx={{ marginBottom: "20px" }} />
          <Formik
            initialValues={{
              nombre: "",
              apellidoPaterno: "",
              apellidoMaterno: "",
              correo: "",
              nombreCuenta: "",
              contrasena: "",
              repetirContrasena: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, handleChange, handleBlur, values }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Nombres
                    </Typography>
                    <Field
                      name="nombre"
                      placeholder="Nombres"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nombre}
                      error={touched.nombre && Boolean(errors.nombre)}
                      helperText={touched.nombre && errors.nombre}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Apellido Paterno
                    </Typography>
                    <Field
                      name="apellidoPaterno"
                      placeholder="Apellido Paterno"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.apellidoPaterno}
                      error={
                        touched.apellidoPaterno &&
                        Boolean(errors.apellidoPaterno)
                      }
                      helperText={touched.apellidoPaterno && errors.apellidoPaterno}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Apellido Materno
                    </Typography>
                    <Field
                      name="apellidoMaterno"
                      placeholder="Apellido Materno"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.apellidoMaterno}
                      error={
                        touched.apellidoMaterno &&
                        Boolean(errors.apellidoMaterno)
                      }
                      helperText={touched.apellidoMaterno && errors.apellidoMaterno}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Correo Electrónico
                    </Typography>
                    <Field
                      name="correo"
                      placeholder="Correo Electrónico"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.correo}
                      error={touched.correo && Boolean(errors.correo)}
                      helperText={touched.correo && errors.correo}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Nombre de la Cuenta
                    </Typography>
                    <Field
                      name="nombreCuenta"
                      placeholder="Nombre de la Cuenta"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nombreCuenta}
                      error={
                        touched.nombreCuenta && Boolean(errors.nombreCuenta)
                      }
                      helperText={touched.nombreCuenta && errors.nombreCuenta}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Contraseña
                    </Typography>
                    <Field
                      name="contrasena"
                      placeholder="Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contrasena}
                      error={touched.contrasena && Boolean(errors.contrasena)}
                      helperText={touched.contrasena && errors.contrasena}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography align="left" sx={{ fontWeight: "medium" }}>
                      Repetir Contraseña
                    </Typography>
                    <Field
                      name="repetirContrasena"
                      placeholder="Repetir Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      as={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.repetirContrasena}
                      error={
                        touched.repetirContrasena &&
                        Boolean(errors.repetirContrasena)
                      }
                      helperText={
                        touched.repetirContrasena && errors.repetirContrasena
                      }
                    />
                  </Grid>
                </Grid>

                <Box mt={4} textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    REGISTRARSE
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};

export default CrearCuentaDocente;
