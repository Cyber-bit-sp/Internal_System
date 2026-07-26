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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

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
    order: 1,
    completedAt: null,
  };
}

function EditDailyPlanDialog({
  plan,
  isOpen,
  onClose,
  onUpdatePlan,
}) {
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!plan || !isOpen) {
      return;
    }

    const existingTasks =
      Array.isArray(plan.tasks) && plan.tasks.length > 0
        ? plan.tasks.map((task, index) => ({
            ...task,
            id: task.id || createId("task"),
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "Medium",
            status: task.status || "Not Started",
            estimatedHours:
              task.estimatedHours === null ||
              task.estimatedHours === undefined
                ? ""
                : task.estimatedHours,
            actualHours:
              Number(task.actualHours) || 0,
            progress: normalizeProgress(task.progress),
            order: task.order || index + 1,
            completedAt: task.completedAt || null,
          }))
        : [createEmptyTask()];

    setNotes(plan.notes || "");
    setTasks(existingTasks);
    setErrors({});
    setSubmitError("");
  }, [plan, isOpen]);

  const totalEstimatedHours = useMemo(() => {
    return tasks.reduce(
      (total, task) =>
        total + (Number(task.estimatedHours) || 0),
      0,
    );
  }, [tasks]);

  const totalActualHours = useMemo(() => {
    return tasks.reduce(
      (total, task) =>
        total + (Number(task.actualHours) || 0),
      0,
    );
  }, [tasks]);

  const completedTaskCount = useMemo(() => {
    return tasks.filter(
      (task) => task.status === "Completed",
    ).length;
  }, [tasks]);

  const overallProgress = useMemo(() => {
    if (tasks.length === 0) {
      return 0;
    }

    const totalProgress = tasks.reduce(
      (total, task) =>
        total + normalizeProgress(task.progress),
      0,
    );

    return Math.round(totalProgress / tasks.length);
  }, [tasks]);

  if (!plan) {
    return null;
  }

  function handleTaskChange(
    taskId,
    fieldName,
    value,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const nextTask = {
          ...task,
          [fieldName]: value,
        };

        if (fieldName === "status") {
          if (value === "Completed") {
            nextTask.progress = 100;
            nextTask.completedAt =
              new Date().toISOString();
          } else {
            nextTask.completedAt = null;

            if (
              task.status === "Completed" &&
              Number(task.progress) === 100
            ) {
              nextTask.progress =
                value === "Not Started" ? 0 : 50;
            }
          }

          if (value === "Not Started") {
            nextTask.progress = 0;
          }
        }

        if (fieldName === "progress") {
          const normalizedValue =
            normalizeProgress(value);

          nextTask.progress = normalizedValue;

          if (normalizedValue === 100) {
            nextTask.status = "Completed";
            nextTask.completedAt =
              task.completedAt ||
              new Date().toISOString();
          } else if (normalizedValue === 0) {
            if (task.status !== "Blocked") {
              nextTask.status = "Not Started";
            }

            nextTask.completedAt = null;
          } else {
            if (
              task.status === "Completed" ||
              task.status === "Not Started"
            ) {
              nextTask.status = "In Progress";
            }

            nextTask.completedAt = null;
          }
        }

        return nextTask;
      }),
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
      {
        ...createEmptyTask(),
        order: currentTasks.length + 1,
      },
    ]);
  }

  function handleRemoveTask(taskId) {
    setTasks((currentTasks) => {
      if (currentTasks.length === 1) {
        return currentTasks;
      }

      return currentTasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({
          ...task,
          order: index + 1,
        }));
    });
  }

  function validateForm() {
    const nextErrors = {};

    if (tasks.length === 0) {
      nextErrors.tasks =
        "At least one task is required.";
      return nextErrors;
    }

    const hasMissingTitle = tasks.some(
      (task) => !String(task.title).trim(),
    );

    if (hasMissingTitle) {
      nextErrors.tasks =
        "Every task must have a title.";
      return nextErrors;
    }

    const hasInvalidEstimatedHours = tasks.some(
      (task) => {
        const hours = Number(task.estimatedHours);

        return (
          task.estimatedHours === "" ||
          !Number.isFinite(hours) ||
          hours <= 0 ||
          hours > 24
        );
      },
    );

    if (hasInvalidEstimatedHours) {
      nextErrors.tasks =
        "Estimated hours must be greater than 0 and no more than 24.";
      return nextErrors;
    }

    const hasInvalidActualHours = tasks.some(
      (task) => {
        const hours = Number(task.actualHours);

        return (
          !Number.isFinite(hours) ||
          hours < 0 ||
          hours > 24
        );
      },
    );

    if (hasInvalidActualHours) {
      nextErrors.tasks =
        "Actual hours must be between 0 and 24.";
      return nextErrors;
    }

    if (totalEstimatedHours > 24) {
      nextErrors.tasks =
        "Total estimated hours cannot exceed 24.";
    }

    if (totalActualHours > 24) {
      nextErrors.tasks =
        "Total actual hours cannot exceed 24.";
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
      (task, index) => {
        const normalizedProgress =
          normalizeProgress(task.progress);

        const taskStatus =
          normalizedProgress === 100
            ? "Completed"
            : task.status;

        return {
          ...task,
          order: index + 1,
          title: task.title.trim(),
          description: String(
            task.description || "",
          ).trim(),
          estimatedHours: Number(
            task.estimatedHours,
          ),
          actualHours:
            Number(task.actualHours) || 0,
          progress: normalizedProgress,
          status: taskStatus,
          completedAt:
            taskStatus === "Completed"
              ? task.completedAt || now
              : null,
        };
      },
    );

    const nextCompletedTaskCount =
      preparedTasks.filter(
        (task) => task.status === "Completed",
      ).length;

    const nextProgress =
      preparedTasks.length === 0
        ? 0
        : Math.round(
            preparedTasks.reduce(
              (total, task) =>
                total + task.progress,
              0,
            ) / preparedTasks.length,
          );

    const nextStatus = getPlanStatus({
      currentStatus: plan.status,
      progress: nextProgress,
      tasks: preparedTasks,
    });

    const updatedPlan = {
      ...plan,
      tasks: preparedTasks,
      taskCount: preparedTasks.length,
      completedTaskCount:
        nextCompletedTaskCount,
      progress: nextProgress,
      totalEstimatedHours:
        preparedTasks.reduce(
          (total, task) =>
            total + task.estimatedHours,
          0,
        ),
      totalActualHours:
        preparedTasks.reduce(
          (total, task) =>
            total + task.actualHours,
          0,
        ),
      status: nextStatus,
      notes: notes.trim(),
      updatedAt: now,
      completedAt:
        nextStatus === "Completed"
          ? plan.completedAt || now
          : null,
    };

    onUpdatePlan?.(updatedPlan);
  }

  function handleClose() {
    setNotes("");
    setTasks([]);
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
              "min(900px, calc(100vh - 64px))",
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
                borderRadius: 2,
                color: "primary.main",
                backgroundColor: "primary.light",
              }}
            >
              <EditOutlinedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Edit Daily Plan
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Update tasks, progress, and actual hours for{" "}
                {plan.employeeName}.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close edit plan dialog"
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: 2,
              mb: 3,
            }}
          >
            <SummaryItem
              label="Employee"
              value={plan.employeeName}
            />

            <SummaryItem
              label="Plan Date"
              value={formatDate(plan.planDate)}
            />

            <SummaryItem
              label="Current Status"
              value={plan.status}
            />

            <SummaryItem
              label="Overall Progress"
              value={`${overallProgress}%`}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Plan Notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Add progress notes, blockers, or outcomes."
            helperText={`${notes.length}/500 characters`}
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
                Plan Tasks
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.35,
                  fontSize: 13,
                }}
              >
                Update work status, progress, and time.
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
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.tasks}
            </Alert>
          )}

          <Stack spacing={2}>
            {tasks.map((task, index) => (
              <EditableTaskCard
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
              flexWrap: "wrap",
              gap: 1,
              mt: 2.5,
            }}
          >
            <Chip
              label={`Completed: ${completedTaskCount}/${tasks.length}`}
              color="success"
              variant="outlined"
            />

            <Chip
              label={`Progress: ${overallProgress}%`}
              color="primary"
              variant="outlined"
            />

            <Chip
              label={`Estimated: ${formatHours(
                totalEstimatedHours,
              )}`}
              color={
                totalEstimatedHours > 24
                  ? "error"
                  : "default"
              }
              variant="outlined"
            />

            <Chip
              label={`Actual: ${formatHours(
                totalActualHours,
              )}`}
              color={
                totalActualHours > 24
                  ? "error"
                  : "default"
              }
              variant="outlined"
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
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function EditableTaskCard({
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
            "minmax(260px, 2fr) repeat(4, minmax(130px, 0.8fr))",
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
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Status"
          value={task.status}
          onChange={(event) =>
            onChange(
              task.id,
              "status",
              event.target.value,
            )
          }
        >
          <MenuItem value="Not Started">
            Not Started
          </MenuItem>

          <MenuItem value="In Progress">
            In Progress
          </MenuItem>

          <MenuItem value="Blocked">
            Blocked
          </MenuItem>

          <MenuItem value="Completed">
            Completed
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
          type="number"
          label="Actual Hours"
          value={task.actualHours}
          onChange={(event) =>
            onChange(
              task.id,
              "actualHours",
              event.target.value,
            )
          }
          slotProps={{
            htmlInput: {
              min: 0,
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
          slotProps={{
            htmlInput: {
              maxLength: 300,
            },
          }}
          sx={{
            gridColumn: "1 / span 3",
          }}
        />

        <TextField
          fullWidth
          type="number"
          label="Progress"
          value={task.progress}
          onChange={(event) =>
            onChange(
              task.id,
              "progress",
              event.target.value,
            )
          }
          slotProps={{
            htmlInput: {
              min: 0,
              max: 100,
              step: 5,
            },
          }}
          helperText="0 to 100%"
          sx={{
            gridColumn: "4 / span 2",
          }}
        />
      </Box>
    </Box>
  );
}

function SummaryItem({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
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
        sx={{
          mt: 0.4,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function getPlanStatus({
  currentStatus,
  progress,
  tasks,
}) {
  if (
    currentStatus === "Submitted" ||
    currentStatus === "Completed"
  ) {
    return currentStatus;
  }

  const hasStartedTask = tasks.some(
    (task) =>
      task.status !== "Not Started" ||
      Number(task.progress) > 0 ||
      Number(task.actualHours) > 0,
  );

  if (progress === 100) {
    return "In Progress";
  }

  if (hasStartedTask) {
    return "In Progress";
  }

  return "Draft";
}

function normalizeProgress(value) {
  return Math.min(
    100,
    Math.max(0, Number(value) || 0),
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

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0h";
  }

  return `${number}h`;
}

export default EditDailyPlanDialog;