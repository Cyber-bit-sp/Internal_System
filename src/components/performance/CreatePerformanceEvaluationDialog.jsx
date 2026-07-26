import { useEffect, useMemo, useState } from "react";

import {
  Alert,
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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

const reviewPeriodOptions = [
  {
    label: "Q1 2026",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
  },
  {
    label: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
  {
    label: "Q3 2026",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
  },
  {
    label: "Q4 2026",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
  },
];

const initialFormData = {
  employeeId: "",
  reviewPeriod: "Q3 2026",
  evaluatorId: "",
};

function CreatePerformanceEvaluationDialog({
  isOpen,
  onClose,
  onCreateEvaluation,
  existingEvaluations = [],
  users = [],
  teams = [],
  dailyPlans = [],
}) {
  const [formData, setFormData] = useState(
    initialFormData,
  );

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(initialFormData);
    setErrors({});
    setSubmitError("");
  }, [isOpen]);

  const activeUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.status === "Active",
      )
      .sort((firstUser, secondUser) =>
        getUserName(firstUser).localeCompare(
          getUserName(secondUser),
        ),
      );
  }, [users]);

  const evaluatorOptions = useMemo(() => {
    return users
      .filter((user) => {
        if (user.status !== "Active") {
          return false;
        }

        const role = String(
          user.role || user.jobTitle || "",
        ).toLowerCase();

        return (
          role.includes("manager") ||
          role.includes("admin") ||
          role.includes("lead")
        );
      })
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

  const selectedEvaluator = useMemo(() => {
    return users.find(
      (user) =>
        String(user.id) ===
        String(formData.evaluatorId),
    );
  }, [users, formData.evaluatorId]);

  const selectedTeam = useMemo(() => {
    if (!selectedUser) {
      return null;
    }

    return findUserTeam(
      selectedUser,
      teams,
    );
  }, [selectedUser, teams]);

  const selectedPeriod = useMemo(() => {
    return reviewPeriodOptions.find(
      (period) =>
        period.label ===
        formData.reviewPeriod,
    );
  }, [formData.reviewPeriod]);

  const employeePlans = useMemo(() => {
    if (!selectedUser || !selectedPeriod) {
      return [];
    }

    return dailyPlans.filter((plan) => {
      const matchesEmployee =
        String(plan.employeeId) ===
        String(selectedUser.id);

      const matchesPeriod =
        plan.planDate >=
          selectedPeriod.startDate &&
        plan.planDate <=
          selectedPeriod.endDate;

      return (
        matchesEmployee &&
        matchesPeriod
      );
    });
  }, [
    dailyPlans,
    selectedUser,
    selectedPeriod,
  ]);

  const calculatedMetrics = useMemo(() => {
    return calculateMetrics(employeePlans);
  }, [employeePlans]);

  function handleChange(event) {
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

  function validateForm() {
    const nextErrors = {};

    if (!formData.employeeId) {
      nextErrors.employeeId =
        "Employee is required.";
    }

    if (!formData.reviewPeriod) {
      nextErrors.reviewPeriod =
        "Review period is required.";
    }

    if (!formData.evaluatorId) {
      nextErrors.evaluatorId =
        "Evaluator is required.";
    }

    if (
      formData.employeeId &&
      formData.evaluatorId &&
      String(formData.employeeId) ===
        String(formData.evaluatorId)
    ) {
      nextErrors.evaluatorId =
        "The employee cannot evaluate themselves.";
    }

    if (selectedUser && !selectedTeam) {
      nextErrors.employeeId =
        "The selected employee must belong to a team.";
    }

    const duplicateEvaluation =
      existingEvaluations.some(
        (evaluation) =>
          String(evaluation.employeeId) ===
            String(formData.employeeId) &&
          evaluation.reviewPeriod ===
            formData.reviewPeriod,
      );

    if (
      formData.employeeId &&
      formData.reviewPeriod &&
      duplicateEvaluation
    ) {
      nextErrors.reviewPeriod =
        "This employee already has an evaluation for this review period.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors =
      validateForm();

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

    const newEvaluation = {
      id: createId("evaluation"),

      employeeId: selectedUser.id,
      employeeName:
        getUserName(selectedUser),
      employeeEmail:
        selectedUser.email || "",
      employeeJobTitle:
        selectedUser.jobTitle ||
        selectedUser.role ||
        "",

      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      department:
        selectedUser.department ||
        selectedTeam.department ||
        "",

      reviewPeriod:
        selectedPeriod.label,
      periodStart:
        selectedPeriod.startDate,
      periodEnd:
        selectedPeriod.endDate,

      evaluatorId:
        selectedEvaluator.id,
      evaluatorName:
        getUserName(selectedEvaluator),

      overallScore: 0,
      status: "Not Started",

      completedPlanCount:
        calculatedMetrics.completedPlanCount,

      submittedPlanCount:
        calculatedMetrics.submittedPlanCount,

      averageDailyProgress:
        calculatedMetrics.averageDailyProgress,

      taskCompletionRate:
        calculatedMetrics.taskCompletionRate,

      onTimeSubmissionRate:
        calculatedMetrics.onTimeSubmissionRate,

      productivityScore: 0,
      qualityScore: 0,
      collaborationScore: 0,
      communicationScore: 0,
      reliabilityScore: 0,

      strengths: "",
      improvementAreas: "",
      managerComments: "",
      employeeComments: "",

      createdAt: now,
      updatedAt: now,
      submittedAt: null,
      acknowledgedAt: null,
      completedAt: null,
    };

    onCreateEvaluation?.(
      newEvaluation,
    );
  }

  function handleClose() {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError("");
    onClose?.();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            maxHeight:
              "calc(100vh - 64px)",
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
                backgroundColor:
                  "primary.light",
              }}
            >
              <AssessmentOutlinedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Create Performance Evaluation
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Create an evaluation using employee
                daily-plan performance.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close create evaluation dialog"
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
            Evaluation Setup
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
              onChange={handleChange}
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
                  findUserTeam(
                    user,
                    teams,
                  );

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
              select
              fullWidth
              label="Review Period"
              name="reviewPeriod"
              value={formData.reviewPeriod}
              onChange={handleChange}
              error={Boolean(
                errors.reviewPeriod,
              )}
              helperText={
                errors.reviewPeriod ||
                "Evaluation reporting period"
              }
            >
              {reviewPeriodOptions.map(
                (period) => (
                  <MenuItem
                    key={period.label}
                    value={period.label}
                  >
                    {period.label}
                    {" · "}
                    {formatShortDate(
                      period.startDate,
                    )}
                    {" - "}
                    {formatShortDate(
                      period.endDate,
                    )}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              required
              select
              fullWidth
              label="Evaluator"
              name="evaluatorId"
              value={formData.evaluatorId}
              onChange={handleChange}
              error={Boolean(
                errors.evaluatorId,
              )}
              helperText={
                errors.evaluatorId ||
                "Manager responsible for this evaluation"
              }
            >
              <MenuItem value="">
                Select evaluator
              </MenuItem>

              {evaluatorOptions.map(
                (user) => (
                  <MenuItem
                    key={user.id}
                    value={String(user.id)}
                  >
                    {getUserName(user)}
                    {" · "}
                    {user.jobTitle ||
                      user.role ||
                      "Manager"}
                  </MenuItem>
                ),
              )}
            </TextField>
          </Box>

          {selectedUser && (
            <>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Employee Information
              </Typography>

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
                  icon={
                    <PersonOutlineRoundedIcon />
                  }
                  label="Employee"
                  value={getUserName(
                    selectedUser,
                  )}
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

                <InformationItem
                  icon={
                    <SupervisorAccountOutlinedIcon />
                  }
                  label="Evaluator"
                  value={
                    selectedEvaluator
                      ? getUserName(
                          selectedEvaluator,
                        )
                      : "Not selected"
                  }
                />

                <InformationItem
                  label="Review Period"
                  value={
                    selectedPeriod?.label ||
                    "Not selected"
                  }
                />

                <InformationItem
                  label="Daily Plans Found"
                  value={`${employeePlans.length} plans`}
                />
              </Box>
            </>
          )}

          <Typography
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Calculated Daily Plan Metrics
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(5, minmax(0, 1fr))",
              gap: 2,
              mb: 2,
            }}
          >
            <MetricCard
              label="Completed Plans"
              value={
                calculatedMetrics.completedPlanCount
              }
            />

            <MetricCard
              label="Submitted Plans"
              value={
                calculatedMetrics.submittedPlanCount
              }
            />

            <MetricCard
              label="Average Progress"
              value={`${calculatedMetrics.averageDailyProgress}%`}
            />

            <MetricCard
              label="Task Completion"
              value={`${calculatedMetrics.taskCompletionRate}%`}
            />

            <MetricCard
              label="On-Time Submission"
              value={`${calculatedMetrics.onTimeSubmissionRate}%`}
            />
          </Box>

          {employeePlans.length === 0 ? (
            <Alert severity="warning">
              No daily plans were found for this employee
              during the selected review period. The
              evaluation can still be created, but its
              calculated metrics will be zero.
            </Alert>
          ) : (
            <Alert severity="info">
              These metrics were calculated from{" "}
              {employeePlans.length} daily plans during{" "}
              {selectedPeriod?.label}.
            </Alert>
          )}
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
            Create Evaluation
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function InformationItem({
  icon,
  label,
  value,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        minWidth: 0,
      }}
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

function MetricCard({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
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
          mt: 0.5,
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function calculateMetrics(plans) {
  if (plans.length === 0) {
    return {
      completedPlanCount: 0,
      submittedPlanCount: 0,
      averageDailyProgress: 0,
      taskCompletionRate: 0,
      onTimeSubmissionRate: 0,
    };
  }

  const completedPlanCount =
    plans.filter(
      (plan) =>
        plan.status === "Completed",
    ).length;

  const submittedPlans =
    plans.filter((plan) =>
      [
        "Submitted",
        "Approved",
        "Completed",
      ].includes(plan.status),
    );

  const submittedPlanCount =
    submittedPlans.length;

  const averageDailyProgress =
    Math.round(
      plans.reduce(
        (total, plan) =>
          total +
          normalizePercentage(
            plan.progress,
          ),
        0,
      ) / plans.length,
    );

  const totalTaskCount =
    plans.reduce(
      (total, plan) =>
        total +
        Number(plan.taskCount || 0),
      0,
    );

  const completedTaskCount =
    plans.reduce(
      (total, plan) =>
        total +
        Number(
          plan.completedTaskCount || 0,
        ),
      0,
    );

  const taskCompletionRate =
    totalTaskCount === 0
      ? 0
      : Math.round(
          (completedTaskCount /
            totalTaskCount) *
            100,
        );

  const onTimeSubmissionCount =
    submittedPlans.filter((plan) =>
      wasSubmittedOnTime(plan),
    ).length;

  const onTimeSubmissionRate =
    submittedPlanCount === 0
      ? 0
      : Math.round(
          (onTimeSubmissionCount /
            submittedPlanCount) *
            100,
        );

  return {
    completedPlanCount,
    submittedPlanCount,
    averageDailyProgress,
    taskCompletionRate,
    onTimeSubmissionRate,
  };
}

function wasSubmittedOnTime(plan) {
  if (!plan.submittedAt || !plan.planDate) {
    return false;
  }

  const submissionDate = new Date(
    plan.submittedAt,
  );

  const deadline = new Date(
    `${plan.planDate}T23:59:59`,
  );

  if (
    Number.isNaN(submissionDate.getTime()) ||
    Number.isNaN(deadline.getTime())
  ) {
    return false;
  }

  return submissionDate <= deadline;
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

function normalizePercentage(value) {
  return Math.round(
    Math.min(
      100,
      Math.max(
        0,
        Number(value) || 0,
      ),
    ),
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

export default CreatePerformanceEvaluationDialog;