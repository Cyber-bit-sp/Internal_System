import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function TeamMembersDialog({
  team,
  users = [],
  teams = [],
  isOpen,
  onClose,
  onSave,
}) {
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("all");

  useEffect(() => {
    if (!team) {
      return;
    }

    const savedMemberIds = Array.isArray(team.memberIds)
      ? team.memberIds.map(String)
      : [];

    const managerId =
      team.managerId !== null && team.managerId !== undefined
        ? String(team.managerId)
        : null;

    // The manager must always remain a member of the team.
    const initialMemberIds =
      managerId && !savedMemberIds.includes(managerId)
        ? [...savedMemberIds, managerId]
        : savedMemberIds;

    setSelectedMemberIds(initialMemberIds);
    setSearchTerm("");
    setDepartment("all");
  }, [team, isOpen]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        users
          .map((user) => user.department)
          .filter(Boolean),
      ),
    ].sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const fullName = getUserName(user);
      const userDepartment = user.department || "";
      const jobTitle = user.jobTitle || user.role || "";
      const email = user.email || "";

      const matchesSearch =
        normalizedSearch === "" ||
        fullName.toLowerCase().includes(normalizedSearch) ||
        userDepartment
          .toLowerCase()
          .includes(normalizedSearch) ||
        jobTitle.toLowerCase().includes(normalizedSearch) ||
        email.toLowerCase().includes(normalizedSearch);

      const matchesDepartment =
        department === "all" ||
        userDepartment === department;

      return matchesSearch && matchesDepartment;
    });
  }, [users, searchTerm, department]);

  if (!team) {
    return null;
  }

  const managerId =
    team.managerId !== null && team.managerId !== undefined
      ? String(team.managerId)
      : null;

  const selectedIdSet = new Set(selectedMemberIds);

  const selectableVisibleUsers = filteredUsers.filter((user) => {
    const userId = String(user.id);
    const isManager = managerId === userId;

    return (
      !isManager &&
      (user.status === "Active" || selectedIdSet.has(userId))
    );
  });

  const visibleSelectableIds = selectableVisibleUsers.map((user) =>
    String(user.id),
  );

  const allVisibleSelected =
    visibleSelectableIds.length > 0 &&
    visibleSelectableIds.every((id) =>
      selectedIdSet.has(id),
    );

  const someVisibleSelected =
    visibleSelectableIds.some((id) =>
      selectedIdSet.has(id),
    ) && !allVisibleSelected;

  function handleToggleUser(user) {
    const userId = String(user.id);
    const isTeamManager = userId === managerId;
    const isSelected = selectedIdSet.has(userId);

    // The manager cannot be removed.
    if (isTeamManager && isSelected) {
      return;
    }

    // Inactive employees cannot be newly assigned.
    if (user.status !== "Active" && !isSelected) {
      return;
    }

    setSelectedMemberIds((currentIds) => {
      if (currentIds.includes(userId)) {
        return currentIds.filter((id) => id !== userId);
      }

      return [...currentIds, userId];
    });
  }

  function handleToggleAllVisible() {
    setSelectedMemberIds((currentIds) => {
      const currentSet = new Set(currentIds);

      if (allVisibleSelected) {
        visibleSelectableIds.forEach((id) => {
          currentSet.delete(id);
        });
      } else {
        visibleSelectableIds.forEach((id) => {
          currentSet.add(id);
        });
      }

      // Always preserve the team manager.
      if (managerId) {
        currentSet.add(managerId);
      }

      return [...currentSet];
    });
  }

  function handleClearAll() {
    if (!managerId) {
      setSelectedMemberIds([]);
      return;
    }

    setSelectedMemberIds([managerId]);
  }

  function handleSave() {
    const nextMemberIds = [...new Set(selectedMemberIds.map(String))];

    if (managerId && !nextMemberIds.includes(managerId)) {
      nextMemberIds.push(managerId);
    }

    onSave?.({
      team,
      memberIds: nextMemberIds,
    });
  }

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
            height: "min(820px, calc(100vh - 80px))",
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2.5 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.75}
          >
            <Box
              sx={{
                display: "flex",
                width: 46,
                height: 46,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                borderRadius: 2,
                color: "primary.main",
                backgroundColor: "primary.light",
              }}
            >
              <PersonAddAltOutlinedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Manage Team Members
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                {team.name} · {selectedMemberIds.length} selected
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close member management"
            onClick={onClose}
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
        {!Array.isArray(team.memberIds) && (
          <Alert severity="info" sx={{ mb: 2.5 }}>
            This team previously stored only a member count.
            Select the individual employees who belong to this
            team, then save the assignment.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "minmax(320px, 2fr) minmax(200px, 1fr)",
            gap: 2,
            mb: 2.5,
          }}
        >
          <TextField
            fullWidth
            label="Search employees"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search name, email, job title, or department"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      color="action"
                      fontSize="small"
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            fullWidth
            label="Department"
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
          >
            <MenuItem value="all">
              All departments
            </MenuItem>

            {departments.map((departmentName) => (
              <MenuItem
                key={departmentName}
                value={departmentName}
              >
                {departmentName}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "#f9fafb",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <Checkbox
                checked={allVisibleSelected}
                indeterminate={someVisibleSelected}
                disabled={visibleSelectableIds.length === 0}
                onChange={handleToggleAllVisible}
                slotProps={{
                  input: {
                    "aria-label":
                      "Select all visible employees",
                  },
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Select all visible employees
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 12,
                  }}
                >
                  {filteredUsers.length} employees shown
                </Typography>
              </Box>
            </Stack>

            <Button
              size="small"
              color="inherit"
              disabled={
                managerId
                  ? selectedMemberIds.length <= 1
                  : selectedMemberIds.length === 0
              }
              onClick={handleClearAll}
            >
              Clear selection
            </Button>
          </Stack>

          <Box>
            {filteredUsers.length === 0 ? (
              <Box
                sx={{
                  px: 3,
                  py: 7,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  No employees found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.75,
                    fontSize: 14,
                  }}
                >
                  Change the search or department filter.
                </Typography>
              </Box>
            ) : (
              filteredUsers.map((user, index) => {
                const userId = String(user.id);
                const isSelected =
                  selectedIdSet.has(userId);

                const isInactive =
                  user.status !== "Active";

                const isTeamManager =
                  userId === managerId;

                const assignedTeam =
                  findAssignedTeam(user, teams);

                const assignedElsewhere =
                  assignedTeam &&
                  String(assignedTeam.id) !==
                    String(team.id);

                const cannotSelect =
                  isTeamManager ||
                  (isInactive && !isSelected);

                return (
                  <Box
                    key={user.id}
                    onClick={() =>
                      handleToggleUser(user)
                    }
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "auto minmax(260px, 1.4fr) minmax(160px, 1fr) minmax(160px, 1fr)",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      cursor: cannotSelect
                        ? "default"
                        : "pointer",
                      opacity:
                        isInactive && !isSelected
                          ? 0.55
                          : 1,
                      backgroundColor: isSelected
                        ? "rgba(37, 99, 235, 0.05)"
                        : "background.paper",
                      borderBottom:
                        index === filteredUsers.length - 1
                          ? 0
                          : "1px solid",
                      borderColor: "divider",

                      "&:hover": {
                        backgroundColor: cannotSelect
                          ? isSelected
                            ? "rgba(37, 99, 235, 0.05)"
                            : "background.paper"
                          : isSelected
                            ? "rgba(37, 99, 235, 0.08)"
                            : "#f9fafb",
                      },
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={
                        isTeamManager ||
                        (isInactive && !isSelected)
                      }
                      onChange={() =>
                        handleToggleUser(user)
                      }
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      slotProps={{
                        input: {
                          "aria-label": `Select ${getUserName(
                            user,
                          )}`,
                        },
                      }}
                    />

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ minWidth: 0 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: isSelected
                            ? "primary.main"
                            : "#e4e7ec",
                          color: isSelected
                            ? "#ffffff"
                            : "#344054",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(user)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {getUserName(user)}
                        </Typography>

                        <Typography
                          noWrap
                          color="text.secondary"
                          sx={{
                            fontSize: 12,
                          }}
                        >
                          {user.email || "No email"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ minWidth: 0 }}>
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
                          fontSize: 12,
                        }}
                      >
                        {user.department ||
                          "No department"}
                      </Typography>
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      {isTeamManager ? (
                        <Chip
                          size="small"
                          label="Team Manager"
                          color="primary"
                          variant="outlined"
                        />
                      ) : assignedElsewhere ? (
                        <Chip
                          size="small"
                          label={`Currently: ${assignedTeam.name}`}
                          color="warning"
                          variant="outlined"
                          sx={{
                            maxWidth: "100%",
                          }}
                        />
                      ) : String(assignedTeam?.id) ===
                        String(team.id) ? (
                        <Chip
                          size="small"
                          label="Current member"
                          color="success"
                          variant="outlined"
                        />
                      ) : isInactive ? (
                        <Chip
                          size="small"
                          label={
                            user.status || "Inactive"
                          }
                          variant="outlined"
                        />
                      ) : (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: 12,
                          }}
                        >
                          Not assigned
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Paper>

        <Alert
          severity="warning"
          sx={{
            mt: 2.5,
          }}
        >
          Selecting an employee who belongs to another team
          will move that employee to {team.name}. The team
          manager cannot be removed from their team.
        </Alert>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 13,
          }}
        >
          {selectedMemberIds.length} employees selected
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckBoxOutlinedIcon />}
            onClick={handleSave}
          >
            Save Members
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
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
  const firstName =
    user.firstName ||
    user.name?.split(" ")[0] ||
    "";

  const lastName =
    user.lastName ||
    user.name?.split(" ").slice(-1)[0] ||
    "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase()
      .trim();

  return initials || "U";
}

function findAssignedTeam(user, teams) {
  if (
    user.teamId !== null &&
    user.teamId !== undefined
  ) {
    const teamById = teams.find(
      (team) =>
        String(team.id) ===
        String(user.teamId),
    );

    if (teamById) {
      return teamById;
    }
  }

  const savedTeamName =
    user.teamName || user.team || "";

  if (!savedTeamName) {
    return null;
  }

  const normalizedTeamName = String(
    savedTeamName,
  ).toLowerCase();

  return (
    teams.find(
      (team) =>
        String(team.name).toLowerCase() ===
          normalizedTeamName ||
        String(team.code).toLowerCase() ===
          normalizedTeamName,
    ) || null
  );
}

export default TeamMembersDialog;