const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseUI from "../../../components/baseUI/baseUI";
import { styled } from "@mui/material"; 
import { Modal, TextField, Autocomplete, Grid2 } from "@mui/material";
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import CuadroDialogo from "../../../components/cuadroDialogo/cuadroDialogo";
import DecisionButtons from "../../../components/Buttons/decisionButtons";
import InfoSnackbar from "../../../components/infoSnackbar/infoSnackbar";


const ModificarGrupoEmpresa = () => {
    const [openValidateDialog, setOpenValidateDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    let idEstudiante = localStorage.getItem("idEstudiante")
    const [empresa, setEmpresa] = useState([]);
    const [integrantes, setIntegrantes] = useState([]);
    const [integrantesN, setIntegrantesN] = useState([]);
    const [idRepresentanteLegal, setIdRepresentanteLegal] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [error, setError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedIntegrante, setSelectedIntegrante] = useState(null); 
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate(); 
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
      });


    const irInicio = () => {
        navigate('/');  // Redirige a la página de inicio
    };

    useEffect(() => {
        const fetchInformacion = async () => {
            try {
                const response = await fetch(`${apiHost}/estudiante/getDatosEstEmpresa/${idEstudiante}`,{credentials: 'include'});
                if (!response.ok) {
                    if (response.status === 404) {
                      setMensajeError("El estudiante no tiene empresa y no tiene registrada ninguna");
                    } else {
                      setMensajeError('Error al recuperar datos');
                    }
                    throw new Error('Error al recuperar datos');
                  }
                const data = await response.json();
    
                const { idEmpresa, nombreEmpresa, nombreLargo, integrantes, publicada } = data;
                setEmpresa({ idEmpresa, nombreEmpresa, nombreLargo, publicada });
                setIntegrantes(integrantes);
                if (publicada === 1) {
                    
                    setMensajeError(`La empresa "${nombreEmpresa}" ya ha sido publicada.`);
                    setError(true)
                    return; 
                }
    
                setIdRepresentanteLegal(integrantes[0]?.idEstudiante);
    
            } catch (error) {
                console.error(error);
                setMensajeError("Error al cargar los datos.");
                setError(true)
            }finally{
                setLoading(false);
            }
        };

        const fetchNuevosEstudiantes = async () => {
            try {
                const response = await fetch(`${apiHost}/estudiante/getDisponibles/${idEstudiante}`,{credentials: 'include'});
                if (!response.ok) throw new Error('Error al recuperar datos');
    
                const data = await response.json();
                setIntegrantesN(data);
            } catch (error) {
                console.error(error);
                setError(true)
                setMensajeError("Error al cargar los datos.");
            }
        };

        if (!idEstudiante) return; 
        fetchInformacion();
        fetchNuevosEstudiantes();
    }, [idEstudiante]);

    const actualizarIntegrantes = async () => {
        if (integrantes.length < 3) {
            setSnackbar({
                open: true,
                message: "Debe haber al menos 3 integrantes.",
                severity: "error",
              });
            return;
        }

        try {
            const estudiantesIds = integrantes.map(integrante => integrante.idEstudiante);
            const response = await fetch(`${apiHost}/crearGrupoEmpresa/paso2/${empresa.idEmpresa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ integrantes: estudiantesIds }),
            });
            setTimeout(() => {
                irInicio();
            }, 2000); 

            if (!response.ok) {
                throw new Error('Error al actualizar los integrantes');
            }

            const result = await response.json();
            setSnackbar({
                open: true,
                message: (result.mensaje),
                severity: "success",
              });

        } catch (error) {
            console.error(error);
            setMensajeError("Error al actualizar los integrantes.");
        }
    };

    const agregarIntegrante = () => {
        if (integrantes.length < 6) {
            setOpenModal(true); 
        } else {
            setError(true)
        }
    };

    const confirmarAgregarIntegrante = () => {
        if (selectedIntegrante) {
            const existe = integrantes.some(integrante => integrante.idEstudiante === selectedIntegrante.idEstudiante);
            if (existe) {
                setMensajeError("Este integrante ya ha sido agregado.");
                setError(true)
                return;
            }

            const nuevoIntegrante = { 
                idEstudiante: selectedIntegrante.idEstudiante, 
                nombreEstudiante: `${selectedIntegrante.nombreEstudiante} ${selectedIntegrante.primerApellido} ${selectedIntegrante.segundoApellido}`,
                fijo: false 
            };

            setIntegrantes([...integrantes, nuevoIntegrante]);

            const nuevasOpciones = integrantesN.filter(option => option.idEstudiante !== selectedIntegrante.idEstudiante);
            setIntegrantesN(nuevasOpciones);

            setSelectedIntegrante(null);
            setOpenModal(false);
            setSnackbar({
                open: true,
                message: "Integrante agregado correctamente.",
                severity: "success",
              });

        } else {
            setMensajeError("Debe seleccionar un integrante.");
        }
    };

    const eliminarIntegrante = (idEstudiante) => {
        const integranteAEliminar = integrantes.find(integrante => integrante.idEstudiante === idEstudiante);
        
        if (integranteAEliminar) {
            setIntegrantes(integrantes.filter(integrante => integrante.idEstudiante !== idEstudiante));
            
            const nuevaListaIntegrantesN = [...integrantesN, integranteAEliminar];
            
            nuevaListaIntegrantesN.sort((a, b) => {
                const nombreA = `${a.nombreEstudiante} ${a.primerApellido} ${a.segundoApellido}`;
                const nombreB = `${b.nombreEstudiante} ${b.primerApellido} ${b.segundoApellido}`;
                return nombreA.localeCompare(nombreB);
            });
            
            setIntegrantesN(nuevaListaIntegrantesN);
            setSnackbar({
                open: true,
                message: `Integrante restaurado correctamente.`,
                severity: "info",
                autoHide: 6000,
            });
        }
    };

    const handleValidate = () => {
        setOpenValidateDialog(true);
      };
    
      const handleReject = () => {
        setOpenRejectDialog(true);
      };
      const rechazarModificacion = () => {
        setSnackbar({
            open: true,
            message: `La modificación ha sido rechazada. Los integrantes no fueron modificados.`,
            severity: "info",
            autoHide: 6000,
        });
        setOpenRejectDialog(false);
        setTimeout(() => {
            irInicio();
        }, 2000); 
    };


    return (
        <Fragment>
            <BaseUI
                titulo={`MODIFICAR GRUPO EMPRESA`}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/homeEstu`}
                loading={isLoading}
                error={{error: error}}
            >

                {isLoading !== true && (
                <div style={{ display: 'grid' }}>

                    <NombreEmpresaCompleto>
                        <Box component="section" sx={{ p: 2 }}>
                            <h3>NOMBRE LARGO:</h3>
                        </Box>
                        <t1 style={{justifyContent: "center",alignItems: "center"}}>{empresa.nombreLargo}</t1>
                    </NombreEmpresaCompleto>
                    <NombreEmpresaCompleto>
                        <Box component="section" sx={{ p: 2 }}>
                            <h3>NOMBRE CORTO:</h3>
                        </Box>
                        <t1 style={{justifyContent: "center",alignItems: "center"}}>{empresa.nombreEmpresa}</t1>
                    </NombreEmpresaCompleto>

                    <Box pt={5}>
                        <h2>Integrantes</h2>
                        <h6 style={{ color: '#979797', fontSize: '15px'}}>MAXIMO 6 - MINIMO 3</h6>
                    </Box>
                    <Grid2 item xs={12}>
                        {integrantes && integrantes.map((integrante) => (
                            <Box
                                key={integrante.idEstudiante}
                                sx={{
                                    width: "100%",
                                    height: 70,
                                    borderRadius: 1,
                                    bgcolor: '#cfd4e1',
                                    '&:hover': {
                                        bgcolor: '#BFC4D1',
                                    },
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <h3 style={{ paddingLeft: '35px' }}>
                                        {integrante.nombreEstudiante} {integrante.primerApellido} {integrante.segundoApellido}
                                    </h3>
                                    {integrante.idEstudiante === idRepresentanteLegal && (
                                        <span style={{ color: 'black', paddingRight: '20px' }}></span>
                                    )}
                                </div>
                                {!integrante.fijo && integrante.idEstudiante !== idRepresentanteLegal && empresa.publicada !== 1 && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => eliminarIntegrante(integrante.idEstudiante)}
                                        sx={{ mr: 2 }}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Grid2>

                    {mensajeError && <Mensaje>{mensajeError}</Mensaje>}

                    {/* Solo renderizar el botón de añadir si la empresa no está publicada */}
                    {empresa.publicada !== 1 && (
                        <Button 
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{ minWidth: 50, width: '240px', height: '30px' }}
                            onClick={agregarIntegrante}
                        >
                            Añadir Integrante
                        </Button>
                    )}

                    {/* Solo renderizar el botón de publicar si la empresa no está publicada */}
                    {empresa.publicada !== 1 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <DecisionButtons
                                rejectButtonText="Descartar Cambios"
                                validateButtonText="Guardar cambios"
                                onReject={handleReject}
                                onValidate={handleValidate}
                                disabledButton={0}
                            />
                            <CuadroDialogo
                                open={openValidateDialog}
                                onClose={() => setOpenValidateDialog(false)}
                                title="Confirmar Modificación del Grupo"
                                description="¿Está seguro de que desea modificar los integrantes de este grupo?"
                                onConfirm={actualizarIntegrantes}
                            />
                            <CuadroDialogo
                                open={openRejectDialog}
                                onClose={() => setOpenRejectDialog(false)}
                                title="Confirmar Rechazo de Modificación"
                                description="¿Está seguro de que desea rechazar la modificación de los integrantes de este grupo?"
                                onConfirm={rechazarModificacion}
                            />
                        </div>
                    )}

                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <div style={{ padding: "20px", backgroundColor: "white", margin: "auto", marginTop: "20%", width: "300px", borderRadius: "8px" }}>
                            <h2 style={{marginBottom: "8px"}}>Añadir Integrante</h2>
                            <Autocomplete
                                options={integrantesN}
                                getOptionLabel={(option) => `${option.nombreEstudiante} ${option.primerApellido} ${option.segundoApellido}`}
                                onChange={(event, newValue) => setSelectedIntegrante(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Selecciona un integrante" />
                                )}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={confirmarAgregarIntegrante}
                                >
                                    Añadir
                                </Button>
                                <Button variant="outlined" onClick={() => setOpenModal(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <InfoSnackbar
                        openSnackbar={snackbar.open}
                        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                        message={snackbar.message}
                        severity={snackbar.severity}
                    />

                </div>)}
            </BaseUI>
        </Fragment>
    );
};

export default ModificarGrupoEmpresa;

const NombreEmpresaCompleto = styled('div')`
    display: flex;
    box-sizing: border-box;
    align-items: center; 
    margin-top: 0.5vw;
    margin-bottom: 0.5vw;
`;

const Mensaje = styled('div')`
    color: red; 
    margin-top: 0.5vw;
    font-size: 14px;
    max-width: 300px;
`;
