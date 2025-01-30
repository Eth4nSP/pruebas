import { Fragment, useState, useEffect } from 'react';
import SprintSemanas from '../SprintTareas/sprintSemanas';
import { Box } from '@mui/material';
// eslint-disable-next-line react/prop-types
const VisualizarSprintEst = ({navigateLink, verSprints, sprints=[]}) => {
    const idSprint = localStorage.getItem("idSprint")
    const [sprintOpen, setSprintOpen] = useState([])
    useEffect(()=>{
        if(sprints.length > 0){
            const newOpens = [sprints]?.map(()=> false);
            console.log(newOpens)
            setSprintOpen(newOpens)
        }
    },[])
    const togglePanel = (index) => {
        const newOpens = sprintOpen.map((open,i)=>{
            if(i === index){
                if(open === true) return false
                return true;
            }else{
                if(open === true) return true
                else return false
            }
            
        })
        console.log(newOpens)
        setSprintOpen(newOpens)
    };
    return (
        <Fragment>
                {sprints.map((sprint, i)=>{
                    return (
                    <div key={i}>
                        {(verSprints === true)? 
                            <Box 
                                onClick={() =>togglePanel(i)}
                                sx={{
                                    width: '92%',
                                    height: 60,
                                    borderRadius: 0.6,
                                    margin: 0.7,
                                    marginLeft: 'calc(1vw + 0.1rem)',
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
                                {sprintOpen[i] ? <div className='arrow-down'></div> : <div className='arrow-right'></div> }
                                SPRINT{i+1}
                            </Box>
                            :
                            <div>
                                <h1 style={{ fontSize: '2rem', display: 'flex', overflow: 'hidden', marginBottom: '0.1rem' }}>
                                    SPRINT {sprint.numeroSprint}
                                </h1>
                            </div>
                        }
                            
                        {(!(verSprints === true)||sprintOpen[i]) && sprint.semanas.map((semana, index) => {
                            return (<SprintSemanas 
                                key={index} 
                                title={`Semana ${semana.numeroSemana}`} 
                                semana={semana} 
                                idSprint={idSprint} 
                                navigateLink={navigateLink}
                                semanaTexto = {!verSprints}
                                isOpenSprint = {verSprints === true? true : sprintOpen[i]}
                            >
                            </SprintSemanas>)
                        })}
                    </div>
                    )
                })}
        </Fragment>
    );
}

export default VisualizarSprintEst;
