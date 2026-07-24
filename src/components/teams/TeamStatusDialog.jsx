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

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";

function TeamStatusDialog({
  team,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!team) {
    return null;
  }

  const isActive = team.status === "Active";
  const nextStatus = isActive ? "Archived" : "Active";

  function handleConfirm() {
    onConfirm?.({
      ...team,
      status: nextStatus,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
          <Box
            sx={{
              display: "flex",
              width: 48,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 2,
              color: isActive
                ? "warning.main"
                : "success.main",
              backgroundColor: isActive
                ? "#fffaeb"
                : "#ecfdf3",
            }}
          >
            {isActive ? (
              <ArchiveOutlinedIcon />
            ) : (
              <RestoreOutlinedIcon />
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
              {isActive
                ? "Archive Team"
                : "Restore Team"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Confirm this team status change.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 46,
                height: 46,
                color: "primary.dark",
                backgroundColor: "primary.light",
              }}
            >
              <GroupsOutlinedIcon />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {team.name}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 13,
                }}
              >
                {team.code} · {team.department}
              </Typography>
            </Box>
          </Stack>

          <Alert
            severity={isActive ? "warning" : "success"}
          >
            {isActive
              ? "This team will no longer be available for new assignments. Existing members and historical records will remain available."
              : "This team will become active again and can receive new members and assignments."}
          </Alert>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 14,
            }}
          >
            Status will change from{" "}
            <strong>{team.status}</strong> to{" "}
            <strong>{nextStatus}</strong>.
          </Typography>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color={isActive ? "warning" : "success"}
          startIcon={
            isActive ? (
              <ArchiveOutlinedIcon />
            ) : (
              <RestoreOutlinedIcon />
            )
          }
          onClick={handleConfirm}
        >
          {isActive ? "Archive Team" : "Restore Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TeamStatusDialog;