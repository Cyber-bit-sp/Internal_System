import {
  Alert,
  Avatar,
  Box,
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

function UserStatusDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!user) {
    return null;
  }

  const isActive = user.status === "Active";
  const nextStatus = isActive ? "Inactive" : "Active";
  const fullName = `${user.firstName} ${user.lastName}`;

  function handleConfirm() {
    onConfirm({
      ...user,
      status: nextStatus,
    });
  }

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
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              width: 48,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 2,
              color: isActive ? "error.main" : "success.main",
              backgroundColor: isActive
                ? "error.50"
                : "success.50",
            }}
          >
            {isActive ? (
              <BlockOutlinedIcon />
            ) : (
              <CheckCircleOutlineRoundedIcon />
            )}
          </Box>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {isActive ? "Deactivate User" : "Activate User"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: 14 }}
            >
              Confirm this account status change.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 46,
                height: 46,
                color: "primary.dark",
                backgroundColor: "primary.light",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Avatar>

            <Box>
              <Typography fontWeight={600}>{fullName}</Typography>

              <Typography
                color="text.secondary"
                sx={{ fontSize: 13 }}
              >
                {user.employeeId} · {user.jobTitle}
              </Typography>
            </Box>
          </Stack>

          <Alert severity={isActive ? "warning" : "success"}>
            {isActive
              ? "This user will no longer be able to access the platform. Their existing records will remain available."
              : "This user will regain access to the platform and can be assigned work again."}
          </Alert>

          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Status will change from{" "}
            <strong>{user.status}</strong> to{" "}
            <strong>{nextStatus}</strong>.
          </Typography>
        </Stack>
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
          color={isActive ? "error" : "success"}
          startIcon={
            isActive ? (
              <BlockOutlinedIcon />
            ) : (
              <CheckCircleOutlineRoundedIcon />
            )
          }
          onClick={handleConfirm}
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserStatusDialog;