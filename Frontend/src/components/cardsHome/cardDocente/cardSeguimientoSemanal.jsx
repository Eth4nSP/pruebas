import { Button} from "@mui/material";
import CardGeneral from '../cardGeneral'
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const fechaLimiteEntregaPlani = new Date(`${localStorage.getItem("fechaLimiteEntregaPlanificacion")}T23:59:59`)
  const paso = fechaLimiteEntregaPlani < new Date()
  const navigate = useNavigate()
  return (
    <CardGeneral
        titulo = "Seguimiento Semanal"
        info = {<>
        </>}
        buttons={<> 
        {!paso&&<p>Se habilitara en la fecha: {fechaLimiteEntregaPlani.toISOString().split('T')[0]}</p>}
        <Button variant="contained" color="primary" fullWidth
          onClick = { () => navigate(`/homeDocente/listaEmpresasVerTareas`)}
          disabled={!paso}
        >
            38_VISUALIZAR TAREAS
        </Button>
        <Button variant="outlined" color="primary" fullWidth
          onClick= {() => navigate("/homeDocente/listaEmpresasEvaluacionSemanal")}
          disabled={!paso}
        >
            07_REALIZAR SEGUIMIENTO
        </Button>
        </>}
    />
  );
}

export default CardResumen;
  