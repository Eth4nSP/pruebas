import Footer from "../../../components/baseUI/Footer/footer.jsx";
import Header from "../../../components/baseUI/Header/header.jsx";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CardResumen from '../../../components/cardsHome/cardDocente/cardResumen.jsx';
import CardPlanificacion from '../../../components/cardsHome/cardDocente/cardPlanificacion.jsx';
import CardSprint from '../../../components/cardsHome/cardDocente/cardSprint.jsx';
import CardSeguimientoSemanal from '../../../components/cardsHome/cardDocente/cardSeguimientoSemanal.jsx';
import CardEvaluacion from '../../../components/cardsHome/cardDocente/cardEvaluacion.jsx';
import CardListaYDatos from '../../../components/cardsHome/cardDocente/cardListaYDatos.jsx';
import Loading from '../../../components/loading/loading.jsx';
import { getOriginDocente } from "../../../api/getDatosLogin.jsx";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const getDatosLogin = async () => {
        try {
          await getOriginDocente()
          setIsLoaded(true);
        } catch (error) {
          console.error("Error:", error);
        }
    };
    getDatosLogin();
  }, []);

  if (!isLoaded) {
    return (
      <>
        <Header />
        <Loading></Loading>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Button variant="contained" color="primary" onClick={()=>navigate("/")} sx={{ marginTop:'5rem', marginLeft:'calc(5vw + 0.5rem)' }}>
        Volver a la lista de grupos
      </Button>
      <Title variant="h5" align="center">
        Bienvenid@, Ing. {localStorage.getItem('nombreCompleto')}
      </Title>
      <Title variant="h6" align="center">
        {localStorage.getItem('gestion')}
      </Title>
      <Container>
        <CardResumen/>
        <CardPlanificacion />
        <CardSprint />
        <CardSeguimientoSemanal />
        <CardEvaluacion />
        <CardListaYDatos />
      </Container>
      <Footer />
    </>
  );
}

export default Home;

const Container = styled(Box)({
  display: "flex",
  minHeight: '72.9vh',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center'
});
const Title = styled(Typography)({
  marginBottom: "1rem",
  fontWeight: "bold",
});
