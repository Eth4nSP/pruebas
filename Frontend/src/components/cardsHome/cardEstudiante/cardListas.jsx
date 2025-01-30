import { Button} from "@mui/material";
import CardGeneral from '../cardGeneral'
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const navigate = useNavigate();
  const aceptada =Number(localStorage.getItem("aceptada"));
  return (
    <CardGeneral
        titulo = "LISTAS Y NOTA"
        info = {<>
        </>}
        buttons={<>
        {aceptada?
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/homeEstu/VerCalificacionesSprints")} >
              18_ VISUALIZAR NOTAS SPRINT
          </Button>
        :
          <></>
        }
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/homeEstu/listaEstudiantesGrupo")} >
           32_LISTA DE ESTUDIANTES
        </Button>
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/homeEstu/listaEmpresasGrupo")} >
            31_LISTA DE GRUPO EMPRESAS
        </Button>
        </>}
    />
  );
}

export default CardResumen;