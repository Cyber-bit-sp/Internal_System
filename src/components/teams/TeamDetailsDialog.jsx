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
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

function TeamDetailsDialog({
  team,
  users = [],
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
  const teamMembers = getTeamMembers(team, users);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            maxHeight: "calc(100vh - 80px)",
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
          sx={{ mb: 4 }}
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
              sx={{ mt: 1.5 }}
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
                  color: isActive
                    ? "#067647"
                    : "#475467",
                  backgroundColor: isActive
                    ? "#ecfdf3"
                    : "#f2f4f7",
                  border: `1px solid ${
                    isActive ? "#abefc6" : "#d0d5dd"
                  }`,
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <SectionTitle>Team Information</SectionTitle>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
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
            value={`${teamMembers.length} members`}
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

        <SectionTitle>Description</SectionTitle>

        <Box
          sx={{
            p: 2.5,
            mb: 4,
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

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Team Members
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.35,
                fontSize: 13,
              }}
            >
              Employees currently assigned to this team.
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ManageAccountsOutlinedIcon />}
            onClick={() => onManageMembers?.(team)}
          >
            Manage Members
          </Button>
        </Stack>

        {teamMembers.length === 0 ? (
          <EmptyMembersState
            onManageMembers={() =>
              onManageMembers?.(team)
            }
          />
        ) : (
          <Box
            sx={{
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
              backgroundColor: "background.paper",
            }}
          >
            {teamMembers.map((user, index) => {
              const isManager =
                String(user.id) ===
                String(team.managerId);

              return (
                <MemberRow
                  key={user.id}
                  user={user}
                  isManager={isManager}
                  isLast={
                    index === teamMembers.length - 1
                  }
                />
              );
            })}
          </Box>
        )}
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
            isActive ? (
              <ArchiveOutlinedIcon />
            ) : (
              <RestoreOutlinedIcon />
            )
          }
          onClick={() => onChangeStatus?.(team)}
        >
          {isActive ? "Archive Team" : "Restore Team"}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={onClose}
          >
            Close
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

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        mb: 2,
        color: "text.primary",
        fontSize: 16,
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
}

function DetailItem({
  icon,
  label,
  value,
}) {
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

function MemberRow({
  user,
  isManager,
  isLast,
}) {
  const fullName = getUserName(user);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        px: 2.25,
        py: 1.75,
        borderBottom: isLast
          ? 0
          : "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        sx={{
          width: 42,
          height: 42,
          backgroundColor: isManager
            ? "primary.main"
            : "#e4e7ec",
          color: isManager
            ? "#ffffff"
            : "#344054",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {getInitials(user)}
      </Avatar>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <Typography
            noWrap
            sx={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {fullName}
          </Typography>

          {isManager && (
            <Chip
              icon={
                <SupervisorAccountOutlinedIcon />
              }
              label="Manager"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography
          noWrap
          color="text.secondary"
          sx={{
            mt: 0.25,
            fontSize: 12,
          }}
        >
          {user.email || "No email available"}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 190,
          minWidth: 0,
        }}
      >
        <Typography
          noWrap
          sx={{
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {user.jobTitle ||
            user.role ||
            "No job title"}
        </Typography>

        <Typography
          noWrap
          color="text.secondary"
          sx={{
            mt: 0.25,
            fontSize: 12,
          }}
        >
          {user.department ||
            "No department"}
        </Typography>
      </Box>

      <Chip
        label={user.status || "Unknown"}
        size="small"
        variant="outlined"
        color={
          user.status === "Active"
            ? "success"
            : "default"
        }
      />
    </Stack>
  );
}

function EmptyMembersState({
  onManageMembers,
}) {
  return (
    <Box
      sx={{
        px: 3,
        py: 6,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Avatar
        sx={{
          width: 52,
          height: 52,
          mx: "auto",
          mb: 1.5,
          color: "primary.main",
          backgroundColor: "primary.light",
        }}
      >
        <PeopleOutlineRoundedIcon />
      </Avatar>

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        No members assigned
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 420,
          mx: "auto",
          mt: 0.75,
          mb: 2,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Assign employees to this team so they can appear in
        team planning and performance records.
      </Typography>

      <Button
        variant="contained"
        startIcon={<ManageAccountsOutlinedIcon />}
        onClick={onManageMembers}
      >
        Assign Members
      </Button>
    </Box>
  );
}

function getTeamMembers(team, users) {
  const memberIdSet = new Set(
    Array.isArray(team.memberIds)
      ? team.memberIds.map(String)
      : [],
  );

  return users
    .filter((user) => {
      const userId = String(user.id);

      if (memberIdSet.has(userId)) {
        return true;
      }

      if (
        user.teamId !== null &&
        user.teamId !== undefined &&
        String(user.teamId) === String(team.id)
      ) {
        return true;
      }

      const assignedTeamName = String(
        user.teamName || user.team || "",
      )
        .trim()
        .toLowerCase();

      return (
        assignedTeamName !== "" &&
        assignedTeamName ===
          String(team.name).trim().toLowerCase()
      );
    })
    .sort((firstUser, secondUser) => {
      const firstIsManager =
        String(firstUser.id) ===
        String(team.managerId);

      const secondIsManager =
        String(secondUser.id) ===
        String(team.managerId);

      if (firstIsManager && !secondIsManager) {
        return -1;
      }

      if (!firstIsManager && secondIsManager) {
        return 1;
      }

      return getUserName(firstUser).localeCompare(
        getUserName(secondUser),
      );
    });
}

function getUserName(user) {
  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    user.name ||
    user.email ||
    "Unnamed employee"
  );
}

function getInitials(user) {
  const name = getUserName(user);

  const parts = name
    .split(" ")
    .filter(Boolean);

  const firstInitial =
    parts[0]?.charAt(0) || "";

  const lastInitial =
    parts.length > 1
      ? parts[parts.length - 1].charAt(0)
      : "";

  return (
    `${firstInitial}${lastInitial}`.toUpperCase() ||
    "U"
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  const date = new Date(
    `${dateValue}T00:00:00`,
  );

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