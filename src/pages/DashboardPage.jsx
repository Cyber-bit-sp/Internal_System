import {
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";

function DashboardPage() {
  return (
    <Box
      sx={{
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4">
          Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            mb: 3,
          }}
        >
          Organization overview and recent performance.
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Dashboard development will begin after the
            primary management modules are complete.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage;