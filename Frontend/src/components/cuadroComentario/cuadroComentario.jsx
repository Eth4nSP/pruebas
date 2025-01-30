import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';

export default function cuadroComentario({ title, maxChars = 500, onTextChange }) {
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (event) => {
    const text = event.target.value.slice(0, maxChars);
    setInput(text);
    setCharCount(text.length);
    if (onTextChange) {
      onTextChange(text);
    }
  };

  return (
    <Box >
      <TextField
        label={`${title} (máximo ${maxChars} caracteres)`}
        multiline
        rows={4}
        value={input}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: maxChars }}
        helperText={`${charCount}/${maxChars} caracteres`}
      />
    </Box>
  );
}