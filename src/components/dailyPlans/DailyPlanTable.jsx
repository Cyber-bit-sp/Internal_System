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

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import DailyPlanStatusBadge from "./DailyPlanStatusBadge";
import ProgressBar from "./ProgressBar";

const columns = [
  {
    id: "employeeName",
    label: "Employee",
  },
  {
    id: "planDate",
    label: "Date",
  },
  {
    id: "teamName",
    label: "Team",
  },
  {
    id: "taskCount",
    label: "Tasks",
  },
  {
    id: "progress",
    label: "Progress",
  },
  {
    id: "totalEstimatedHours",
    label: "Estimated",
  },
  {
    id: "totalActualHours",
    label: "Actual",
  },
  {
    id: "status",
    label: "Status",
  },
];

function DailyPlanTable({ plans = [], onViewPlan }) {
  const [sortBy, setSortBy] = useState("planDate");

  const [sortDirection, setSortDirection] = useState("desc");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0);
  }, [plans]);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((firstPlan, secondPlan) => {
      const firstValue = getSortValue(firstPlan, sortBy);

      const secondValue = getSortValue(secondPlan, sortBy);

      const comparison = compareValues(firstValue, secondValue);

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [plans, sortBy, sortDirection]);

  const paginatedPlans = useMemo(() => {
    const startIndex = page * rowsPerPage;

    return sortedPlans.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedPlans, page, rowsPerPage]);

  function handleSort(columnId) {
    if (sortBy === columnId) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc",
      );
    } else {
      setSortBy(columnId);
      setSortDirection("asc");
    }

    setPage(0);
  }

  if (plans.length === 0) {
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
        <Avatar
          sx={{
            width: 54,
            height: 54,
            mx: "auto",
            mb: 2,
            color: "primary.main",
            backgroundColor: "primary.light",
          }}
        >
          <AssignmentOutlinedIcon />
        </Avatar>

        <Typography variant="h6">No daily plans found</Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Change or clear the current filters.
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
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 1220 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isActive = sortBy === column.id;

                return (
                  <TableCell
                    key={column.id}
                    sortDirection={isActive ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={isActive}
                      direction={isActive ? sortDirection : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPlans.map((plan) => (
              <TableRow
                key={plan.id}
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#e4e7ec",
                        color: "#344054",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(plan.employeeName)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {plan.employeeName}
                      </Typography>

                      <Typography
                        noWrap
                        color="text.secondary"
                        sx={{
                          maxWidth: 210,
                          fontSize: 12,
                        }}
                      >
                        {plan.employeeEmail}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell>{formatDate(plan.planDate)}</TableCell>

                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {plan.teamName}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.25,
                      fontSize: 12,
                    }}
                  >
                    {plan.department}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {plan.completedTaskCount}/{plan.taskCount}
                  </Typography>
                </TableCell>

                <TableCell>
                  <ProgressBar value={plan.progress} />
                </TableCell>

                <TableCell>{formatHours(plan.totalEstimatedHours)}</TableCell>

                <TableCell>{formatHours(plan.totalActualHours)}</TableCell>

                <TableCell>
                  <DailyPlanStatusBadge status={plan.status} />
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={() => onViewPlan?.(plan)}
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
        count={sortedPlans.length}
        page={page}
        onPageChange={(event, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Plans per page:"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fcfcfd",
        }}
      />
    </Paper>
  );
}

function getSortValue(plan, sortBy) {
  if (
    sortBy === "planDate" ||
    sortBy === "createdAt" ||
    sortBy === "updatedAt"
  ) {
    return new Date(
      sortBy === "planDate" ? `${plan[sortBy]}T00:00:00` : plan[sortBy],
    ).getTime();
  }

  return plan[sortBy] ?? "";
}

function compareValues(firstValue, secondValue) {
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getInitials(name) {
  const parts = String(name || "")
    .split(" ")
    .filter(Boolean);

  const firstInitial = parts[0]?.charAt(0) || "";

  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
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
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0h";
  }

  return `${number}h`;
}

export default DailyPlanTable;
