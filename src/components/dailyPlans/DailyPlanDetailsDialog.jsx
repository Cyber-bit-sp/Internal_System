import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import DailyPlanStatusBadge from "./DailyPlanStatusBadge";

const priorityStyles = {
  Low: {
    color: "#175cd3",
    backgroundColor: "#eff8ff",
    borderColor: "#b2ddff",
  },
  Medium: {
    color: "#475467",
    backgroundColor: "#f2f4f7",
    borderColor: "#d0d5dd",
  },
  High: {
    color: "#b54708",
    backgroundColor: "#fffaeb",
    borderColor: "#fedf89",
  },
  Critical: {
    color: "#b42318",
    backgroundColor: "#fef3f2",
    borderColor: "#fecdca",
  },
};

const taskStatusStyles = {
  "Not Started": {
    color: "#475467",
    backgroundColor: "#f2f4f7",
    borderColor: "#d0d5dd",
  },
  "In Progress": {
    color: "#175cd3",
    backgroundColor: "#eff8ff",
    borderColor: "#b2ddff",
  },
  Blocked: {
    color: "#b54708",
    backgroundColor: "#fffaeb",
    borderColor: "#fedf89",
  },
  Completed: {
    color: "#067647",
    backgroundColor: "#ecfdf3",
    borderColor: "#abefc6",
  },
};

