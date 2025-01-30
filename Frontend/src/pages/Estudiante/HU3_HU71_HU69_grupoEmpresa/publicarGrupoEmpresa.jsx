const apiHost = import.meta.env.VITE_HOST;
import { Fragment, useState, useEffect } from "react";
import BaseUI from "../../../components/baseUI/baseUI";
import { styled } from "@mui/material"; 
import { Grid2 } from "@mui/material";
import Box from '@mui/material/Box';;
import { Button } from '@mui/material';
import InfoSnackbar from '../../../components/infoSnackbar/infoSnackbar'
import { useNavigate } from "react-router-dom";
const PublicarGrupoEmpresa = () => {
    let idEstudiante = localStorage.getItem("idEstudiante")
    const [empresa, setEmpresa] = useState([]);
    const [integrantes, setIntegrantes] = useState([]);
    const [idRepresentanteLegal, setIdRepresentanteLegal] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [error, setError] = useState(false)
    const [isLoading,setLoading]= useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
      });
    const navigate = useNavigate();
    const irInicio = () => {
        navigate('/');  
    };
    useEffect(() => {
        const fetchInformacion = async () => {
            try {
                const response = await fetch(`${apiHost}/estudiante/getDatosEstEmpresa/${idEstudiante}`,{credentials: 'include'});
                if (!response.ok) {
                    if (response.status === 404) {
                        setSnackbar({
                            open: true,
                            message: `El estudiante no tiene empresa y no tiene registrada ninguna`,
                            severity: "info",
                            autoHide: 6000,
                        });
                      setMensajeError("El estudiante no tiene empresa y no tiene registrada ninguna");
                    } else {
                        setSnackbar({
                            open: true,
                            message: `Error al recuperar datos`,
                            severity: "error",
                            autoHide: 6000,
                        });
                      setMensajeError('Error al recuperar datos');
                      setError(true);
                    }
                    throw new Error('Error al recuperar datos');
                  }
    
                const data = await response.json();
    
                const { idEmpresa, nombreEmpresa, nombreLargo, integrantes, publicada } = data;
                setEmpresa({ idEmpresa, nombreEmpresa, nombreLargo, publicada });
                setIntegrantes(integrantes);
                setIdRepresentanteLegal(integrantes[0]?.idEstudiante);
                
                if (publicada === 1) {
                    setSnackbar({
                        open: true,
                        message: `La empresa "${nombreEmpresa}" ya ha sido publicada.`,
                        severity: "info",
                        autoHide: 6000,
                    });    
                    // setTimeout(() => {
                    //     irInicio();
                    // }, 2000); 
                    return;
                    
                }
    
    
            } catch (error) {
                console.error(error);
                setError(true);
                setMensajeError("Error al cargar los datos.");
                setSnackbar({
                    open: true,
                    message: `Error al cargar los datos`,
                    severity: "error",
                    autoHide: 6000,
                });
            }finally{
                setLoading(false);
            }
        };


        if (idEstudiante) { 
            fetchInformacion();
        }
    }, [idEstudiante]);

    const publicarIntegrantes = async () => {
        console.log("hola");
        if (integrantes.length < 2){
            
            setSnackbar({
                open: true,
                message: `Tiene que tener minimo 3 integrantes`,
                severity: "warning",
                autoHide: 6000,
            });
            return
        }
        try {
            const response = await fetch(`${apiHost}/crearGrupoEmpresa/paso3/${idEstudiante}`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                
                return; 
            }else{
                setSnackbar({
                    open: true,
                    message: `Se creo correctamente`,
                    severity: "success",
                    autoHide: 6000,
                });
                setTimeout(() => {
                    irInicio();
                }, 2000); 
            }
    
        } catch (error) {
            console.error(error);
            setMensajeError("Error al publicar la empresa.");
            setSnackbar({
                open: true,
                message: `Error al publicar la empresa.`,
                severity: "error",
                autoHide: 6000,
            });
        }
    };
    
    


    return (
        <Fragment>
            <BaseUI
                titulo={`PUBLICAR GRUPO EMPRESA`}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/homeEstu`}
                loading={isLoading}
                error={error}
            >
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
                            </Box>
                        ))}
                    </Grid2>
                    {empresa.publicada !== 1 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button  
                                variant="contained"
                                color="primary"
                                onClick={publicarIntegrantes}
                                sx={{ minWidth: 50, width: '240px', height: '30px', marginTop: '50px' }}
                            >
                                Publicar Grupo Empresa
                            </Button>
                        </div>
                    )}
                    <InfoSnackbar
                        openSnackbar={snackbar.open}
                        setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                        message={snackbar.message}
                        severity={snackbar.severity}
                    />
                </div>
                
                <Box sx={{width:'100%',justifyContent:'center', justifyItems:'center'}}>
                    {mensajeError && <Mensaje sx={{textAlign:'center'}}>{mensajeError}</Mensaje>}
                </Box>
            </BaseUI>
        </Fragment>
    );
};

export default PublicarGrupoEmpresa;

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
