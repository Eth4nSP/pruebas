import { Box, Button } from '@mui/material';

export default function DecisionButtons({
  rejectButtonText,
  validateButtonText,
  onReject,
  onValidate,
  disabledButton
}) {
  return (
    <Box
      sx={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "30px",
      }}
    >
      <Button
        variant="outlined"
        onClick={onReject}
      >
        {rejectButtonText}
      </Button>
      <Button
        disabled = {disabledButton !== 0}
        variant="contained"
        color="primary"
        onClick={onValidate}
      >
        {validateButtonText}
      </Button>
    </Box>
  );
}