import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
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

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UserStatusBadge from "./UserStatusBadge";

const columns = [
  {
    id: "fullName",
    label: "Employee",
  },
  {
    id: "employeeId",
    label: "Employee ID",
  },
  {
    id: "jobTitle",
    label: "Job Title",
  },
  {
    id: "department",
    label: "Department",
  },
  {
    id: "team",
    label: "Team",
  },
  {
    id: "role",
    label: "Role",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "joinedDate",
    label: "Joined Date",
  },
];

function UserTable({
  users = [],
  onViewUser,
  onChangeStatus,
  selectedUserIds = [],
  onSelectionChange,
}) {
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0);
  }, [users]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((firstUser, secondUser) => {
      const firstValue = getSortValue(firstUser, sortBy);
      const secondValue = getSortValue(secondUser, sortBy);

      const comparison = compareValues(firstValue, secondValue);

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [users, sortBy, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, page, rowsPerPage]);

  const currentPageUserIds = paginatedUsers.map((user) => user.id);

  const selectedCurrentPageCount = currentPageUserIds.filter((userId) =>
    selectedUserIds.includes(userId),
  ).length;

  const allCurrentPageSelected =
    currentPageUserIds.length > 0 &&
    selectedCurrentPageCount === currentPageUserIds.length;

  const someCurrentPageSelected =
    selectedCurrentPageCount > 0 &&
    selectedCurrentPageCount < currentPageUserIds.length;

  function handleSelectAllCurrentPage(event) {
    if (typeof onSelectionChange !== "function") {
      return;
    }

    if (event.target.checked) {
      const nextSelectedIds = [
        ...new Set([...selectedUserIds, ...currentPageUserIds]),
      ];

      onSelectionChange(nextSelectedIds);
      return;
    }

    const nextSelectedIds = selectedUserIds.filter(
      (userId) => !currentPageUserIds.includes(userId),
    );

    onSelectionChange(nextSelectedIds);
  }

  function handleSelectUser(userId) {
    if (typeof onSelectionChange !== "function") {
      return;
    }

    const isSelected = selectedUserIds.includes(userId);

    if (isSelected) {
      onSelectionChange(
        selectedUserIds.filter(
          (selectedId) => selectedId !== userId,
        ),
      );

      return;
    }

    onSelectionChange([...selectedUserIds, userId]);
  }

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

  function handlePageChange(event, newPage) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }

  if (users.length === 0) {
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
          No users found
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
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
        <Table
          sx={{
            minWidth: 1240,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allCurrentPageSelected}
                  indeterminate={someCurrentPageSelected}
                  onChange={handleSelectAllCurrentPage}
                  inputProps={{
                    "aria-label": "Select all users on current page",
                  }}
                />
              </TableCell>

              {columns.map((column) => (
                <SortableHeader
                  key={column.id}
                  column={column}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              ))}

              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);

              return (
                <TableRow
                  key={user.id}
                  hover
                  selected={isSelected}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectUser(user.id)}
                      inputProps={{
                        "aria-label": `Select ${user.firstName} ${user.lastName}`,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          color: "primary.dark",
                          backgroundColor: "primary.light",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {getInitial(user.firstName)}
                        {getInitial(user.lastName)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            maxWidth: 220,
                            overflow: "hidden",
                            fontSize: 13,
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>{user.jobTitle}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>{user.role}</TableCell>

                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>

                  <TableCell>
                    {formatTableDate(user.joinedDate)}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={1}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={() => onViewUser?.(user)}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        variant="text"
                        color={
                          user.status === "Active"
                            ? "error"
                            : "success"
                        }
                        onClick={() => onChangeStatus?.(user)}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedUsers.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Users per page:"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fcfcfd",
        }}
      />
    </Paper>
  );
}

function SortableHeader({
  column,
  sortBy,
  sortDirection,
  onSort,
}) {
  const isActive = sortBy === column.id;

  return (
    <TableCell
      sortDirection={isActive ? sortDirection : false}
    >
      <TableSortLabel
        active={isActive}
        direction={isActive ? sortDirection : "asc"}
        onClick={() => onSort(column.id)}
        sx={{
          "& .MuiTableSortLabel-icon": {
            fontSize: 18,
          },
        }}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  );
}

function getSortValue(user, sortBy) {
  if (sortBy === "fullName") {
    return `${user.firstName || ""} ${user.lastName || ""}`;
  }

  if (sortBy === "joinedDate") {
    if (!user.joinedDate) {
      return 0;
    }

    return new Date(`${user.joinedDate}T00:00:00`).getTime();
  }

  return user[sortBy] || "";
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

function formatTableDate(dateValue) {
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

function getInitial(value) {
  return value?.charAt(0)?.toUpperCase() || "?";
}

export default UserTable;