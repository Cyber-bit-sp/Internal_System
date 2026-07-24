import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { teams as initialTeams } from "../data/teams";
import { users as initialUsers } from "../data/users";

import AppSnackbar from "../components/common/AppSnackbar";
import CreateTeamDialog from "../components/teams/CreateTeamDialog";
import TeamFilters from "../components/teams/TeamFilters";
import TeamTable from "../components/teams/TeamTable";
import TeamDetailsDialog from "../components/teams/TeamDetailsDialog";
import EditTeamDialog from "../components/teams/EditTeamDialog";
import TeamStatusDialog from "../components/teams/TeamStatusDialog";
import TeamMembersDialog from "../components/teams/TeamMembersDialog";

import { loadUsers, saveUsers } from "../utils/userStorage";
import { loadTeams, resetStoredTeams, saveTeams } from "../utils/teamStorage";

function SummaryCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: "flex",
              width: 44,
              height: 44,
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

          <Box>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                color: "text.primary",
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TeamsPage() {
  const [teamList, setTeamList] = useState(() => loadTeams(initialTeams));

  const [userList, setUserList] = useState(() => loadUsers(initialUsers));

  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [membersTeam, setMembersTeam] = useState(null);

  const [department, setDepartment] = useState("all");

  const [status, setStatus] = useState("all");
  const [editingTeam, setEditingTeam] = useState(null);
  const [statusTeam, setStatusTeam] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    saveTeams(teamList);
  }, [teamList]);

  useEffect(() => {
    saveUsers(userList);
  }, [userList]);

  const departments = useMemo(() => {
    return [
      ...new Set(teamList.map((team) => team.department).filter(Boolean)),
    ].sort();
  }, [teamList]);

  const filteredTeams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return teamList.filter((team) => {
      const matchesSearch =
        normalizedSearch === "" ||
        String(team.name || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(team.code || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(team.department || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(team.managerName || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        department === "all" || team.department === department;

      const matchesStatus = status === "all" || team.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teamList, searchTerm, department, status]);

  const activeTeamCount = useMemo(() => {
    return teamList.filter((team) => team.status === "Active").length;
  }, [teamList]);

  const archivedTeamCount = useMemo(() => {
    return teamList.filter((team) => team.status === "Archived").length;
  }, [teamList]);

  const totalMemberCount = useMemo(() => {
    return teamList.reduce(
      (total, team) => total + Number(team.memberCount || 0),
      0,
    );
  }, [teamList]);

  function showNotification(message, severity = "success") {
    setNotification({
      open: true,
      message,
      severity,
    });
  }

  function handleSaveTeamMembers({ team, memberIds }) {
    const selectedIdSet = new Set(memberIds.map(String));

    const updatedUsers = userList.map((user) => {
      const userId = String(user.id);

      const belongsToCurrentTeam =
        String(user.teamId || "") === String(team.id) ||
        String(user.teamName || "").toLowerCase() ===
          String(team.name).toLowerCase() ||
        String(user.team || "").toLowerCase() ===
          String(team.name).toLowerCase();

      if (selectedIdSet.has(userId)) {
        return {
          ...user,
          teamId: team.id,
          teamName: team.name,
          team: team.name,
        };
      }

      if (belongsToCurrentTeam) {
        return {
          ...user,
          teamId: null,
          teamName: "",
          team: "",
        };
      }

      return user;
    });

    const updatedTeams = teamList.map((currentTeam) => {
      if (currentTeam.id === team.id) {
        return {
          ...currentTeam,
          memberIds,
          memberCount: memberIds.length,
        };
      }

      if (!Array.isArray(currentTeam.memberIds)) {
        return currentTeam;
      }

      const remainingMemberIds = currentTeam.memberIds.filter(
        (memberId) => !selectedIdSet.has(String(memberId)),
      );

      return {
        ...currentTeam,
        memberIds: remainingMemberIds,
        memberCount: remainingMemberIds.length,
      };
    });

    const updatedCurrentTeam = updatedTeams.find(
      (currentTeam) => currentTeam.id === team.id,
    );

    setUserList(updatedUsers);
    setTeamList(updatedTeams);

    setSelectedTeam((currentSelectedTeam) =>
      currentSelectedTeam?.id === team.id
        ? updatedCurrentTeam
        : currentSelectedTeam,
    );

    setMembersTeam(null);

    showNotification(`${team.name} now has ${memberIds.length} members.`);
  }

  function handleTeamStatusUpdate(updatedTeam) {
    setTeamList((currentTeams) =>
      currentTeams.map((team) =>
        team.id === updatedTeam.id ? updatedTeam : team,
      ),
    );

    setSelectedTeam((currentSelectedTeam) =>
      currentSelectedTeam?.id === updatedTeam.id
        ? updatedTeam
        : currentSelectedTeam,
    );

    setStatusTeam(null);

    const action = updatedTeam.status === "Active" ? "restored" : "archived";

    showNotification(
      `${updatedTeam.name} was ${action}.`,
      updatedTeam.status === "Active" ? "success" : "warning",
    );
  }

  function closeNotification() {
    setNotification((currentNotification) => ({
      ...currentNotification,
      open: false,
    }));
  }

  function handleCreateTeam(newTeam) {
    setTeamList((currentTeams) => [newTeam, ...currentTeams]);

    setIsCreateTeamOpen(false);

    showNotification(`${newTeam.name} was created successfully.`);
  }

  function handleUpdateTeam(updatedTeam) {
    setTeamList((currentTeams) =>
      currentTeams.map((team) =>
        team.id === updatedTeam.id ? updatedTeam : team,
      ),
    );

    setSelectedTeam((currentSelectedTeam) =>
      currentSelectedTeam?.id === updatedTeam.id
        ? updatedTeam
        : currentSelectedTeam,
    );

    setEditingTeam(null);

    showNotification(`${updatedTeam.name} was updated successfully.`);
  }

  function handleResetTeams() {
    resetStoredTeams();
    setEditingTeam(null);
    setStatusTeam(null);

    setTeamList(
      initialTeams.map((team) => ({
        ...team,
      })),
    );

    setSelectedTeam(null);
    setSearchTerm("");
    setDepartment("all");
    setStatus("all");
    setIsCreateTeamOpen(false);

    showNotification("Demo team data was reset successfully.", "info");
  }

  function clearFilters() {
    setSearchTerm("");
    setDepartment("all");
    setStatus("all");
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3.5 }}
        >
          <Box>
            <Typography variant="h4">Team Management</Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create teams, assign managers, and organize employees.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={handleResetTeams}
            >
              Reset Demo Data
            </Button>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setIsCreateTeamOpen(true)}
            >
              Create Team
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 2.25,
            mb: 3,
          }}
        >
          <SummaryCard
            title="Total Teams"
            value={teamList.length}
            icon={<GroupsOutlinedIcon />}
          />

          <SummaryCard
            title="Active Teams"
            value={activeTeamCount}
            icon={<GroupsOutlinedIcon />}
          />

          <SummaryCard
            title="Archived Teams"
            value={archivedTeamCount}
            icon={<ArchiveOutlinedIcon />}
          />

          <SummaryCard
            title="Team Members"
            value={totalMemberCount}
            icon={<PeopleOutlineRoundedIcon />}
          />
        </Box>

        <TeamFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          department={department}
          onDepartmentChange={setDepartment}
          status={status}
          onStatusChange={setStatus}
          departments={departments}
          onClearFilters={clearFilters}
        />

        <Typography
          color="text.secondary"
          sx={{
            mb: 1.25,
            textAlign: "right",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Showing {filteredTeams.length} of {teamList.length} teams
        </Typography>

        <TeamTable teams={filteredTeams} onViewTeam={setSelectedTeam} />
        <TeamDetailsDialog
          team={selectedTeam}
          isOpen={Boolean(selectedTeam)}
          onClose={() => setSelectedTeam(null)}
          onEdit={(team) => {
            setSelectedTeam(null);
            setEditingTeam(team);
          }}
          onChangeStatus={setStatusTeam}
          onManageMembers={(team) => {
            setSelectedTeam(null);
            setMembersTeam(team);
          }}
        />

        <TeamStatusDialog
          team={statusTeam}
          isOpen={Boolean(statusTeam)}
          onClose={() => setStatusTeam(null)}
          onConfirm={handleTeamStatusUpdate}
        />

        <EditTeamDialog
          team={editingTeam}
          isOpen={Boolean(editingTeam)}
          onClose={() => setEditingTeam(null)}
          onUpdateTeam={handleUpdateTeam}
          existingTeams={teamList}
          users={userList}
        />

        <CreateTeamDialog
          isOpen={isCreateTeamOpen}
          onClose={() => setIsCreateTeamOpen(false)}
          onCreateTeam={handleCreateTeam}
          existingTeams={teamList}
          users={userList}
        />

        <AppSnackbar
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={closeNotification}
        />
      </Container>
    </Box>
  );
}

export default TeamsPage;
