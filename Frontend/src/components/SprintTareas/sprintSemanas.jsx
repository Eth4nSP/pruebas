import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

/* eslint-disable react/prop-types */

const SprintSemanas = ({ title, semana, idSprint, navigateLink, semanaTexto, isOpenSprint}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const clickBoton = (tarea) => {
        localStorage.setItem("idSprint", idSprint)
        localStorage.setItem("idTarea", tarea.idTarea)
        console.log("click", tarea)
        navigate(navigateLink); 
    }

    return (
        <DivLista>
            {(semanaTexto!==true || isOpenSprint)?  
                <Box 
                    onClick={togglePanel}
                    sx={{
                        width: '90%',
                        height: 60,
                        borderRadius: 0.6,
                        margin: 0.7,
                        marginLeft: 'calc(2vw + 0.5rem)',
                        pl: 2,
                        fontSize: '1.5rem',
                        bgcolor: '#d0d4e4', 
                        textTransform: 'uppercase',
                        display: 'flex', 
                        cursor: 'pointer',
                        justifyContent: 'flex-start', 
                        alignItems: 'center', 
                        '&:hover': {
                            bgcolor: '#c0c4d4', 
                        },
                    }}            
                >
                    {isOpen ? <div className='arrow-down'></div> : <div className='arrow-right'></div> }
                    {title}
                </Box>
                :
                <>
                    <Typography variant='h4' sx={{marginLeft: 'calc(2vw + 0.5rem)', fontWeight:'600'}}>{title}</Typography> 
                    <Box display="flex" flexWrap={'wrap'} sx={{marginLeft: 'calc(2vw + 0.5rem)'}}>
                        <Box display="flex" alignItems="center" m={2}>
                            <CalendarTodayIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">
                            <strong>Fecha de Inicio:</strong>{" "}
                            {new Date(semana?.fechaIni).toISOString().split('T')[0]} a las 00:00
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" m={2}>
                            <CalendarTodayIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">
                            <strong>Fecha de Fin:</strong>{" "}
                            {new Date(semana?.fechaFin).toISOString().split('T')[0]} a las 23:59
                            </Typography>
                        </Box>
                    </Box>
                </>
            }

            {(semanaTexto === true || isOpen) && (
                <Box>
                    {semana?.tareas?.length > 0 ? (
                        semana?.tareas?.map((tarea) => (
                            <Box 
                                onClick={() => { clickBoton(tarea); }} 
                                key={tarea.idTarea}
                                sx={{
                                    width: 'calc(66vw + 1rem)',
                                    height: 60,
                                    borderRadius: 0.6,
                                    margin: 0.7,
                                    marginLeft: 'calc(5vw + 0.2rem)',
                                    pl: 2,
                                    fontSize: 'calc(1vw + 0.5rem)',
                                    bgcolor: '#d0d4e4', 
                                    textTransform: 'uppercase',
                                    display: 'flex', 
                                    cursor: 'pointer',
                                    alignItems: 'center', 
                                    '&:hover': {
                                        bgcolor: '#c0c4d4', 
                                    },
                                }}            
                            >
                                {tarea.nombreTarea}
                            </Box>
                        ))
                    ) : (
                        <Box 
                            sx={{
                                width: '80%',
                                height: 60,
                                borderRadius: 0.6,
                                margin: 0.7,
                                marginLeft: 15,
                                pl: 2,
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                bgcolor: '#d0d4e4',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            No hay tareas asignadas para esta semana.
                        </Box>
                    )}
                </Box>
            )}
        </DivLista>
    );
};

export default SprintSemanas;

const DivLista = styled("div")`
    display: flex;
    flex-direction: column;
    margin: 0rem;
`;
