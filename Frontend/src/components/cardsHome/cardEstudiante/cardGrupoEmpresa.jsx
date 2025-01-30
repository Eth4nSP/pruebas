import { Button, Typography} from "@mui/material";
import CardGeneral from '../cardGeneral'
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const navigate = useNavigate()
  const fechaLimiteEntregaEmpresa = new Date(`${localStorage.getItem("fechaLimiteEntregaEmpresa")}T23:59:58`);
  const paso = fechaLimiteEntregaEmpresa > new Date()
  const idEmpresa = Number(localStorage.getItem("idEmpresa"))
  const empresaPublicada = Number(localStorage.getItem("empresaPublicada"))
  return (
    <CardGeneral
        titulo = "Grupo Empresa"
        info = {<>
            <Typography>
              Fecha limite de entrega de la Empresa: {localStorage.getItem("fechaLimiteEntregaEmpresa")} a las 23:59
            </Typography>
        </>}
        buttons={<> 
        {paso&&idEmpresa===-1?<Button variant="contained" color="primary" fullWidth
          onClick = { () => navigate("/homeEstu/CrearGrupoEmpresa")}
        >
            03_REGISTRAR GRUPO EMPRESA
        </Button>:<></>}
        {paso&&(empresaPublicada!==1)&&idEmpresa!==-1?<Button variant="outlined" color="primary" fullWidth
          onClick= {() => navigate("/homeEstu/ModificarGrupoEmpresa")}
        >
            69_MODIFICAR GRUPO EMPRESA
        </Button>:<></>}
        {idEmpresa!==-1?<Button variant="outlined" color="primary" fullWidth
          onClick= {() => navigate("/homeEstu/PublicarGrupoEmpresa")}
        >
            {empresaPublicada? 'Ver Empresa':'pu71_PUBLICAR GRUPO EMPRESA'}
        </Button>:<></>}
        </>}
    />
  );
}

export default CardResumen;
  