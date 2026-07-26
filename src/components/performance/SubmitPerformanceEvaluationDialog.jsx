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

function SubmitPerformanceEvaluationDialog({
  evaluation,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!evaluation) {
    return null;
  }

  const validationIssues =
    getSubmissionIssues(evaluation);

  const canSubmit =
    validationIssues.length === 0;

  function handleConfirm() {
    if (!canSubmit) {
      return;
    }

    const now = new Date().toISOString();

    const submittedEvaluation = {
      ...evaluation,
      status: "Submitted",
      submittedAt: now,
      updatedAt: now,
    };

    onConfirm?.(submittedEvaluation);
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
              Submit Performance Evaluation
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Confirm that the evaluation is ready for employee
              acknowledgment.
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
              {getInitials(evaluation.employeeName)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {evaluation.employeeName}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  fontSize: 13,
                }}
              >
                {evaluation.reviewPeriod}
                {" · "}
                {evaluation.teamName || "No team"}
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
              label="Overall Score"
              value={`${normalizeScore(
                evaluation.overallScore,
              ).toFixed(1)} / 5.0`}
            />

            <SummaryItem
              label="Task Completion"
              value={`${normalizePercentage(
                evaluation.taskCompletionRate,
              )}%`}
            />

            <SummaryItem
              label="Evaluator"
              value={
                evaluation.evaluatorName ||
                "Not assigned"
              }
            />
          </Box>

          {canSubmit ? (
            <Alert severity="info">
              After submission, manager editing will be locked.
              The employee will be able to review and acknowledge
              the evaluation.
            </Alert>
          ) : (
            <Alert severity="error">
              This evaluation cannot be submitted yet.
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
            Submitted evaluations cannot be edited through the
            normal manager workflow. A later revision workflow
            can return the evaluation to Draft when necessary.
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
          Submit Evaluation
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
        minWidth: 0,
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
        noWrap
        sx={{
          mt: 0.35,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function getSubmissionIssues(evaluation) {
  const issues = [];

  if (evaluation.status === "Submitted") {
    issues.push(
      "This evaluation is already submitted.",
    );
  }

  if (evaluation.status === "Acknowledged") {
    issues.push(
      "This evaluation is already acknowledged.",
    );
  }

  if (evaluation.status === "Completed") {
    issues.push(
      "This evaluation is already completed.",
    );
  }

  if (evaluation.status !== "Draft") {
    issues.push(
      "Only Draft evaluations can be submitted.",
    );
  }

  if (!evaluation.employeeId) {
    issues.push(
      "The evaluation must have an employee.",
    );
  }

  if (!evaluation.evaluatorId) {
    issues.push(
      "The evaluation must have an evaluator.",
    );
  }

  if (
    String(evaluation.employeeId) ===
    String(evaluation.evaluatorId)
  ) {
    issues.push(
      "The employee cannot evaluate themselves.",
    );
  }

  const scoreFields = [
    {
      key: "productivityScore",
      label: "Productivity",
    },
    {
      key: "qualityScore",
      label: "Quality",
    },
    {
      key: "collaborationScore",
      label: "Collaboration",
    },
    {
      key: "communicationScore",
      label: "Communication",
    },
    {
      key: "reliabilityScore",
      label: "Reliability",
    },
  ];

  scoreFields.forEach((field) => {
    const score = Number(
      evaluation[field.key],
    );

    if (
      !Number.isFinite(score) ||
      score < 1 ||
      score > 5
    ) {
      issues.push(
        `${field.label} score must be between 1 and 5.`,
      );
    }
  });

  const overallScore = Number(
    evaluation.overallScore,
  );

  if (
    !Number.isFinite(overallScore) ||
    overallScore < 1 ||
    overallScore > 5
  ) {
    issues.push(
      "The overall score must be between 1 and 5.",
    );
  }

  if (
    !String(
      evaluation.strengths || "",
    ).trim()
  ) {
    issues.push(
      "Strengths are required.",
    );
  }

  if (
    !String(
      evaluation.improvementAreas || "",
    ).trim()
  ) {
    issues.push(
      "Improvement areas are required.",
    );
  }

  if (
    !String(
      evaluation.managerComments || "",
    ).trim()
  ) {
    issues.push(
      "Manager comments are required.",
    );
  }

  if (!evaluation.reviewPeriod) {
    issues.push(
      "The review period is required.",
    );
  }

  if (
    !evaluation.periodStart ||
    !evaluation.periodEnd
  ) {
    issues.push(
      "The evaluation period dates are required.",
    );
  }

  return [...new Set(issues)];
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

function normalizeScore(value) {
  return Math.min(
    5,
    Math.max(0, Number(value) || 0),
  );
}

function normalizePercentage(value) {
  return Math.round(
    Math.min(
      100,
      Math.max(0, Number(value) || 0),
    ),
  );
}

export default SubmitPerformanceEvaluationDialog;