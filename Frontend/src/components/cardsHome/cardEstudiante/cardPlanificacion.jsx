import { Button, Typography} from "@mui/material";
import CardGeneral from '../cardGeneral'
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const aceptada =Number(localStorage.getItem("aceptada"));
  const idPlanificacion =localStorage.getItem("idPlanificacion");
  const tienePlanificacion = idPlanificacion!=="-1";
  const empresa= localStorage.getItem("idEmpresa");

  const fechaLimiteEntregaPlani = new Date(`${localStorage.getItem("fechaLimiteEntregaPlanificacion")}T23:59:58`)
  const pasoFechaLimite = fechaLimiteEntregaPlani < new Date()
  
  const navigate = useNavigate();
  const fechaLimiteEntregaEmpresa = new Date(`${localStorage.getItem("fechaLimiteEntregaEmpresa")}T23:59:59`);
  const inicio = fechaLimiteEntregaEmpresa < new Date()
  return (
    <CardGeneral
        titulo = "Planificacion"
        info = {<>
          <Typography>
            Fecha inicial para la entrega de la planificacion: {fechaLimiteEntregaEmpresa.toISOString().split('T')[0]} a las 00:00  
          </Typography>
          <Typography>
            Fecha limite de entrega de la planificacion: {localStorage.getItem("fechaLimiteEntregaPlanificacion")} a las 23:59
          </Typography>
        </>}
        buttons={<> 
        {(aceptada !==1 && !pasoFechaLimite && inicio) ? (
          <Button variant="contained" color="primary" fullWidth onClick={()=>navigate(`/modificarPlanificacion/empresa/${empresa}`)}>
            {tienePlanificacion ? "MODIFICAR PLANIFICACIÓN" : "CREAR PLANIFICACIÓN"}
          </Button>
        ):<></>}
        {tienePlanificacion? <Button variant="outlined" color="primary" fullWidth
          onClick={()=>navigate(`/visualizarPlanificacion/empresa/${empresa}`)}
        >
          VIZUALIZAR PLANIFICACIONES
        </Button>:<></>}
        {(aceptada!==1 && !pasoFechaLimite && tienePlanificacion) ?
        <Button variant="contained" color="primary" 
          fullWidth
          onClick={()=>navigate(`/publicarPlanificacion/empresa/${empresa}`)}
        >
            PUBLICAR PLANIFICACION
        </Button>:<></>}
        </>}
    />
  );
}

export default CardResumen;
  