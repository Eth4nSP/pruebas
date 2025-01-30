const apiHost = import.meta.env.VITE_HOST;
import InfoSnackbar from '../../infoSnackbar/infoSnackbar'
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  obtenerDatosDocente,
  obtenerDatosEstudiante,
  updateDatosGenerico
} from "../../../api/obtenerDatosParaModal";
// eslint-disable-next-line react/prop-types
const UserProfileModal = ({ openPerfil, cerrarPerfil, role }) => {
  const nombreCompleto = localStorage.getItem("nombreCompleto");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [editableFields, setEditableFields] = useState({
    nombreCuenta: false,
    contrasena: false,
    repetirContrasena: false,
    correo: false,
    nombre: false,
    apellido: false,
    segundoApellido: false,
    verificarSiEsElUsuario: false,
  });
  const [editar, setEditar] = useState(false)
  const [initialValues, setInitialValues] = useState({
    nombreCuenta: "",
    contrasena: "",
    repetirContrasena: "",
    correo: "",
    nombre: "",
    apellido: "",
    segundoApellido: "",
  });

  const toggleFieldEdit = (field, setFieldValue) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    if (editableFields[field]) {
      setFieldValue(field, initialValues[field]);
    }
    if (field === "repetirContrasena" || field === "segundoApellido") {
      const linkedField = field === "repetirContrasena" ? "contrasena" : "apellido";
      setEditableFields((prev) => ({
        ...prev,
        [linkedField]: !prev[linkedField],
      }));
  
      if (!editableFields[field]) {
        setFieldValue(linkedField, initialValues[linkedField]);
      }
    }
  };
  
  const getDatosEstu = async () => {
    try {
      const datos = await obtenerDatosEstudiante();
      setInitialValues({
        ...datos,
        verificarSiEsElUsuario: "",
        contrasena: "Ejemplo1",
        repetirContrasena: "Ejemplo1",
      });
    } catch (error) {
      console.error("Error al obtener datos del estudiante:", error);
    }
  };

  const getDatosDoc = async () => {
    try {
      const datos = await obtenerDatosDocente();
      setInitialValues({
        ...datos,
        verificarSiEsElUsuario: "",
        contrasena: "Ejemplo1",
        repetirContrasena: "Ejemplo1",
      });
    } catch (error) {
      console.error("Error al obtener datos del docente:", error);
    }
  };

  useEffect(() => {
    if (openPerfil) {
      if (role === "docente") {
        getDatosDoc();
      } else {
        getDatosEstu();
      }
    }
  }, [openPerfil, role]);

  const validationSchema = Yup.object({
    nombre: Yup.string().trim().required("El nombre es obligatorio"),
    apellido: Yup.string().trim().required("El apellido paterno es obligatorio"),
    segundoApellido: Yup.string().trim().required("El apellido materno es obligatorio"),
    correo: Yup.string()
      .email("El correo no tiene un formato válido")
      .required("El correo es obligatorio"),
    nombreCuenta: Yup.string().trim().required("El nombre de la cuenta es obligatorio"),
    contrasena: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
      .matches(/[0-9]/, "La contraseña debe tener al menos un número")
      .required("la contraseña es obligatorio"),
    repetirContrasena: Yup.string()
      .oneOf([Yup.ref("contrasena"), null], "Las contraseñas no coinciden")
      .required("la contraseña es obligatorio"),
    verificarSiEsElUsuario: Yup.string().required("Debe confirmar su contraseña actual"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      contrasena: values.verificarSiEsElUsuario,
      nombre: values.nombre,
      primerApellido: values.apellido,
      segundoApellido: values.segundoApellido,
      email: values.correo,
      nuevaContrasena: values.contrasena,
    };
  
    console.log(payload);
  
    const url =
      role === "docente"
        ? `${apiHost}/modificarDatosDocente`
        : `${apiHost}/modificarDatosEstudiante`;
  
    try {
      const response = await updateDatosGenerico(url, payload);
  
      if (response?.mensaje === "success") {
        alert(response.message);
        setEditableFields({
          nombreCuenta: false,
          contrasena: false,
          repetirContrasena: false,
          correo: false,
          nombre: false,
          apellido: false,
          segundoApellido: false,
          verificarSiEsElUsuario: true,
        });
        setEditar(false);
        setSnackbar({
          open: true,
          message: "Se actualizó el perfil correctamente",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "La contraseña de verificación es incorrecta",
          severity: "info",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al actualizar los datos de la cuenta",
        severity: "error",
      });
    }
  };
  
  
  return (
    <Modal
      open={openPerfil}
      onClose={() => {
        cerrarPerfil(false);
        setEditableFields({
          nombreCuenta: false,
          contrasena: false,
          repetirContrasena: false,
          correo: false,
          nombre: false,
          apellido: false,
          segundoApellido: false,
          verificarSiEsElUsuario: false,
        });
        setEditar(true)
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "99vh",
          width: "calc(5vw + 20rem)",
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: "16px",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#114093",
            color: "white",
            textAlign: "center",
            padding: "10px",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <AccountCircleIcon fontSize="large" />
          <Typography variant="h6">
            {nombreCompleto}
          </Typography>
          <Typography variant="body2">{role.toString().toUpperCase()}</Typography>
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, resetForm, setFieldValue }) => (
            <Form>
              <Box display={"flex"} alignContent={"center"} justifyContent={"center"}>
                <Box sx={{ margin: "2rem", marginBottom: "0rem", marginTop: "0.5rem" }}>
                  <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>Datos cuenta:</Typography>
                  {[
                    { name: "nombreCuenta", label: "Nombre Cuenta" },
                    { name: "correo", label: "Correo" },
                    { name: "nombre", label: "Nombre" },
                  ].map((field) => (
                    <Box display="flex" alignItems="center" key={field.name} sx={{ marginBottom: "0.5rem" }}>
                      <TextField
                        name={field.name}
                        disabled={!editableFields[field.name]}
                        value={values[field.name]}
                        onChange={handleChange}
                        error={touched[field.name] && Boolean(errors[field.name])}
                        helperText={touched[field.name] && errors[field.name]}
                        label={field.label}
                        fullWidth
                      />
                      {editar && (
                        <IconButton onClick={() => toggleFieldEdit(field.name, setFieldValue)} sx={{ marginLeft: "8px" }}>
                          <EditNoteRoundedIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Box display={"flex"}>
                    <TextField
                      name={"apellido"}
                      disabled={!editableFields["apellido"]}
                      value={values["apellido"]}
                      onChange={handleChange}
                      error={touched["apellido"] && Boolean(errors["apellido"])}
                      helperText={touched["apellido"] && errors["apellido"]}
                      label={"Apellido"}
                      fullWidth
                    />
                    <TextField
                      name={"segundoApellido"}
                      disabled={!editableFields["segundoApellido"]}
                      value={values["segundoApellido"]}
                      onChange={handleChange}
                      error={touched["segundoApellido"] && Boolean(errors["segundoApellido"])}
                      helperText={touched["segundoApellido"] && errors["segundoApellido"]}
                      label={"Segundo Apellido"}
                      fullWidth
                    />
                    {editar && (
                      <IconButton onClick={() => toggleFieldEdit("segundoApellido", setFieldValue)} sx={{ marginLeft: "0.5rem" }}>
                        <EditNoteRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Box display={"flex"} sx={{ marginTop: "0.5rem" }}>
                    <TextField
                      name="contrasena"
                      disabled={!editableFields.contrasena}
                      value={values.contrasena}
                      onChange={handleChange}
                      error={touched.contrasena && Boolean(errors.contrasena)}
                      helperText={touched.contrasena && errors.contrasena}
                      label="Nueva Contraseña"
                      fullWidth
                      type="password"
                    />
                    <TextField
                      name="repetirContrasena"
                      disabled={!editableFields.repetirContrasena}
                      value={values.repetirContrasena}
                      onChange={handleChange}
                      error={touched.repetirContrasena && Boolean(errors.repetirContrasena)}
                      helperText={touched.repetirContrasena && errors.repetirContrasena}
                      label="Repetir Contraseña"
                      fullWidth
                      type="password"
                    />
                    {editar && (
                      <IconButton onClick={() => toggleFieldEdit("repetirContrasena", setFieldValue)} sx={{ marginLeft: "0.5rem" }}>
                        <EditNoteRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box marginLeft={'2rem'} marginRight={'2rem'}>                
                {editar && 
                    <>
                      <Typography variant="h6">Verificación:</Typography>
                      <Box display="flex" sx={{ marginBottom: "1rem" }}>
                        <TextField
                          name="verificarSiEsElUsuario"
                          value={values.verificarSiEsElUsuario}
                          onChange={handleChange}
                          error={touched.verificarSiEsElUsuario && Boolean(errors.verificarSiEsElUsuario)}
                          helperText={touched.verificarSiEsElUsuario && errors.verificarSiEsElUsuario}
                          fullWidth
                          type="password"
                        />
                      </Box>
                    </>
                  }
              </Box>
              <Box margin={"2rem"} marginTop={"0.5rem"} marginBottom={"1rem"}>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  {!editar ? (
                    <IconButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#114093",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#003289",
                        },
                      }}
                      onClick={() => setEditar(true)}
                    >
                      <EditNoteRoundedIcon />
                    </IconButton>
                  ) : (
                    <Box display={"flex"} sx={{ width: "100%" }}>
                      <Button
                        variant="outlined"
                        sx={{ flexGrow: "1" }}
                        onClick={() => {
                          setEditar(false);
                          resetForm();
                          setEditableFields({
                            nombreCuenta: false,
                            contrasena: false,
                            repetirContrasena: false,
                            correo: false,
                            nombre: false,
                            apellido: false,
                            segundoApellido: false,
                            verificarSiEsElUsuario: false,
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" variant="contained" sx={{ flexGrow: "1", marginLeft: "0.2rem" }}>
                        Confirmar
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Form>
          )}

        </Formik>
          <InfoSnackbar
            openSnackbar={snackbar.open}
            setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
            message={snackbar.message}
            severity={snackbar.severity}
          />
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
