import { Button, Typography} from "@mui/material";
import CardGeneral from '../cardGeneral'
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const fechaFinPlanificacion = new Date(localStorage.getItem("fechaFinPlanificacion"))
  const paso = new Date() > fechaFinPlanificacion
  const fechaLimiteEntregaPlani = new Date(localStorage.getItem("fechaLimiteEntregaPlanificacion"))
  const inicio = fechaLimiteEntregaPlani < new Date()
  const navigate = useNavigate()
  return (
    <CardGeneral
        titulo = "Tareas"
        info = {<>
        {inicio?
          <>
          <Typography>La semana Inicio el: {localStorage.getItem('fechaIniSemana')} a las 00:00</Typography>
          <Typography>Fecha limite de entrega del seguimiento: {localStorage.getItem('fechaLimiteSemana')} a las 23:59</Typography>
          </>
          :
          <Typography>El seguimiento iniciara: {localStorage.getItem('fechaLimiteEntregaPlanificacion')} a las 00:00</Typography>
        }
        </>}
        buttons={inicio?
          <>
            {!paso?<Button variant="contained" color="primary" fullWidth
              onClick={()=>navigate("/homeEstu/modificarListaTareas")}
            >
                40_MODIFICAR LISTA SEMANAL DE TAREAS
            </Button>:<></>}
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={()=>navigate("/homeEstu/listaSprintsSemanasTareas")} 
            >
                38_VISUALIZAR TAREAS
            </Button>
            {!paso?<Button variant="contained" color="primary" fullWidth
              onClick={()=>navigate("/homeEstu/listaTareas")}
            >
                08_MODIFICAR TAREAS
            </Button>:<></>}
            <Button variant="outlined" color="primary" fullWidth onClick={() => navigate("/homeEstu/listaSprintsVerSeguimiento")} >
                77_VISUALIZAR COMENTARIOS TAREAS SEMANA
            </Button>
          </>
          :
          <></>
        }
    />
  );
}

export default CardResumen;