const apiHost = import.meta.env.VITE_HOST;

import Footer from "../../../components/baseUI/Footer/footer.jsx";
import Header from "../../../components/baseUI/Header/header.jsx";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button} from "@mui/material";
import { Fragment, useEffect, useState} from "react";
import CardProgreso from '../../../components/cardsHome/cardEstudiante/cardProgreso.jsx'
import CardPlanificacion from '../../../components/cardsHome/cardEstudiante/cardPlanificacion.jsx'
import CardListas from '../../../components/cardsHome/cardEstudiante/cardListas.jsx'
import CardGrupoEmpresa from '../../../components/cardsHome/cardEstudiante/cardGrupoEmpresa.jsx'
import CardEvaluacion from '../../../components/cardsHome/cardEstudiante/cardEvaluacion.jsx'
import CardTareas from '../../../components/cardsHome/cardEstudiante/cardTareas.jsx'
import { useNavigate} from "react-router-dom";
import Loading from '../../../components/loading/loading.jsx' 
function HomeEstudiante() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate =useNavigate()
  const idGrupo = localStorage.getItem("idGrupo")
  useEffect(()=>{
    const getOrigin = async() =>{
      const link = `${apiHost}/estudiante/getDataEstudiante/${idGrupo}`; 
      const body = {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: 'include'
      }
      
      fetch(link, body)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((response) => {
          const tieneGrupo = response.idGrupo;
          if (tieneGrupo === -1) {
            localStorage.setItem("idEstudiante", response.idEstudiante);
            localStorage.setItem("idGrupo", response.idGrupo);
            navigate("/GruposDocente");
          } else {
            localStorage.setItem("idEstudiante", response.idEstudiante);
            localStorage.setItem("nombreCompleto", response.nombreCompleto);
            localStorage.setItem("idEmpresa", response.idEmpresa);
            localStorage.setItem("idPlanificacion", response.idPlanificacion);
            localStorage.setItem("aceptada", response.aceptada);
            localStorage.setItem("publicada", response.publicada);
            localStorage.setItem("idSprint", response.idSprint);
            localStorage.setItem("idSemana", response.idSemana);
            localStorage.setItem("idGrupo", response.idGrupo);
            localStorage.setItem('gestion', response.gestion);
            
            localStorage.setItem("empresaPublicada", response.empresaPublicada);
            localStorage.setItem("fechaIniGestion", response.fechaIniGestion);//desde aqui pueden crear empresas pero nada mas
            localStorage.setItem("fechaLimiteEntregaEmpresa", response.fechaLimiteEntregaEmpresa);//hasta esta fecha que entrega de empresas y fecha ini de entrega de plani
            localStorage.setItem("fechaLimiteEntregaPlanificacion", response.fechaLimiteEntregaPlanificacion);//fecha limite de entrega plani, y ini de los sprint
            localStorage.setItem("fechaFinPlanificacion", response.fechaFinPlanificacion);//fechafinplani hasta aqui terminan todos los sprints
            localStorage.setItem("fechaFinGestion", response.fechaFinGestion);//fecha fin gestion  

            localStorage.setItem("fechaLimiteSprint", response.fechaLimiteSprint)
            localStorage.setItem('fechaLimiteSemana', response.fechaLimiteSemana)
            localStorage.setItem("fechaIniSprint", response.fechaIniSprint)
            localStorage.setItem('fechaIniSemana', response.fechaIniSemana)

            localStorage.setItem("fechaEvaluacion", response.fechaEvaluacion);
            localStorage.setItem("tipoEvaluacion", response.tipoEvaluacion);
          }
          setIsLoaded(true);
        })
        .catch((error) => {
          console.log("Fetch error: ", error);
        });
    }
    getOrigin()
  },[])

  if (!isLoaded) {
    return (
      <>
        <Header />
        <Loading></Loading>
        <Footer />
      </>
    )
  }
  const nombreCompleto = localStorage.getItem("nombreCompleto")
  const aceptada = Number(localStorage.getItem("aceptada"));
  const empresaPublicada = Number(localStorage.getItem("empresaPublicada"));
  return (
    <Fragment>
      <Header />
      <Button variant="contained" color="primary" onClick={()=>navigate("/")} sx={{ marginTop:'5rem', marginLeft:'calc(5vw + 0.5rem)' }}>
        Volver a la lista de grupos
      </Button>
      <Title variant="h5" sx={{ textAlign:'center'}}>Bienvenid@, {nombreCompleto}</Title>
      <Title variant="h6" sx={{textAlign:'center'}}>{localStorage.getItem('gestion')}</Title>
      <Container>
        {(aceptada!==0)?<CardProgreso></CardProgreso>:<></>} 
        <CardGrupoEmpresa></CardGrupoEmpresa>        
        {empresaPublicada?<CardPlanificacion></CardPlanificacion>:<></>}
        {(aceptada!==0 )?<CardTareas></CardTareas>:<></>}
        <CardEvaluacion></CardEvaluacion>
        <CardListas></CardListas>
      </Container>
      <Footer />
    </Fragment>
  );
}

export default HomeEstudiante;


const Container = styled(Box)({
  display: "flex",
  minHeight:'72.9vh',
  flexWrap:'wrap',
  alignItems:'center',
  justifyContent:'center'
});
const Title = styled(Typography)({
  marginBottom: "1rem",
  fontWeight: "bold",
});