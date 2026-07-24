import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

function TeamDetailsDialog({
  team,
  isOpen,
  onClose,
  onEdit,
  onChangeStatus,
  onManageMembers,
}) {
  if (!team) {
    return null;
  }

  const isActive = team.status === "Active";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Team Details
          </Typography>

          <IconButton
            aria-label="Close team details"
            onClick={onClose}
            sx={{
              mt: -0.5,
              mr: -0.5,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          px: 3,
          py: 3,
          backgroundColor: "#fcfcfd",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2.5}
          sx={{
            mb: 4,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 76,
              height: 76,
              color: "primary.dark",
              backgroundColor: "primary.light",
            }}
          >
            <GroupsOutlinedIcon
              sx={{
                fontSize: 36,
              }}
            />
          </Avatar>

          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {team.name}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              {team.department}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mt: 1.5,
              }}
            >
              <Chip
                label={team.code}
                size="small"
                variant="outlined"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />

              <Chip
                label={team.status}
                size="small"
                sx={{
                  color: isActive ? "#067647" : "#475467",
                  backgroundColor: isActive ? "#ecfdf3" : "#f2f4f7",
                  border: `1px solid ${isActive ? "#abefc6" : "#d0d5dd"}`,
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Typography
          sx={{
            mb: 2,
            color: "text.primary",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Team Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <DetailItem
            icon={<BadgeOutlinedIcon />}
            label="Team Code"
            value={team.code}
          />

          <DetailItem
            icon={<BusinessOutlinedIcon />}
            label="Department"
            value={team.department}
          />

          <DetailItem
            icon={<PersonOutlineRoundedIcon />}
            label="Team Manager"
            value={team.managerName || "Not assigned"}
          />

          <DetailItem
            icon={<PeopleOutlineRoundedIcon />}
            label="Team Members"
            value={`${team.memberCount || 0} members`}
          />

          <DetailItem
            icon={<CalendarMonthOutlinedIcon />}
            label="Created Date"
            value={formatDate(team.createdDate)}
          />

          <DetailItem
            icon={<GroupsOutlinedIcon />}
            label="Status"
            value={team.status}
          />
        </Box>

        <Typography
          sx={{
            mb: 2,
            color: "text.primary",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Description
        </Typography>

        <Box
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {team.description || "No description provided."}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          color={isActive ? "warning" : "success"}
          variant="outlined"
          startIcon={
            isActive ? <ArchiveOutlinedIcon /> : <RestoreOutlinedIcon />
          }
          onClick={() => onChangeStatus?.(team)}
        >
          {isActive ? "Archive Team" : "Restore Team"}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="outlined"
            startIcon={<ManageAccountsOutlinedIcon />}
            onClick={() => onManageMembers?.(team)}
          >
            Manage Members
          </Button>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit?.(team)}
          >
            Edit Team
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        p: 2,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 38,
          height: 38,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          borderRadius: 2,
          color: "primary.main",
          backgroundColor: "primary.light",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            overflow: "hidden",
            color: "text.primary",
            fontSize: 14,
            fontWeight: 500,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default TeamDetailsDialog;