function DailyPlanDetailsDialog({
  plan,
  isOpen,
  onClose,
  onEdit,
  onSubmit,
  onComplete,
}) {
  if (!plan) {
    return null;
  }

  const tasks = Array.isArray(plan.tasks)
    ? plan.tasks
    : [];

  const canEdit =
    plan.status === "Draft" ||
    plan.status === "In Progress";

  const canSubmit =
    plan.status === "Draft" ||
    plan.status === "In Progress";

  const canComplete =
    plan.status === "Submitted" &&
    Number(plan.progress) === 100;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            maxHeight: "calc(100vh - 64px)",
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
                Daily Plan Details
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Review employee tasks, time, and progress.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close daily plan details"
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2.5}
          sx={{ mb: 4 }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              backgroundColor: "primary.main",
              fontSize: 21,
              fontWeight: 700,
            }}
          >
            {getInitials(plan.employeeName)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {plan.employeeName}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.4,
                fontSize: 14,
              }}
            >
              {plan.employeeEmail || "No email available"}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 1.5 }}
            >
              <DailyPlanStatusBadge
                status={plan.status}
              />

              <Chip
                label={formatDate(plan.planDate)}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>

        <SectionTitle>Plan Information</SectionTitle>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <InformationCard
            icon={<PersonOutlineRoundedIcon />}
            label="Employee"
            value={plan.employeeName}
          />

          <InformationCard
            icon={<GroupsOutlinedIcon />}
            label="Team"
            value={plan.teamName || "Not assigned"}
          />

          <InformationCard
            icon={<BusinessOutlinedIcon />}
            label="Department"
            value={plan.department || "Not assigned"}
          />

          <InformationCard
            icon={<CalendarMonthOutlinedIcon />}
            label="Plan Date"
            value={formatDate(plan.planDate)}
          />

          <InformationCard
            icon={<AccessTimeOutlinedIcon />}
            label="Estimated Hours"
            value={formatHours(
              plan.totalEstimatedHours,
            )}
          />

          <InformationCard
            icon={<AccessTimeOutlinedIcon />}
            label="Actual Hours"
            value={formatHours(
              plan.totalActualHours,
            )}
          />
        </Box>

        <SectionTitle>Overall Progress</SectionTitle>

        <Box
          sx={{
            p: 2.5,
            mb: 4,
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
            sx={{ mb: 1.5 }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {plan.completedTaskCount || 0} of{" "}
                {plan.taskCount || tasks.length} tasks completed
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  fontSize: 12,
                }}
              >
                Updated {formatDateTime(plan.updatedAt)}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {normalizeProgress(plan.progress)}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={normalizeProgress(plan.progress)}
            sx={{
              height: 10,
              borderRadius: 99,

              "& .MuiLinearProgress-bar": {
                borderRadius: 99,
              },
            }}
          />
        </Box>

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
              Work items included in this daily plan.
            </Typography>
          </Box>

          <Chip
            label={`${tasks.length} tasks`}
            variant="outlined"
            size="small"
          />
        </Stack>

        {tasks.length === 0 ? (
          <EmptyTasksState />
        ) : (
          <Stack spacing={2} sx={{ mb: 4 }}>
            {tasks.map((task, index) => (
              <TaskDetailsCard
                key={task.id || index}
                task={task}
                index={index}
              />
            ))}
          </Stack>
        )}

        <SectionTitle>Plan Notes</SectionTitle>

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
            alignItems="flex-start"
            spacing={1.5}
          >
            <NotesOutlinedIcon
              sx={{
                mt: 0.2,
                color: "text.secondary",
              }}
            />

            <Typography
              color="text.secondary"
              sx={{
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {plan.notes || "No notes were provided."}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit?.(plan)}
            >
              Edit Plan
            </Button>
          )}

          {canSubmit && (
            <Button
              variant="contained"
              startIcon={<SendOutlinedIcon />}
              onClick={() => onSubmit?.(plan)}
            >
              Submit Plan
            </Button>
          )}

          {plan.status === "Submitted" && (
            <Button
              variant="contained"
              color="success"
              disabled={!canComplete}
              startIcon={
                <CheckCircleOutlineRoundedIcon />
              }
              onClick={() => onComplete?.(plan)}
            >
              Complete Plan
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        mb: 2,
        fontSize: 16,
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
}

function InformationCard({
  icon,
  label,
  value,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        p: 2,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 40,
          height: 40,
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
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function TaskDetailsCard({
  task,
  index,
}) {
  const priorityStyle =
    priorityStyles[task.priority] ||
    priorityStyles.Medium;

  const statusStyle =
    taskStatusStyles[task.status] ||
    taskStatusStyles["Not Started"];

  const progress = normalizeProgress(
    task.progress,
  );

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
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={1.5}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              color: "primary.main",
              backgroundColor: "primary.light",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {index + 1}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {task.title || "Untitled task"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {task.description ||
                "No task description provided."}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexShrink: 0,
          }}
        >
          <Chip
            label={task.priority || "Medium"}
            size="small"
            variant="outlined"
            sx={{
              color: priorityStyle.color,
              backgroundColor:
                priorityStyle.backgroundColor,
              borderColor:
                priorityStyle.borderColor,
              fontWeight: 600,
            }}
          />

          <Chip
            label={task.status || "Not Started"}
            size="small"
            variant="outlined"
            sx={{
              color: statusStyle.color,
              backgroundColor:
                statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor,
              fontWeight: 600,
            }}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: 2,
          mb: 2,
        }}
      >
        <TaskMetric
          label="Estimated"
          value={formatHours(
            task.estimatedHours,
          )}
        />

        <TaskMetric
          label="Actual"
          value={formatHours(task.actualHours)}
        />

        <TaskMetric
          label="Progress"
          value={`${progress}%`}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 7,
          borderRadius: 99,

          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
          },
        }}
      />
    </Box>
  );
}

function TaskMetric({
  label,
  value,
}) {
  return (
    <Box>
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
          mt: 0.25,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function EmptyTasksState() {
  return (
    <Box
      sx={{
        px: 3,
        py: 6,
        mb: 4,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Avatar
        sx={{
          width: 50,
          height: 50,
          mx: "auto",
          mb: 1.5,
          color: "primary.main",
          backgroundColor: "primary.light",
        }}
      >
        <AssignmentOutlinedIcon />
      </Avatar>

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        No task details available
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.75,
          fontSize: 13,
        }}
      >
        This demo plan currently contains only task totals.
      </Typography>
    </Box>
  );
}

function normalizeProgress(value) {
  return Math.min(
    100,
    Math.max(0, Number(value) || 0),
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

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0h";
  }

  return `${number}h`;
}

export default DailyPlanDetailsDialog;