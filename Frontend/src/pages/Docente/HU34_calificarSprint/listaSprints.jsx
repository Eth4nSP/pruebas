import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import BaseUI from '../../../components/baseUI/baseUI';
import { getSprintsEntregables } from "../../../api/getEmpresa"
import { Typography} from '@mui/material';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoSnackbar from '../../../components/infoSnackbar/infoSnackbar';
/* eslint-disable react/prop-types */

const ListaSprints = () => {
    const navigate = useNavigate();
    const [sprints, setSprints] = useState([
    ])
    const idEmpresa = localStorage.getItem("idEmpresa")
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState({
        error: false,
        errorMessage: "",
        errorDetails: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
        autoHide: 6000,
    });

    useEffect(() => {
        setLoading(true)
        const fetchSprints = async () => {
            try {
                const sprintData = await getSprintsEntregables(idEmpresa);
                console.log(sprintData.sprints)
                setSprints(sprintData.sprints);
                setLoading(false);
            } catch (error) {
                setError({
                    error: true,
                    errorMessage: "Ha ocurrido un error",
                    errorDetails: error.message,
                });
                console.error("Error al cargar la tarea:", error);
            }
        };
        fetchSprints();
    },[])
    const clickBoton = (sprint) => {
        localStorage.setItem("idSprint", sprint)
        navigate(`/homeDocente/listaEmpresaCalificarSprints/empresa/sprint`); 
    }
    if (sprints?.length === 0 || new Date(sprints[0]?.fechaFin) > new Date()) {
        return (
            <BaseUI
                titulo={'SELECCIONE UN SPRINT PARA CALIFICAR'}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/homeDocente/listaEmpresaCalificarSprints`}
                loading={loading}
                error={error}
            >
                <div className='mensajeVacio'>
                    <h1>{sprints?.length === 0
                        ? 'ESTA EMPRESA NO TIENE SPRINTS'
                        : 'EL PRIMER SPRINT DE ESTE GRUPO NO TERMINÓ TODAVÍA, NO SE PUEDE CALIFICAR'
                    }</h1>
                </div>
            </BaseUI>
        );
    }

    return (
        <BaseUI
            titulo={'SELECCIONE UN SPRINT PARA CALIFICAR'}
            ocultarAtras={false}
            confirmarAtras={false}
            dirBack={`/homeDocente/listaEmpresaCalificarSprints`}
            loading={loading}
            error={error}
        >
            <DivLista>
                {sprints.map((sprint, index) => {
                    const formatoIni = (sprint.fechaIni)+" a las 00:00"
                    const formatoFin = (sprint.fechaFin)+" a las 23:59"
                    return (new Date() > new Date(`${sprint.fechaFin}T23:59:59`) ? (
                        <Box
                            key={index}
                            onClick={() => clickBoton(sprint.idSprint)}
                            sx={{
                                width: '85%',minHeight:60,
                                borderRadius: 0.6, margin: 0.7,
                                marginLeft: 'calc(2vw + 1rem)', pl: 2,
                                fontSize: '1.5rem',
                                bgcolor: sprint.nota === null ? '#d0d4e4' : '#32cd32',
                                textTransform: 'uppercase',
                                display: 'flex',
                                cursor: 'pointer',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                '&:hover': {
                                    bgcolor: sprint.nota === null ? '#c0c4d4' : '#68ba44',
                                },
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 'bolder' }} variant='h6'>
                                    Sprint {sprint.numeroSprint}
                                    <Typography sx={{ color: sprint.nota === null ? "red" : "black" }}>
                                        {sprint.nota === null ? " (NO EVALUADO)" : " (YA EVALUADO)"}
                                    </Typography>
                                </Typography>
                            </div>
                            
                            <Box sx={{ marginRight: '', transform:'scale(0.9)'}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarTodayIcon />
                                    <Typography sx={{fontSize:{xs:'0.6rem', sm:'0.7rem'} }}>
                                        <span style={{fontWeight: '600', }}>INICIO DEL SPRINT:</span> {formatoIni}
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarTodayIcon />
                                    <Typography sx={{ fontSize:{xs:'0.6rem', sm:'0.7rem'} }} variant="subtitle1">
                                    <span style={{fontWeight: '600', }}>FIN DEL SPRINT:</span> {formatoFin}
                                    </Typography>
                                </div>
                            </Box>

                        </Box>
                    ) : <></>);
                })}
            </DivLista>
            <InfoSnackbar
                openSnackbar={snackbar.open}
                setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                message={snackbar.message}
                severity={snackbar.severity}
                autoHide={snackbar.autoHide}
            />
        </BaseUI>
    );
};

const DivLista = styled("div")`
    display: flex;
    flex-direction: column;
    margin: 0rem;
`;

export default ListaSprints;
