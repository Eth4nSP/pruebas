import { Box, Button, Typography } from "@mui/material";
import HomeCard, { ButtonsContainer, InfoRow, Title } from "../homeCard";
import { useNavigate } from "react-router-dom";
function CardEvaluacion() {
  const navigate = useNavigate();
  const fechaEvaluacion = localStorage.getItem("fechaEvaluacion");
  const tipoEvaluacion = localStorage.getItem("tipoEvaluacion");
  console.log(fechaEvaluacion);
  const sePuedeEvaluar = fechaEvaluacion !== null && new Date() >= new Date(fechaEvaluacion);
  console.log(sePuedeEvaluar);
  const textoTipoEvaluacion = (tipo) => {
    switch (tipo) {
      case "evaluacionPares":
        return "Evaluación a Pares";
      case "evaluacionCruzada":
        return "Evaluación Cruzada";
      case "autoevaluacion":
        return "Autoevaluación";
      default:
        return tipo;
    }
  };
  return (
    <HomeCard title="Evaluaciones">
      <InfoRow>
        <Box>
          {fechaEvaluacion !== "undefined" && fechaEvaluacion !== null && (
            <Typography>Fecha de evaluacion: {fechaEvaluacion}</Typography>
          )}
          {tipoEvaluacion !== "undefined" && tipoEvaluacion !== null ? (
            <Typography>Tipo de evaluacion: {textoTipoEvaluacion(tipoEvaluacion)}</Typography>
          ): (
            <Typography>El docente aún no definió la evaluación</Typography>
          )}
        </Box>
      </InfoRow>
      <ButtonsContainer>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate("/realizarEvaluacion")}
          disabled={!sePuedeEvaluar}
        >
          REALIZAR EVALUACION
        </Button>

      </ButtonsContainer>
    </HomeCard>
  );
}

export default CardEvaluacion;
