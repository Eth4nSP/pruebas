import { Box, Typography, Button} from "@mui/material";
import { styled } from "@mui/material";
import CardGeneral from '../cardGeneral'
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
function CardResumen() {
  const numEstudiantes = localStorage.getItem('numEstudiantes')
  const numEmpresas = localStorage.getItem('numEmpresas')
  const navigate = useNavigate();
  return (
    <CardGeneral
        titulo = "Resumen General"
        info = {<>
        <Box sx={{display:'flex'}}>    
                <SchoolIcon style={{ marginRight: "0.5rem" }} />
                <IconText>Estudiantes Inscritos</IconText>
                <Typography>{numEstudiantes}</Typography>
        </Box>
        <Box sx={{display:'flex'}} >
            <GroupIcon style={{ marginRight: "0.5rem" }} />
            <IconText>Grupo Empresas</IconText>
            <Typography>{numEmpresas}</Typography>
        </Box>
        </>}
        buttons={<> 
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/homeDocente/listaEstudiantes")} >
            LISTA DE ESTUDIANTES
        </Button>
        <Button variant="outlined" color="primary" fullWidth onClick={() => navigate("/homeDocente/listaEmpresas")}>
            LISTA DE GRUPO-EMPRESAS
        </Button>
        <Button variant="outlined" color="primary" fullWidth onClick={() => navigate("/modificarFechasLimitesGrupo")}>
            MODIFICAR FECHAS LIMITES DEL GRUPO
        </Button>
        </>}
    />
  );
}

export default CardResumen;

const IconText = styled(Typography)({
    flexGrow: 1,
  });
  