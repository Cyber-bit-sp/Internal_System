import {
  Alert,
  Snackbar,
} from "@mui/material";

function AppSnackbar({
  open,
  message,
  severity = "success",
  onClose,
}) {
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    onClose();
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          minWidth: {
            xs: "auto",
            sm: 340,
          },
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;