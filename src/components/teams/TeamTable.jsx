import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import TeamStatusBadge from "./TeamStatusBadge";

const columns = [
  {
    id: "name",
    label: "Team",
  },
  {
    id: "code",
    label: "Code",
  },
  {
    id: "department",
    label: "Department",
  },
  {
    id: "managerName",
    label: "Manager",
  },
  {
    id: "memberCount",
    label: "Members",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "createdDate",
    label: "Created",
  },
];

function TeamTable({
  teams,
  onViewTeam,
}) {
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] =
    useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  useEffect(() => {
    setPage(0);
  }, [teams]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((firstTeam, secondTeam) => {
      const firstValue = getSortValue(
        firstTeam,
        sortBy,
      );

      const secondValue = getSortValue(
        secondTeam,
        sortBy,
      );

      const comparison = compareValues(
        firstValue,
        secondValue,
      );

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [teams, sortBy, sortDirection]);

  const paginatedTeams = useMemo(() => {
    const startIndex = page * rowsPerPage;

    return sortedTeams.slice(
      startIndex,
      startIndex + rowsPerPage,
    );
  }, [sortedTeams, page, rowsPerPage]);

  function handleSort(columnId) {
    if (sortBy === columnId) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc"
          ? "desc"
          : "asc",
      );
    } else {
      setSortBy(columnId);
      setSortDirection("asc");
    }

    setPage(0);
  }

  if (teams.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          px: 3,
          py: 8,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          No teams found
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Try changing or clearing the current filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 1050 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isActive =
                  sortBy === column.id;

                return (
                  <TableCell
                    key={column.id}
                    sortDirection={
                      isActive
                        ? sortDirection
                        : false
                    }
                  >
                    <TableSortLabel
                      active={isActive}
                      direction={
                        isActive
                          ? sortDirection
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(column.id)
                      }
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}

              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTeams.map((team) => (
              <TableRow
                key={team.id}
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 42,
                        height: 42,
                        color: "primary.dark",
                        backgroundColor: "primary.light",
                      }}
                    >
                      <GroupsOutlinedIcon fontSize="small" />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "text.primary",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {team.name}
                      </Typography>

                      <Typography
                        noWrap
                        color="text.secondary"
                        sx={{
                          maxWidth: 260,
                          fontSize: 12,
                        }}
                      >
                        {team.description}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: "#f2f4f7",
                      color: "#344054",
                      fontFamily: "monospace",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {team.code}
                  </Typography>
                </TableCell>

                <TableCell>
                  {team.department}
                </TableCell>

                <TableCell>
                  {team.managerName}
                </TableCell>

                <TableCell>
                  {team.memberCount}
                </TableCell>

                <TableCell>
                  <TeamStatusBadge
                    status={team.status}
                  />
                </TableCell>

                <TableCell>
                  {formatDate(team.createdDate)}
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      <VisibilityOutlinedIcon />
                    }
                    onClick={() =>
                      onViewTeam?.(team)
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedTeams.length}
        page={page}
        onPageChange={(event, nextPage) =>
          setPage(nextPage)
        }
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(
            Number(event.target.value),
          );
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Teams per page:"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fcfcfd",
        }}
      />
    </Paper>
  );
}

function getSortValue(team, sortBy) {
  if (sortBy === "createdDate") {
    return new Date(
      `${team.createdDate}T00:00:00`,
    ).getTime();
  }

  return team[sortBy] ?? "";
}

function compareValues(firstValue, secondValue) {
  if (
    typeof firstValue === "number" &&
    typeof secondValue === "number"
  ) {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(
    String(secondValue),
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    },
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(
    new Date(`${dateValue}T00:00:00`),
  );
}

export default TeamTable;