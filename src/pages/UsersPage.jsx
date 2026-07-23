import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { users as initialUsers } from "../data/users";

import AppSnackbar from "../components/common/AppSnackbar";
import AddUserModal from "../components/users/AddUserModal";
import BulkUserStatusDialog from "../components/users/BulkUserStatusDialog";
import EditUserDialog from "../components/users/EditUserDialog";
import UserDetailsDialog from "../components/users/UserDetailsDialog";
import UserFilters from "../components/users/UserFilters";
import UserStatusDialog from "../components/users/UserStatusDialog";
import UserTable from "../components/users/UserTable";

import { loadUsers, resetStoredUsers, saveUsers } from "../utils/userStorage";

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

function UsersPage() {
  const [userList, setUserList] = useState(() => loadUsers(initialUsers));

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editingUser, setEditingUser] = useState(null);

  const [statusUser, setStatusUser] = useState(null);

  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [bulkStatus, setBulkStatus] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [department, setDepartment] = useState("all");

  const [role, setRole] = useState("all");

  const [status, setStatus] = useState("all");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    saveUsers(userList);
  }, [userList]);

  useEffect(() => {
    setSelectedUserIds((currentSelectedIds) =>
      currentSelectedIds.filter((selectedId) =>
        userList.some((user) => user.id === selectedId),
      ),
    );
  }, [userList]);

  const departments = useMemo(() => {
    return [
      ...new Set(userList.map((user) => user.department).filter(Boolean)),
    ].sort();
  }, [userList]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return userList.filter((user) => {
      const fullName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        fullName.includes(normalizedSearch) ||
        String(user.email || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(user.employeeId || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(user.jobTitle || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        department === "all" || user.department === department;

      const matchesRole = role === "all" || user.role === role;

      const matchesStatus = status === "all" || user.status === status;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [userList, searchTerm, department, role, status]);

  const activeUserCount = useMemo(() => {
    return userList.filter((user) => user.status === "Active").length;
  }, [userList]);

  function showNotification(message, severity = "success") {
    setNotification({
      open: true,
      message,
      severity,
    });
  }

  function closeNotification() {
    setNotification((currentNotification) => ({
      ...currentNotification,
      open: false,
    }));
  }

  function handleAddUser(newUser) {
    setUserList((currentUsers) => [newUser, ...currentUsers]);

    setIsAddUserOpen(false);

    showNotification(
      `${newUser.firstName} ${newUser.lastName} was added successfully.`,
    );
  }

  function handleUpdateUser(updatedUser) {
    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );

    setSelectedUser((currentSelectedUser) =>
      currentSelectedUser?.id === updatedUser.id
        ? updatedUser
        : currentSelectedUser,
    );

    setEditingUser(null);

    showNotification(
      `${updatedUser.firstName} ${updatedUser.lastName} was updated successfully.`,
    );
  }

  function handleStatusUpdate(updatedUser) {
    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );

    setSelectedUser((currentSelectedUser) =>
      currentSelectedUser?.id === updatedUser.id
        ? updatedUser
        : currentSelectedUser,
    );

    setStatusUser(null);

    const action =
      updatedUser.status === "Active" ? "activated" : "deactivated";

    showNotification(
      `${updatedUser.firstName} ${updatedUser.lastName} was ${action}.`,
      updatedUser.status === "Active" ? "success" : "warning",
    );
  }

  function handleBulkStatusUpdate() {
    if (!bulkStatus || selectedUserIds.length === 0) {
      return;
    }

    const affectedUserCount = selectedUserIds.length;

    const nextStatus = bulkStatus;

    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        selectedUserIds.includes(user.id)
          ? {
              ...user,
              status: nextStatus,
            }
          : user,
      ),
    );

    setSelectedUser((currentSelectedUser) => {
      if (
        !currentSelectedUser ||
        !selectedUserIds.includes(currentSelectedUser.id)
      ) {
        return currentSelectedUser;
      }

      return {
        ...currentSelectedUser,
        status: nextStatus,
      };
    });

    setSelectedUserIds([]);
    setBulkStatus(null);

    const action = nextStatus === "Active" ? "activated" : "deactivated";

    showNotification(
      `${affectedUserCount} ${
        affectedUserCount === 1 ? "user was" : "users were"
      } ${action}.`,
      nextStatus === "Active" ? "success" : "warning",
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setDepartment("all");
    setRole("all");
    setStatus("all");
    setSelectedUserIds([]);
  }

  function handleResetUsers() {
    resetStoredUsers();

    setUserList(
      initialUsers.map((user) => ({
        ...user,
      })),
    );

    setSelectedUser(null);
    setEditingUser(null);
    setStatusUser(null);
    setSelectedUserIds([]);
    setBulkStatus(null);
    setIsAddUserOpen(false);

    setSearchTerm("");
    setDepartment("all");
    setRole("all");
    setStatus("all");

    showNotification("Demo user data was reset successfully.", "info");
  }

  return (
    <Box
      sx={{
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "stretch",
            sm: "flex-start",
          }}
          justifyContent="space-between"
          spacing={2}
          sx={{
            mb: 3.5,
          }}
        >
          <Box>
            <Typography variant="h4">User Management</Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Manage employees, roles, teams, and account status.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={handleResetUsers}
            >
              Reset Demo Data
            </Button>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setIsAddUserOpen(true)}
            >
              Add User
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.25,
            mb: 3,
          }}
        >
          <SummaryCard
            title="Total Users"
            value={userList.length}
            icon={<PeopleOutlineRoundedIcon />}
          />

          <SummaryCard
            title="Active Users"
            value={activeUserCount}
            icon={<CheckCircleOutlineRoundedIcon />}
          />

          <SummaryCard
            title="Filtered Results"
            value={filteredUsers.length}
            icon={<FilterAltOutlinedIcon />}
          />
        </Box>

        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          department={department}
          onDepartmentChange={setDepartment}
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
          departments={departments}
          onClearFilters={clearFilters}
        />

        <Typography
          color="text.secondary"
          sx={{
            mb: 1.25,
            textAlign: {
              xs: "left",
              sm: "right",
            },
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Showing {filteredUsers.length} of {userList.length} users
        </Typography>

        {selectedUserIds.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              p: 2,
              mb: 2,
              borderColor: "primary.light",
              backgroundColor: "#eff6ff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                sx={{
                  color: "primary.dark",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {selectedUserIds.length}{" "}
                {selectedUserIds.length === 1 ? "user" : "users"} selected
              </Typography>

              <IconButton
                size="small"
                aria-label="Clear selected users"
                onClick={() => setSelectedUserIds([])}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              <Button
                color="success"
                variant="outlined"
                startIcon={<CheckCircleOutlineRoundedIcon />}
                onClick={() => setBulkStatus("Active")}
              >
                Activate
              </Button>

              <Button
                color="error"
                variant="outlined"
                startIcon={<BlockOutlinedIcon />}
                onClick={() => setBulkStatus("Inactive")}
              >
                Deactivate
              </Button>
            </Stack>
          </Paper>
        )}

        <UserTable
          users={filteredUsers}
          onViewUser={setSelectedUser}
          onChangeStatus={setStatusUser}
          selectedUserIds={selectedUserIds}
          onSelectionChange={setSelectedUserIds}
        />

        <BulkUserStatusDialog
          isOpen={Boolean(bulkStatus)}
          userCount={selectedUserIds.length}
          nextStatus={bulkStatus}
          onClose={() => setBulkStatus(null)}
          onConfirm={handleBulkStatusUpdate}
        />

        <UserDetailsDialog
          user={selectedUser}
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          onEdit={(user) => {
            setSelectedUser(null);
            setEditingUser(user);
          }}
          onChangeStatus={setStatusUser}
        />

        <UserStatusDialog
          user={statusUser}
          isOpen={Boolean(statusUser)}
          onClose={() => setStatusUser(null)}
          onConfirm={handleStatusUpdate}
        />

        <EditUserDialog
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onUpdateUser={handleUpdateUser}
          existingUsers={userList}
        />

        <AddUserModal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onAddUser={handleAddUser}
          existingUsers={userList}
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

export default UsersPage;
