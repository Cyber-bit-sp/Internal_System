import { useMemo, useState } from "react";
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

import { teams as initialTeams } from "../data/teams";

import TeamFilters from "../components/teams/TeamFilters";
import TeamTable from "../components/teams/TeamTable";

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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
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
  const [teamList] = useState(initialTeams);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [department, setDepartment] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const departments = useMemo(() => {
    return [
      ...new Set(
        teamList
          .map((team) => team.department)
          .filter(Boolean),
      ),
    ].sort();
  }, [teamList]);

  const filteredTeams = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return teamList.filter((team) => {
      const matchesSearch =
        normalizedSearch === "" ||
        team.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        team.code
          .toLowerCase()
          .includes(normalizedSearch) ||
        team.department
          .toLowerCase()
          .includes(normalizedSearch) ||
        team.managerName
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        department === "all" ||
        team.department === department;

      const matchesStatus =
        status === "all" ||
        team.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    teamList,
    searchTerm,
    department,
    status,
  ]);

  const activeTeamCount = teamList.filter(
    (team) => team.status === "Active",
  ).length;

  const archivedTeamCount = teamList.filter(
    (team) => team.status === "Archived",
  ).length;

  const totalMemberCount = teamList.reduce(
    (total, team) =>
      total + team.memberCount,
    0,
  );

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
            <Typography variant="h4">
              Team Management
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Create teams, assign managers, and organize
              employees.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() =>
              console.log("Create team")
            }
          >
            Create Team
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
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
          Showing {filteredTeams.length} of{" "}
          {teamList.length} teams
        </Typography>

        <TeamTable
          teams={filteredTeams}
          onViewTeam={(team) =>
            console.log("View team:", team)
          }
        />
      </Container>
    </Box>
  );
}

export default TeamsPage;