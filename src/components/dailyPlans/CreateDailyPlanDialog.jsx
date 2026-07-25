import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

const emptyFormData = {
  employeeId: "",
  planDate: getTodayDate(),
  notes: "",
};

function createEmptyTask() {
  return {
    id: createId("task"),
    title: "",
    description: "",
    priority: "Medium",
    status: "Not Started",
    estimatedHours: "",
    actualHours: 0,
    progress: 0,
  };
}

function CreateDailyPlanDialog({
  isOpen,
  onClose,
  onCreatePlan,
  existingPlans = [],
  users = [],
  teams = [],
}) {
  const [formData, setFormData] =
    useState(emptyFormData);

  const [tasks, setTasks] = useState([
    createEmptyTask(),
  ]);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      employeeId: "",
      planDate: getTodayDate(),
      notes: "",
    });

    setTasks([createEmptyTask()]);
    setErrors({});
    setSubmitError("");
  }, [isOpen]);

  const activeUsers = useMemo(() => {
    return users
      .filter((user) => user.status === "Active")
      .sort((firstUser, secondUser) =>
        getUserName(firstUser).localeCompare(
          getUserName(secondUser),
        ),
      );
  }, [users]);

  const selectedUser = useMemo(() => {
    return users.find(
      (user) =>
        String(user.id) ===
        String(formData.employeeId),
    );
  }, [users, formData.employeeId]);

  const selectedTeam = useMemo(() => {
    if (!selectedUser) {
      return null;
    }

    return findUserTeam(selectedUser, teams);
  }, [selectedUser, teams]);

  const totalEstimatedHours = useMemo(() => {
    return tasks.reduce(
      (total, task) =>
        total +
        (Number(task.estimatedHours) || 0),
      0,
    );
  }, [tasks]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitError("");
  }

  function handleTaskChange(
    taskId,
    fieldName,
    value,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [fieldName]: value,
            }
          : task,
      ),
    );

    setErrors((currentErrors) => ({
      ...currentErrors,
      tasks: "",
    }));

    setSubmitError("");
  }

  function handleAddTask() {
    setTasks((currentTasks) => [
      ...currentTasks,
      createEmptyTask(),
    ]);
  }

  function handleRemoveTask(taskId) {
    setTasks((currentTasks) => {
      if (currentTasks.length === 1) {
        return currentTasks;
      }

      return currentTasks.filter(
        (task) => task.id !== taskId,
      );
    });
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.employeeId) {
      nextErrors.employeeId =
        "Employee is required.";
    }

    if (!formData.planDate) {
      nextErrors.planDate =
        "Plan date is required.";
    }

    if (
      formData.employeeId &&
      formData.planDate
    ) {
      const duplicatePlan =
        existingPlans.some(
          (plan) =>
            String(plan.employeeId) ===
              String(formData.employeeId) &&
            plan.planDate === formData.planDate,
        );

      if (duplicatePlan) {
        nextErrors.planDate =
          "This employee already has a plan for this date.";
      }
    }

    if (!selectedTeam) {
      nextErrors.employeeId =
        "The selected employee must belong to a team.";
    }

    if (tasks.length === 0) {
      nextErrors.tasks =
        "At least one task is required.";
    } else {
      const hasEmptyTitle = tasks.some(
        (task) => !task.title.trim(),
      );

      const hasInvalidHours = tasks.some(
        (task) => {
          const hours = Number(
            task.estimatedHours,
          );

          return (
            task.estimatedHours === "" ||
            !Number.isFinite(hours) ||
            hours <= 0 ||
            hours > 24
          );
        },
      );

      if (hasEmptyTitle) {
        nextErrors.tasks =
          "Every task must have a title.";
      } else if (hasInvalidHours) {
        nextErrors.tasks =
          "Estimated hours must be between 0 and 24.";
      }
    }

    if (totalEstimatedHours > 24) {
      nextErrors.tasks =
        "Total estimated hours cannot exceed 24 hours.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      setSubmitError(
        "Please correct the highlighted fields.",
      );
      return;
    }

    const now = new Date().toISOString();

    const preparedTasks = tasks.map(
      (task, index) => ({
        ...task,
        id: task.id || createId("task"),
        order: index + 1,
        title: task.title.trim(),
        description:
          task.description.trim(),
        estimatedHours: Number(
          task.estimatedHours,
        ),
        actualHours: 0,
        progress: 0,
        status: "Not Started",
        completedAt: null,
      }),
    );

    const newPlan = {
      id: createId("plan"),
      employeeId: selectedUser.id,
      employeeName:
        getUserName(selectedUser),
      employeeEmail:
        selectedUser.email || "",
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      department:
        selectedUser.department ||
        selectedTeam.department ||
        "",
      planDate: formData.planDate,
      tasks: preparedTasks,
      taskCount: preparedTasks.length,
      completedTaskCount: 0,
      progress: 0,
      status: "Draft",
      totalEstimatedHours,
      totalActualHours: 0,
      notes: formData.notes.trim(),
      createdAt: now,
      updatedAt: now,
      submittedAt: null,
      completedAt: null,
    };

    onCreatePlan?.(newPlan);
  }

  function handleClose() {
    setFormData(emptyFormData);
    setTasks([createEmptyTask()]);
    setErrors({});
    setSubmitError("");
    onClose?.();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            height:
              "min(880px, calc(100vh - 64px))",
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
              <AssignmentOutlinedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Create Daily Plan
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Select an employee and define their
                planned tasks.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close create plan dialog"
            onClick={handleClose}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          minHeight: 0,
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <DialogContent
          sx={{
            px: 3,
            py: 3,
            backgroundColor: "#fcfcfd",
          }}
        >
          {submitError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {submitError}
            </Alert>
          )}

          <Typography
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Plan Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 2.5,
              mb: 3,
            }}
          >
            <TextField
              required
              select
              fullWidth
              autoFocus
              label="Employee"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleFormChange}
              error={Boolean(
                errors.employeeId,
              )}
              helperText={
                errors.employeeId ||
                "Choose an active employee"
              }
            >
              <MenuItem value="">
                Select employee
              </MenuItem>

              {activeUsers.map((user) => {
                const userTeam =
                  findUserTeam(user, teams);

                return (
                  <MenuItem
                    key={user.id}
                    value={String(user.id)}
                  >
                    {getUserName(user)}
                    {" · "}
                    {userTeam?.name ||
                      "No team assigned"}
                  </MenuItem>
                );
              })}
            </TextField>

            <TextField
              required
              fullWidth
              type="date"
              label="Plan Date"
              name="planDate"
              value={formData.planDate}
              onChange={handleFormChange}
              error={Boolean(
                errors.planDate,
              )}
              helperText={
                errors.planDate ||
                "Work date for this plan"
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          {selectedUser && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: 2,
                p: 2,
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                backgroundColor:
                  "background.paper",
              }}
            >
              <InformationItem
                label="Employee"
                value={getUserName(
                  selectedUser,
                )}
                icon={
                  <PersonOutlineRoundedIcon />
                }
              />

              <InformationItem
                label="Team"
                value={
                  selectedTeam?.name ||
                  "Not assigned"
                }
              />

              <InformationItem
                label="Department"
                value={
                  selectedUser.department ||
                  selectedTeam?.department ||
                  "Not assigned"
                }
              />
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Plan Notes"
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="Add context, goals, dependencies, or expected outcomes."
            helperText={`${formData.notes.length}/500 characters`}
            slotProps={{
              htmlInput: {
                maxLength: 500,
              },
            }}
            sx={{ mb: 4 }}
          />

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
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Planned Tasks
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.35,
                  fontSize: 13,
                }}
              >
                Add the work expected for this
                employee.
              </Typography>
            </Box>

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Stack>

          {errors.tasks && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {errors.tasks}
            </Alert>
          )}

          <Stack spacing={2}>
            {tasks.map((task, index) => (
              <TaskFormRow
                key={task.id}
                task={task}
                index={index}
                canRemove={tasks.length > 1}
                onChange={handleTaskChange}
                onRemove={handleRemoveTask}
              />
            ))}
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Chip
              label={`Total estimated: ${formatHours(
                totalEstimatedHours,
              )}`}
              color={
                totalEstimatedHours > 24
                  ? "error"
                  : "primary"
              }
              variant="outlined"
              sx={{
                fontWeight: 600,
              }}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Button
            type="button"
            color="inherit"
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
          >
            Create Plan
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function TaskFormRow({
  task,
  index,
  canRemove,
  onChange,
  onRemove,
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Task {index + 1}
        </Typography>

        <IconButton
          type="button"
          size="small"
          color="error"
          disabled={!canRemove}
          aria-label={`Remove task ${index + 1}`}
          onClick={() => onRemove(task.id)}
        >
          <DeleteOutlineRoundedIcon />
        </IconButton>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "minmax(280px, 2fr) minmax(150px, 0.8fr) minmax(150px, 0.8fr)",
          gap: 2,
        }}
      >
        <TextField
          required
          fullWidth
          label="Task Title"
          value={task.title}
          onChange={(event) =>
            onChange(
              task.id,
              "title",
              event.target.value,
            )
          }
          placeholder="Implement employee dashboard"
        />

        <TextField
          select
          fullWidth
          label="Priority"
          value={task.priority}
          onChange={(event) =>
            onChange(
              task.id,
              "priority",
              event.target.value,
            )
          }
        >
          <MenuItem value="Low">
            Low
          </MenuItem>

          <MenuItem value="Medium">
            Medium
          </MenuItem>

          <MenuItem value="High">
            High
          </MenuItem>

          <MenuItem value="Critical">
            Critical
          </MenuItem>
        </TextField>

        <TextField
          required
          fullWidth
          type="number"
          label="Estimated Hours"
          value={task.estimatedHours}
          onChange={(event) =>
            onChange(
              task.id,
              "estimatedHours",
              event.target.value,
            )
          }
          slotProps={{
            htmlInput: {
              min: 0.25,
              max: 24,
              step: 0.25,
            },
          }}
        />

        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Task Description"
          value={task.description}
          onChange={(event) =>
            onChange(
              task.id,
              "description",
              event.target.value,
            )
          }
          placeholder="Describe the expected work or result."
          slotProps={{
            htmlInput: {
              maxLength: 300,
            },
          }}
          sx={{
            gridColumn: "1 / -1",
          }}
        />
      </Box>
    </Box>
  );
}

function InformationItem({
  label,
  value,
  icon,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{ minWidth: 0 }}
    >
      {icon && (
        <Box
          sx={{
            display: "flex",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
      )}

      <Box sx={{ minWidth: 0 }}>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          noWrap
          sx={{
            mt: 0.25,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function findUserTeam(user, teams) {
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
  )
    .trim()
    .toLowerCase();

  return (
    teams.find(
      (team) =>
        String(team.name)
          .trim()
          .toLowerCase() ===
          normalizedTeamName ||
        String(team.code)
          .trim()
          .toLowerCase() ===
          normalizedTeamName,
    ) || null
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

function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0h";
  }

  return `${number}h`;
}

export default CreateDailyPlanDialog;