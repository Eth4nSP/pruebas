import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Card, CardContent } from "@mui/material";

function HomeCard({ title, children }) {
  return (
    <StyledCard>
      <CardContent>
        <StyledTitle variant="h6">{title}</StyledTitle>
        {children}
      </CardContent>
    </StyledCard>
  );
}

const StyledCard = styled(Card)({
  width: "40vw",
  padding: "1rem",
  marginBottom: "2rem",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
});

const StyledTitle = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "1rem",
});

export const InfoRow = styled(Box)({
  display: "block",
  alignItems: "center",
  marginBottom: "0.5rem",
});

export const ButtonsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  marginTop: "1rem",
});

export const CardContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
});

export const Title = styled(Typography)({
  marginBottom: "1rem",
  fontWeight: "bold",
});

export default HomeCard;
