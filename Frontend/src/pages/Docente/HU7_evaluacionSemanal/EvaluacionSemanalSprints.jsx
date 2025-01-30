import { Fragment, useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import BaseUI from '../../../components/baseUI/baseUI';
import { getSeguimiento } from '../../../api/seguimientoSemanal';
import { Box, Typography } from '@mui/material';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoSnackbar from '../../../components/infoSnackbar/infoSnackbar';
// eslint-disable-next-line react/prop-types
function SeguimientoSemanalSprints () {
    const navigate = useNavigate();
    const idEmpresa = localStorage.getItem("idEmpresa")
    const [semanas, setSemanas] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
        autoHide: 6000,
    });
    useEffect(() => {
        const fetchSprintsData = async () => {
            setLoading(true)
          try {
            const data = await getSeguimiento(idEmpresa);
            setSemanas(data);
            console.log(data)
          } catch (error) {
            console.error("Error en la solicitud:", error);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
        fetchSprintsData()
    }, []); 
    const navigateSemana=(idSemana)=>{
        localStorage.setItem("idSemana", idSemana)
      navigate(`/homeDocente/listaEmpresasEvaluacionSemanal/empresaSprints/semana`)
    }

    if(semanas?.length === 0) return (
        <BaseUI
                titulo={'SELECCIONE UNA SEMANA PARA EL SEGUIMIENTO'}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/homeDocente/listaEmpresasEvaluacionSemanal`}
                loading={loading}
                error={error}
        >
            <div className='mensajeVacio'>
               <h1>NO HAY SEMANAS PARA EVALUAR</h1>
            </div>
        </BaseUI>
    )

    return (
        <Fragment>
            <BaseUI
                titulo={'SELECCIONE UNA SEMANA PARA EL SEGUIMIENTO'}
                ocultarAtras={false}
                confirmarAtras={false}
                dirBack={`/homeDocente/listaEmpresasEvaluacionSemanal`}
                loading={loading}
                error={error}
            >
                {semanas.map((semana, index) => {
                    const formatoIni2 = semana.fechaIni+" a las 00:00"
                    const formatoFin2 = semana.fechaFin+" a las 23:59"
                    return <Box 
                        key={`index${index}`}
                        onClick={()=> navigateSemana(semana.idSemana, index)}
                        sx={{
                            width: '90%',
                            minHeight:60,
                            borderRadius: 0.6,
                            margin: 0.7,
                            marginLeft: 'calc(2vw + 0.5rem)',
                            pl: 2,
                            bgcolor: semana.calificado? '#32cd32':'#d0d4e4', 
                            textTransform: 'uppercase',
                            display: 'flex', 
                            cursor: 'pointer',
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            '&:hover': {
                                bgcolor: semana.calificado? '#68ba44':'#c0c5db', 
                                cursor:'pointer'
                            },
                        }}            
                    >
                        <Box display="flex" alignItems="center">    
                            <Typography sx={{ fontWeight: 'bolder' }} variant='h6'>
                                SEMANA {semana.numSemana} 
                                <Typography sx={{ color: semana.calificado? "black" : "red" }}>
                                    {semana.calificado?" (YA EVALUADO)" : " (NO EVALUADO)"}
                                </Typography>
                            </Typography>
                        </Box>
                        <Box sx={{ marginRight: '', transform:'scale(0.9)'}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon />
                                <Typography sx={{fontSize:{xs:'0.6rem', sm:'0.7rem'} }}>
                                    <span style={{fontWeight: '600', }}>INICIO DEL SPRINT:</span> {formatoIni2}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon />
                                <Typography sx={{ fontSize:{xs:'0.6rem', sm:'0.7rem'} }} variant="subtitle1">
                                <span style={{fontWeight: '600', }}>FIN DEL SPRINT:</span> {formatoFin2}
                                </Typography>
                            </div>
                        </Box>
                    </Box>
                })}
                <InfoSnackbar
                    openSnackbar={snackbar.open}
                    setOpenSnackbar={(open) => setSnackbar({ ...snackbar, open })}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    autoHide={snackbar.autoHide}
                />
            </BaseUI>
        </Fragment>
    );
}

export default SeguimientoSemanalSprints
