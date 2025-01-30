import { styled } from "@mui/material/styles";
import { Box, Typography, Card, CardContent} from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";


function card({titulo, info, buttons}) {
  return (
    <StyledCard>
      <CardContent>
        <SectionTitle variant="h6">{titulo}</SectionTitle>
        <InfoRow>
            {info}
        </InfoRow>
        <ButtonsContainer>
          {buttons}
        </ButtonsContainer>
      </CardContent>
    </StyledCard>
  );
}

export default card;



const StyledCard = styled(Card)({
    width: "calc(30vw + 8rem)",
    padding: "1rem",
    margin:'1rem',
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    ":hover":{
      boxShadow: "0 1rem 10rem rgba(0,0,0,0.2)",
      zIndex:'1000',
      backgroundColor:'#dcdadaf'
    }
  });
  
  const SectionTitle = styled(Typography)({
    fontWeight: "bold",
    marginBottom: "1rem",
  });
  
  const InfoRow = styled(Box)({
    display: "block",
    alignItems: "center",
    marginBottom: "0.5rem",
  });
  

  const ButtonsContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
  });