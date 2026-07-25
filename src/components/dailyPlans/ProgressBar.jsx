import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

function ProgressBar({ value = 0 }) {
  const normalizedValue = Math.min(
    100,
    Math.max(0, Number(value) || 0),
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
    >
      <Box sx={{ width: 90 }}>
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          sx={{
            height: 7,
            borderRadius: 99,

            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
            },
          }}
        />
      </Box>

      <Typography
        sx={{
          minWidth: 38,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {Math.round(normalizedValue)}%
      </Typography>
    </Stack>
  );
}

export default ProgressBar;