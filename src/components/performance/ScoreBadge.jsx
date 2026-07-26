import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

function ScoreBadge({ score = 0 }) {
  const normalizedScore = Math.min(
    5,
    Math.max(0, Number(score) || 0),
  );

  const percentage =
    (normalizedScore / 5) * 100;

  return (
    <Stack spacing={0.75} sx={{ width: 120 }}>
      <Stack
        direction="row"
        alignItems="baseline"
        spacing={0.4}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {normalizedScore.toFixed(1)}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            fontSize: 11,
          }}
        >
          / 5.0
        </Typography>
      </Stack>

      <Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 99,

            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
            },
          }}
        />
      </Box>
    </Stack>
  );
}

export default ScoreBadge;