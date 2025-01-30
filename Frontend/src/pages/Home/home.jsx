import Footer from "../../components/baseUI/Footer/footer.jsx";
import Header from "../../components/baseUI/Header/header.jsx";
import { useNavigate } from "react-router-dom";
import { Container, Grid2, Button, Typography, Paper } from "@mui/material";

const ButtonGroup = ({ title, buttons }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Grid2 container spacing={2}>
      {buttons.map((button, index) => (
        <Grid2 item xs={12} sm={6} md={4} key={index}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={button.onClick}
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {button.label}
          </Button>
        </Grid2>
      ))}
    </Grid2>
  </Paper>
);

function Home() {
  const navigate = useNavigate();

  const teacherButtons = [
    {
      label: "HU33_Validar Planificaciones",
      onClick: () => navigate("/validarPlanificacion/"),
    },
    
  ];

  const studentButtons = [
    {
      label: "HU16_Grupos Disponibles",
      onClick: () => navigate("/homeEstudiante/gruposDisponibles/1"),
    },

  ];

  const sharedButtons = [
    {
      label: "HU36_Ver Planificación",
      onClick: () => navigate("/visualizarPlanificacion"),
    },
    {
      label: "HU4_Modificar Planificación",
      onClick: () => navigate("/modificarPlanificacion/"),
    },
    {
      label: "Publicar Planificación",
      onClick: () => navigate("/publicarPlanificacion/"),
    },
    {
      label: "HU37_Visualizar Sprint",
      onClick: () => navigate("/visualizarSprint/"),
    },
  ];
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ my: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          Panel de Control
        </Typography>
        <ButtonGroup title="Acciones del Docente" buttons={teacherButtons} />
        <ButtonGroup title="Acciones del Estudiante" buttons={studentButtons} />
        <ButtonGroup title="Acciones Compartidas" buttons={sharedButtons} />
      </Container>
      <Footer />
    </>
  );
}

export default Home;
