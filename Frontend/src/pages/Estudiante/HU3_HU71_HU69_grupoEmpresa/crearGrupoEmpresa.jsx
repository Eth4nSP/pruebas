const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useState, useEffect } from "react";
import BaseUI from "../../../components/baseUI/baseUI";
import { styled } from "@mui/material";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";

const CrearGrupoEmpresa = () => {
  let idEstudiante = localStorage.getItem("idEstudiante")
  const [nombreLargo, setNombreLargo] = useState("");
  const [nombreCorto, setNombreCorto] = useState("");
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [estudiante, setEstudiante] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState({
    error:false,
    errorMessage: "",
    errorDetails: "",
  });
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchEstudiante = async (idEstudiante) => {
      try {
        const response = await fetch(
          `${apiHost}/estudiante/getDatosEst/${idEstudiante}`,{credentials: 'include'}
        );
        if (!response.ok) throw new Error("Error al recuperar estudiante");
        const data = await response.json();
        setEstudiante(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        console.log(error); 
        setError({
          error:true,
          errorMessage: "Ha ocurrido un error",
          errorDetails: error,
        });
        setMensajeError("Error al cargar el estudiante.");
      }
    };
    if (idEstudiante) {
      fetchEstudiante(idEstudiante);
    }
  }, [idEstudiante]);

  const manejarSubmit = async () => {
    setIntentoEnviar(true);
    if (nombreLargo && nombreCorto && estudiante.idEstudiante) {
      try {
        const response = await fetch(
          `${apiHost}/crearGrupoEmpresa/paso1`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombreLargo,
              nombreCorto,
              estudiante: estudiante.idEstudiante,
            }),
            credentials: "include",
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Ya existe una empresa con ese nombre largo.") {
            setSnackbar({
              open: true,
              message: "El nombre largo de la empresa ya está en uso. Elige otro nombre.",
              severity: "error",
            });
          } else if (errorData.message === "Ya existe una empresa con ese nombre corto.") {
            setSnackbar({
              open: true,
              message: "El nombre corto de la empresa ya está en uso. Elige otro nombre.",
              severity: "error",
            });
          } else if (
            errorData.message === "El estudiante ya está asociado a otra empresa"
          ) {
            setSnackbar({
              open: true,
              message: "El estudiante ya pertenece a otra empresa.",
              severity: "error",
            });
          } else {
            setSnackbar({
              open: true,
              message: "Error al crear el grupo",
              severity: "error",
            });
          }
          return;
        }
  
        const result = await response.json();
        console.log("Grupo creado con éxito:", result);
  
        setSnackbar({
          open: true,
          message: "¡Grupo creado con éxito!",
          severity: "success",
        });
  
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Error al crear el grupo",
          severity: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Por favor, completa todos los campos",
        severity: "error",
      });
    }
  };
  

  return (
    <Fragment>
      <BaseUI
        titulo={`REGISTRAR GRUPO EMPRESA`}
        ocultarAtras={false}
        confirmarAtras={false}
        dirBack={`/homeEstu`}
        loading={isLoading}
        error={error}
      >
        {isLoading !== true ? (
          <div>
            {estudiante.enEmpresa !== 1 && (
              <div style={{ display: "grid" }}>
                <NombreEmpresaCompleto>
                  <Box component="section" sx={{ p: 2 }}>
                    <h3>NOMBRE LARGO:</h3>
                  </Box>
                  <StyledWrapper>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        placeholder="Nombre Largo"
                        className="input"
                        value={nombreLargo}
                        onChange={(e) => setNombreLargo(e.target.value)}
                      />
                      {intentoEnviar &&
                        (nombreLargo === "" ? (
                          <Alert severity="error" sx={{ ml: 1, pt: 0, pb: 0 }}>
                            No hay nombre Largo
                          </Alert>
                        ) : (
                          (nombreLargo.length < 5 ||
                            nombreLargo.length > 100) && (
                            <Alert
                              severity="warning"
                              sx={{ ml: 1, pt: 0, pb: 0 }}
                            >
                              Debe tener entre 5 y 100 caracteres.
                            </Alert>
                          )
                        ))}
                    </div>
                  </StyledWrapper>
                </NombreEmpresaCompleto>
                <NombreEmpresaCompleto>
                  <Box component="section" sx={{ p: 2 }}>
                    <h3>NOMBRE CORTO:</h3>
                  </Box>
                  <StyledWrapper>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        placeholder="Nombre Corto"
                        className="input"
                        value={nombreCorto}
                        onChange={(e) => setNombreCorto(e.target.value)}
                      />
                      {intentoEnviar &&
                        (nombreCorto === "" ? (
                          <Alert severity="error" sx={{ ml: 1, pt: 0, pb: 0 }}>
                            No hay nombre Corto
                          </Alert>
                        ) : (
                          (nombreCorto.length < 2 ||
                            nombreCorto.length > 20) && (
                            <Alert
                              severity="warning"
                              sx={{ ml: 1, pt: 0, pb: 0 }}
                            >
                              Debe tener entre 2 y 20 caracteres.
                            </Alert>
                          )
                        ))}
                    </div>
                  </StyledWrapper>
                </NombreEmpresaCompleto>

                <Box pt={10}>
                  <h2 style={{ marginBottom: 20 }}>Integrantes</h2>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: 70,
                    borderRadius: 1,
                    bgcolor: "#cfd4e1",
                    "&:hover": {
                      bgcolor: "#BFC4D1",
                    },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {estudiante && (
                      <h3 style={{ paddingLeft: "35px" }}>
                        {estudiante.nombreEstudiante}{" "}
                        {estudiante.primerApellido} {estudiante.segundoApellido}
                      </h3>
                    )}
                  </div>
                </Box>

                {mensajeError && <Mensaje>{mensajeError}</Mensaje>}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    justifyContent="flex-end"
                    variant="contained"
                    color="primary"
                    onClick={manejarSubmit}
                    sx={{
                      minWidth: 50,
                      width: "100px",
                      height: "30px",
                      marginTop: "20px",
                    }}
                  >
                    CREAR
                  </Button>
                </div>
                <InfoSnackbar
                        openSnackbar={snackbar.open}
                        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                        message={snackbar.message}
                        severity={snackbar.severity}
                    />
              </div>
            )}
          </div>
        ) : error.errorMessage || error.errorDetails ? (
          <Error
            errorMessage={error.errorMessage}
            errorDetails={error.errorDetails}
          />
        ) : (
          <Loading />
        )}
        {estudiante.enEmpresa === 1 && (
          <div
            style={{
              color: "red",
              fontWeight: "bold",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            Ya se encuentra en una empresa
          </div>
        )}
      </BaseUI>
    </Fragment>
  );
};

export default CrearGrupoEmpresa;

const NombreEmpresaCompleto = styled("div")`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  margin-top: 0.5vw;
  margin-bottom: 0.5vw;
`;

const Mensaje = styled("div")`
  color: red;
  margin-top: 0.5vw;
  font-size: 14px;
  max-width: 300px;
`;

const StyledWrapper = styled("div")`
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
    border: 2px solid #4a9dec;
    background-color: white;
  }
`;
