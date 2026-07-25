import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

function SubmitDailyPlanDialog({
  plan,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!plan) {
    return null;
  }

  const tasks = Array.isArray(plan.tasks)
    ? plan.tasks
    : [];

  const validationIssues =
    getSubmissionIssues(plan, tasks);

  const canSubmit =
    validationIssues.length === 0;

  function handleConfirm() {
    if (!canSubmit) {
      return;
    }

    const now = new Date().toISOString();

    onConfirm?.({
      ...plan,
      status: "Submitted",
      submittedAt: now,
      updatedAt: now,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
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
              width: 48,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 2,
              color: "primary.main",
              backgroundColor: "primary.light",
            }}
          >
            <SendOutlinedIcon />
          </Box>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Submit Daily Plan
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Confirm this plan is ready for manager review.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "primary.main",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {getInitials(plan.employeeName)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {plan.employeeName}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  fontSize: 13,
                }}
              >
                {plan.teamName} · {formatDate(plan.planDate)}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 1.5,
            }}
          >
            <SummaryItem
              label="Tasks"
              value={`${plan.taskCount || tasks.length}`}
            />

            <SummaryItem
              label="Progress"
              value={`${normalizeProgress(
                plan.progress,
              )}%`}
            />

            <SummaryItem
              label="Estimated"
              value={formatHours(
                plan.totalEstimatedHours,
              )}
            />
          </Box>

          {canSubmit ? (
            <Alert severity="info">
              After submission, the plan will be locked for
              normal editing and sent for manager review.
            </Alert>
          ) : (
            <Alert severity="error">
              This plan cannot be submitted yet.
            </Alert>
          )}

          {validationIssues.length > 0 && (
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "error.light",
                borderRadius: 2,
                backgroundColor: "#fef3f2",
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  color: "error.main",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Fix these issues before submitting:
              </Typography>

              <Stack
                component="ul"
                spacing={0.75}
                sx={{
                  pl: 2.5,
                  my: 0,
                }}
              >
                {validationIssues.map((issue) => (
                  <Typography
                    component="li"
                    key={issue}
                    color="error.main"
                    sx={{
                      fontSize: 13,
                    }}
                  >
                    {issue}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Submitted plans cannot be edited unless they are
            returned to Draft in a later manager-review step.
          </Typography>
        </Stack>
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
          color="inherit"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!canSubmit}
          startIcon={
            <AssignmentTurnedInOutlinedIcon />
          }
          onClick={handleConfirm}
        >
          Submit Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SummaryItem({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        p: 1.75,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "#fcfcfd",
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
          mt: 0.35,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function getSubmissionIssues(plan, tasks) {
  const issues = [];

  if (plan.status === "Submitted") {
    issues.push("This plan is already submitted.");
  }

  if (plan.status === "Completed") {
    issues.push("This plan is already completed.");
  }

  if (tasks.length === 0) {
    issues.push("At least one task is required.");
  }

  const taskWithoutTitle = tasks.some(
    (task) => !String(task.title || "").trim(),
  );

  if (taskWithoutTitle) {
    issues.push("Every task must have a title.");
  }

  const invalidEstimatedHours = tasks.some(
    (task) => {
      const hours = Number(task.estimatedHours);

      return (
        !Number.isFinite(hours) ||
        hours <= 0
      );
    },
  );

  if (invalidEstimatedHours) {
    issues.push(
      "Every task must have valid estimated hours.",
    );
  }

  if (!plan.employeeId) {
    issues.push("The plan must have an employee.");
  }

  if (!plan.teamId && !plan.teamName) {
    issues.push("The employee must belong to a team.");
  }

  if (!plan.planDate) {
    issues.push("The plan date is required.");
  }

  return issues;
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

function normalizeProgress(value) {
  return Math.min(
    100,
    Math.max(0, Number(value) || 0),
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

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0h";
  }

  return `${number}h`;
}

export default SubmitDailyPlanDialog;