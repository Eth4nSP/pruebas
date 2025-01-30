import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";

export default function CuadroNota({ title = "Nota:", onNoteChange }) {
  const [note, setNote] = useState("");

  const handleNoteChange = (event) => {
    const value = event.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setNote(value);
      if (onNoteChange) {
        onNoteChange(value);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "none",
        mt: 2,
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          mr: 2,
          whiteSpace: "nowrap",
          minWidth: "fit-content",
        }}
      >
        {title}
      </Typography>
      <TextField
        type="number"
        value={note}
        onChange={handleNoteChange}
        sx={{
          width: "80px",
            height: '60px',
            padding: "5px"
        }}
        inputProps={{ 
          min: 0, 
          max: 100,
          style: { 
            textAlign: 'center',
          }
        }}
        helperText="1 - 100"
        margin="none"
      />
    </Box>
  );
}