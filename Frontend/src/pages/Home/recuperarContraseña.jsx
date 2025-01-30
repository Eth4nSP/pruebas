const apiHost = import.meta.env.VITE_HOST;

import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import InfoSnackbar from "../../components/infoSnackbar/infoSnackbar";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { useNavigate } from "react-router-dom";
import { encrypt, decrypt } from '../../api/decrypt'

function RecuperarContrasena() {
    const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [cuenta, setCuenta] = useState(null) 
  const sendRecoveryCode = async (email) => {
    const randomWord1 = Math.random().toString(36).substring(2, 8);
    const randomWord2 = Math.random().toString(36).substring(2, 8);
    const code = `${randomWord1}${randomWord2}`;
    const encryptedCode = encrypt(code);
    const url = `${apiHost}/recuperarContrasena`;
    const bodyFetch = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        codigo: encryptedCode
      }),
      credentials: "include",
    };

    try {
      const res = await fetch(url, bodyFetch);
      const response = await res.json()
      console.log(response)
      if(res.ok){
        setSnackbar({
          open: true,
          message: `El código de recuperación fue enviado a ${email}`,
          severity: "success",
        });
        setStep(2);
        setGeneratedCode(code);
        setCuenta({
          id: response.id,
          role: response.role
        });
      }else{
        setSnackbar({
          open: true,
          message: `El correo ${email} no esta asociado a ninguna cuenta`,
          severity: "info",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Hubo un error: ${error}`,
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  const verifyCode = (inputCode) => {
    const decriptado = decrypt(inputCode)
    if (decriptado === generatedCode) {
      setSnackbar({
        open: true,
        message: "Código verificado con éxito",
        severity: "success",
      });
      setStep(3);
    } else {
      setSnackbar({
        open: true,
        message: "El código es incorrecto",
        severity: "error",
      });
    }
  };

  const changePassword = async(newPassword) => {
    console.log("Nueva contraseña:", newPassword);
    const url = `${apiHost}/cambiarContrasena`;
    const bodyFetch = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contrasena : newPassword, 
        repetirContrasena : newPassword,
        id : Number(cuenta.id),
        role : cuenta.role
      }),
      credentials: "include",
    };

    try {
      const res = await fetch(url, bodyFetch);
      const response = res.json()
      console.log(response)
      if(res.ok){
        setSnackbar({
          open: true,
          message: `Se cambio la contraseña`,
          severity: "success",
        });
        setTimeout(() => {
            navigate('/');
        }, 1000); // 2000 ms = 2 segundos
      }else{
        setSnackbar({
          open: true,
          message: `no se pudo cambiar la contraseña`,
          severity: "info",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Hubo un error: ${error.mensaje}`,
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  return (
    <Container
      sx={{
        margin: "0",
        display: "flex",
        minHeight: "100vh",
        minWidth:'100vw',
        alignItems: "center",
        justifyContent: "center",
        background: "#114093",
      }}
    >    
        <div
            style={{
                display: 'flex',
                alignContent: "center",
            }}
        >
            <IconButton color="white" 
                onClick={() =>{ 
                    if(step===1){
                        navigate("/")
                    }else if(step===2){
                        setStep(1)
                    }else if(step===3){
                        setStep(2)
                    }
                }}
            >
                <ArrowCircleLeftIcon sx={{ color: "white" }} fontSize="large" />
            </IconButton>
        </div>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "30rem",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >    
        {step === 1 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Recuperar Contraseña
            </Typography>
            <Divider sx={{ marginBottom: "20px" }} />
            <Formik
              initialValues={{ email: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Correo inválido")
                  .required("El correo es obligatorio"),
              })}
              onSubmit={(values) => sendRecoveryCode(values.email)}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Typography>Correo electrónico</Typography>
                  <Field
                    name="email"
                    placeholder="Correo electrónico"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email ? errors.email : " "}
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Enviar Código
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Verificar Código
            </Typography>
            <Divider sx={{ marginBottom: "20px" }} />
            <Formik
              initialValues={{ code: "" }}
              validationSchema={Yup.object({
                code: Yup.string().required("El código es obligatorio"),
              })}
              onSubmit={(values) => verifyCode(values.code)}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Typography>Introduce el código</Typography>
                  <Field
                    name="code"
                    placeholder="Código"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.code}
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code ? errors.code : " "}
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Verificar Código
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Cambiar Contraseña
            </Typography>
            <Divider sx={{ marginBottom: "20px" }} />
            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .required("La nueva contraseña es obligatoria")
                  .min(6, "La contraseña debe tener al menos 6 caracteres"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
                  .required("La confirmación es obligatoria"),
              })}
              onSubmit={(values) => changePassword(values.password)}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Typography>Nueva Contraseña</Typography>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Nueva Contraseña"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password ? errors.password : " "}
                  />
                  <Typography>Confirmar Contraseña</Typography>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    variant="outlined"
                    fullWidth
                    as={TextField}
                    sx={{ marginBottom: "20px" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : " "
                    }
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Cambiar Contraseña
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}

        <InfoSnackbar
          openSnackbar={snackbar.open}
          setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Paper>
    </Container>
  );
}

export default RecuperarContrasena;
