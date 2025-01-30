import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material"
import myImage from '../../assets/img/inicio.jpg';
import {useNavigate} from 'react-router-dom'
import { logout } from "../../api/sesionesApi";

function HomeDoccente() {
  const navigate = useNavigate();  
  const cerrarCesion = async ()=>{
    try {
      await logout()
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container
      sx={{
        margin: '0',
        display: "flex",
        minHeight: "100vh",
        minWidth: '100VW',
        alignItems: "center",
        justifyContent: "center",
        background: '#114093;'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          width: "calc(50vw + 10rem)",
          maxWidth: "100vw",
          borderRadius: "12px",
          overflow: "hidden",
          minHeight: "60vh",
          flexWrap: 'wrap'
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${myImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: "#fff",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems:'center',
            border: 'solid white 1rem',
            borderRadius: '1.5rem',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold"}}>
            WEB TIS
          </Typography>
        </Box>
        <Box sx={{ flex: 1, padding: "2.8rem", paddingTop:{xs:'0',sm: '1rem' ,md:'2.8rem'} }}>
          <Typography variant="h4" gutterBottom sx={{ marginTop:{xs:'0',sm: '1rem', md:'2rem'}, marginBottom:{xs:'0', sm: '1rem',md:'2.rem'}, fontWeight: 'bold' }}>
            BIENVENIDO ADMIN
          </Typography>
          <Divider sx={{ marginBottom: "20px" }} />
          <Button variant='contained' onClick={()=>navigate('/crearCuentaEstudiante')}>
              Crear cuenta docente
          </Button>
        </Box>
        <Button 
          variant='contained' 
          onClick={()=>cerrarCesion()}
        >
            Cerrar Cesion
        </Button>
      </Paper>
    </Container>
  );
}

export default HomeDoccente;
