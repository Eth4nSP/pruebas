import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListaSprintsPorIdEmpresa } from "../../../../api/visualizarSprint/visualizarSprint";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  styled,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BaseUI from "../../../../components/baseUI/baseUI";
import Loading from "../../../../components/loading/loading";
import Error from "../../../../components/error/error";
import cookie from "js-cookie";
import { decrypt } from "../../../../api/decrypt";
// Estilos personalizados
const StyledPaper = styled(Paper)({
  backgroundColor: "#d0d4e4", 
  borderRadius: "8px",
  overflow: "hidden",
});

const StyledListItem = styled(ListItem)({
  borderBottom: "3px solid rgba(255, 255, 255, 0.4)",
  padding: "16px 20px",
  cursor: "pointer",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#c0c4d4",
  },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledListItemText = styled(ListItemText)({
  "& .MuiTypography-root": {
    color: "black",
    fontSize: "1.5rem",
    fontWeight: 500,
  },
});

function SeleccionarSprintVisualizar() {
  const random = cookie.get('random');
  const role = decrypt(random);
  const [listaSprints, setListaSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    errorMessage: "",
    errorDetails: "",
  });
  const { idEmpresa } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const sprintsList = await getListaSprintsPorIdEmpresa(idEmpresa);
        setListaSprints(sprintsList);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError({
          errorMessage: "Ha ocurrido un error",
          errorDetails: error.message,
        });
        setLoading(false);
      }
    }

    fetchData();
  }, [idEmpresa]);

  const handleSprintClick = (idSprint) => {
    navigate(`/visualizarSprint/empresa/${idEmpresa}/sprint/${idSprint}`);
  };


  return (
    <BaseUI
      titulo="SELECCIONE UN SPRINT PARA VISUALIZAR"
      ocultarAtras={false}
      confirmarAtras={false}
      dirBack={role==='docente'?`/visualizarSprint`:`/homeEstu`}
      loading={false}
      error={{error:false}}
    >
        {error.errorMessage || error.errorDetails ? (
        <Error
          errorMessage={error.errorMessage}
          errorDetails={error.errorDetails}
        />
      ) : loading ? (
        <Loading />
      ): (
      <Box sx={{ margin: "0 auto", p: 2 }}>
        <StyledPaper elevation={3}>
          <List disablePadding>
            {listaSprints.map((sprint) => (
              <StyledListItem
                key={sprint.idSprint}
                onClick={() => handleSprintClick(sprint.idSprint)}
              >
                <StyledListItemText primary={`SPRINT ${sprint.numeroSprint}`} />
                <ChevronRightIcon />
              </StyledListItem>
            ))}
          </List>
        </StyledPaper>
      </Box>
      )}
    </BaseUI>
  );
}

export default SeleccionarSprintVisualizar;
