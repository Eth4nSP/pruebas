/* eslint-disable react/prop-types */
import { Fragment } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
function Comentario({titulo, comentario }) {
  return (
    <>
      <Box display="flex" sx={{ textAlign: "center", mb: 1 , mt:2}}>
        <Typography
          variant="subtitle"
          component="h2"
          gutterBottom
          sx={{ mr: 2 }}
        >
          {titulo}
        </Typography>
      </Box>
      <Box>
      <Paper
        elevation={1}
        sx={{
          p: 5,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3,
        }}
      >
          <Typography variant="body1" component="h1">{comentario}</Typography>
        </Paper>
      </Box>
    </>
  );
}

export default Comentario;
