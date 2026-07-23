import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function BulkUserStatusDialog({
  isOpen,
  userCount,
  nextStatus,
  onClose,
  onConfirm,
}) {
  const isActivation = nextStatus === "Active";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          {isActivation
            ? "Activate Selected Users"
            : "Deactivate Selected Users"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
            fontSize: 14,
          }}
        >
          Confirm the status change for {userCount} selected{" "}
          {userCount === 1 ? "user" : "users"}.
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Alert severity={isActivation ? "success" : "warning"}>
          {isActivation
            ? "Selected users will regain access to the platform."
            : "Selected users will lose access, but their existing records will remain available."}
        </Alert>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          color="inherit"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color={isActivation ? "success" : "error"}
          startIcon={
            isActivation ? (
              <CheckCircleOutlineRoundedIcon />
            ) : (
              <BlockOutlinedIcon />
            )
          }
          onClick={onConfirm}
        >
          {isActivation ? "Activate Users" : "Deactivate Users"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BulkUserStatusDialog;