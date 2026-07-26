import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import EvaluationStatusBadge from "./EvaluationStatusBadge";
import ScoreBadge from "./ScoreBadge";

const columns = [
  {
    id: "employeeName",
    label: "Employee",
  },
  {
    id: "reviewPeriod",
    label: "Review Period",
  },
  {
    id: "teamName",
    label: "Team",
  },
  {
    id: "evaluatorName",
    label: "Evaluator",
  },
  {
    id: "taskCompletionRate",
    label: "Task Completion",
  },
  {
    id: "onTimeSubmissionRate",
    label: "On-Time Plans",
  },
  {
    id: "overallScore",
    label: "Overall Score",
  },
  {
    id: "status",
    label: "Status",
  },
];

function PerformanceTable({
  evaluations = [],
  onViewEvaluation,
}) {
  const [sortBy, setSortBy] =
    useState("reviewPeriod");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  useEffect(() => {
    setPage(0);
  }, [evaluations]);

  const sortedEvaluations = useMemo(() => {
    return [...evaluations].sort(
      (firstEvaluation, secondEvaluation) => {
        const firstValue = getSortValue(
          firstEvaluation,
          sortBy,
        );

        const secondValue = getSortValue(
          secondEvaluation,
          sortBy,
        );

        const comparison = compareValues(
          firstValue,
          secondValue,
        );

        return sortDirection === "asc"
          ? comparison
          : -comparison;
      },
    );
  }, [
    evaluations,
    sortBy,
    sortDirection,
  ]);

  const paginatedEvaluations = useMemo(() => {
    const startIndex = page * rowsPerPage;

    return sortedEvaluations.slice(
      startIndex,
      startIndex + rowsPerPage,
    );
  }, [
    sortedEvaluations,
    page,
    rowsPerPage,
  ]);

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

  if (evaluations.length === 0) {
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
          <AssessmentOutlinedIcon />
        </Avatar>

        <Typography variant="h6">
          No evaluations found
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
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
        <Table sx={{ minWidth: 1260 }}>
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
            {paginatedEvaluations.map(
              (evaluation) => (
                <TableRow
                  key={evaluation.id}
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
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#e4e7ec",
                          color: "#344054",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(
                          evaluation.employeeName,
                        )}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {evaluation.employeeName}
                        </Typography>

                        <Typography
                          noWrap
                          color="text.secondary"
                          sx={{
                            maxWidth: 210,
                            fontSize: 12,
                          }}
                        >
                          {evaluation.employeeJobTitle ||
                            evaluation.employeeEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {evaluation.reviewPeriod}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.25,
                        fontSize: 12,
                      }}
                    >
                      {formatShortDate(
                        evaluation.periodStart,
                      )}
                      {" - "}
                      {formatShortDate(
                        evaluation.periodEnd,
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {evaluation.teamName}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.25,
                        fontSize: 12,
                      }}
                    >
                      {evaluation.department}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {evaluation.evaluatorName ||
                      "Not assigned"}
                  </TableCell>

                  <TableCell>
                    <PercentageValue
                      value={
                        evaluation.taskCompletionRate
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <PercentageValue
                      value={
                        evaluation.onTimeSubmissionRate
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <ScoreBadge
                      score={
                        evaluation.overallScore
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <EvaluationStatusBadge
                      status={evaluation.status}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={
                        <VisibilityOutlinedIcon />
                      }
                      onClick={() =>
                        onViewEvaluation?.(
                          evaluation,
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedEvaluations.length}
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
        labelRowsPerPage="Evaluations per page:"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fcfcfd",
        }}
      />
    </Paper>
  );
}

function PercentageValue({ value }) {
  const normalizedValue = Math.min(
    100,
    Math.max(0, Number(value) || 0),
  );

  return (
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {Math.round(normalizedValue)}%
    </Typography>
  );
}

function getSortValue(evaluation, sortBy) {
  if (
    sortBy === "periodStart" ||
    sortBy === "periodEnd" ||
    sortBy === "createdAt" ||
    sortBy === "updatedAt"
  ) {
    return new Date(
      evaluation[sortBy],
    ).getTime();
  }

  if (sortBy === "reviewPeriod") {
    return new Date(
      `${evaluation.periodStart}T00:00:00`,
    ).getTime();
  }

  return evaluation[sortBy] ?? "";
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

function getInitials(name) {
  const parts = String(name || "")
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

function formatShortDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(
    `${dateValue}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default PerformanceTable;