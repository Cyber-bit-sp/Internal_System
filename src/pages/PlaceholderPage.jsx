import {
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";

function PlaceholderPage({
  title,
  description,
}) {
  return (
    <Box
      sx={{
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4">
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            mb: 3,
          }}
        >
          {description}
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            Coming soon
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            This module will be developed in a future step.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default PlaceholderPage;