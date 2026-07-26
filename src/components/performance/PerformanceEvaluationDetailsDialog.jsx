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

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

import EvaluationStatusBadge from "./EvaluationStatusBadge";

const scoreCategories = [
  {
    key: "productivityScore",
    label: "Productivity",
    description:
      "Work output, consistency, and ability to complete planned responsibilities.",
  },
  {
    key: "qualityScore",
    label: "Quality",
    description:
      "Accuracy, attention to detail, and reliability of completed work.",
  },
  {
    key: "collaborationScore",
    label: "Collaboration",
    description:
      "Teamwork, support for colleagues, and contribution to shared outcomes.",
  },
  {
    key: "communicationScore",
    label: "Communication",
    description:
      "Clarity, responsiveness, and timely communication of progress or blockers.",
  },
  {
    key: "reliabilityScore",
    label: "Reliability",
    description:
      "Dependability, ownership, and ability to meet agreed commitments.",
  },
];

function PerformanceEvaluationDetailsDialog({
  evaluation,
  isOpen,
  onClose,
  onEdit,
  onSubmit,
  onAcknowledge,
  onComplete,
}) {
  if (!evaluation) {
    return null;
  }

  const canEdit =
    evaluation.status === "Not Started" || evaluation.status === "Draft";

  const canSubmit = evaluation.status === "Draft";

  const canAcknowledge = evaluation.status === "Submitted";

  const canComplete = evaluation.status === "Acknowledged";

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
          <Stack direction="row" alignItems="center" spacing={1.75}>
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
                Performance Evaluation Details
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Review scores, performance metrics, and feedback.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close performance evaluation"
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
        <Stack direction="row" alignItems="center" spacing={2.5} sx={{ mb: 4 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              backgroundColor: "primary.main",
              fontSize: 21,
              fontWeight: 700,
            }}
          >
            {getInitials(evaluation.employeeName)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {evaluation.employeeName}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.4,
                fontSize: 14,
              }}
            >
              {evaluation.employeeJobTitle ||
                evaluation.employeeEmail ||
                "Employee"}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 1.5 }}
            >
              <EvaluationStatusBadge status={evaluation.status} />

              <Chip
                label={evaluation.reviewPeriod}
                size="small"
                variant="outlined"
              />

              <Chip
                label={`${normalizeScore(evaluation.overallScore).toFixed(
                  1,
                )} / 5.0`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>

        <SectionTitle>Evaluation Information</SectionTitle>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <InformationCard
            icon={<PersonOutlineRoundedIcon />}
            label="Employee"
            value={evaluation.employeeName}
          />

          <InformationCard
            icon={<GroupsOutlinedIcon />}
            label="Team"
            value={evaluation.teamName || "Not assigned"}
          />

          <InformationCard
            icon={<BusinessOutlinedIcon />}
            label="Department"
            value={evaluation.department || "Not assigned"}
          />

          <InformationCard
            icon={<SupervisorAccountOutlinedIcon />}
            label="Evaluator"
            value={evaluation.evaluatorName || "Not assigned"}
          />

          <InformationCard
            icon={<CalendarMonthOutlinedIcon />}
            label="Review Period"
            value={evaluation.reviewPeriod}
          />

          <InformationCard
            icon={<CalendarMonthOutlinedIcon />}
            label="Period Dates"
            value={`${formatDate(
              evaluation.periodStart,
            )} to ${formatDate(evaluation.periodEnd)}`}
          />
        </Box>

        <SectionTitle>Overall Performance</SectionTitle>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 0.8fr) minmax(0, 2fr)",
            gap: 2,
            mb: 4,
          }}
        >
          <OverallScoreCard score={evaluation.overallScore} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 2,
            }}
          >
            {scoreCategories.map((category) => (
              <CategoryScoreCard
                key={category.key}
                label={category.label}
                description={category.description}
                score={evaluation[category.key]}
              />
            ))}
          </Box>
        </Box>

        <SectionTitle>Daily Plan Metrics</SectionTitle>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <MetricCard
            label="Completed Plans"
            value={evaluation.completedPlanCount || 0}
          />

          <MetricCard
            label="Submitted Plans"
            value={evaluation.submittedPlanCount || 0}
          />

          <MetricCard
            label="Average Progress"
            value={`${normalizePercentage(evaluation.averageDailyProgress)}%`}
          />

          <MetricCard
            label="Task Completion"
            value={`${normalizePercentage(evaluation.taskCompletionRate)}%`}
          />

          <MetricCard
            label="On-Time Submission"
            value={`${normalizePercentage(evaluation.onTimeSubmissionRate)}%`}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <FeedbackCard
            title="Strengths"
            value={evaluation.strengths}
            emptyText="No strengths have been recorded."
          />

          <FeedbackCard
            title="Improvement Areas"
            value={evaluation.improvementAreas}
            emptyText="No improvement areas have been recorded."
          />
        </Box>

        <SectionTitle>Manager Comments</SectionTitle>

        <CommentCard
          value={evaluation.managerComments}
          emptyText="No manager comments have been added."
        />

        <Box sx={{ mt: 4 }}>
          <SectionTitle>Employee Comments</SectionTitle>
        </Box>

        <CommentCard
          value={evaluation.employeeComments}
          emptyText="The employee has not added comments."
        />

        <Box sx={{ mt: 4 }}>
          <SectionTitle>Review History</SectionTitle>
        </Box>

        <Box
          sx={{
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            backgroundColor: "background.paper",
          }}
        >
          <TimelineRow
            label="Created"
            date={evaluation.createdAt}
            isLast={
              !evaluation.submittedAt &&
              !evaluation.acknowledgedAt &&
              !evaluation.completedAt
            }
          />

          {evaluation.submittedAt && (
            <TimelineRow
              label="Submitted"
              date={evaluation.submittedAt}
              isLast={!evaluation.acknowledgedAt && !evaluation.completedAt}
            />
          )}

          {evaluation.acknowledgedAt && (
            <TimelineRow
              label="Acknowledged"
              date={evaluation.acknowledgedAt}
              isLast={!evaluation.completedAt}
            />
          )}

          {evaluation.completedAt && (
            <TimelineRow
              label="Completed"
              date={evaluation.completedAt}
              isLast
            />
          )}
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
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit?.(evaluation)}
            >
              Edit Evaluation
            </Button>
          )}

          {canSubmit && (
            <Button
              variant="contained"
              startIcon={<SendOutlinedIcon />}
              onClick={() => onSubmit?.(evaluation)}
            >
              Submit Evaluation
            </Button>
          )}

          {canAcknowledge && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckCircleOutlineRoundedIcon />}
              onClick={() => onAcknowledge?.(evaluation)}
            >
              Acknowledge
            </Button>
          )}

          {canComplete && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleOutlineRoundedIcon />}
              onClick={() => onComplete?.(evaluation)}
            >
              Complete Evaluation
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

function InformationCard({ icon, label, value }) {
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

function OverallScoreCard({ score }) {
  const normalizedScore = normalizeScore(score);
  const percentage = (normalizedScore / 5) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 240,
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Overall Score
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1,
            color: "primary.main",
          }}
        >
          {normalizedScore.toFixed(1)}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
            fontSize: 13,
          }}
        >
          out of 5.0
        </Typography>

        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            width: 180,
            height: 9,
            mt: 2.5,
            borderRadius: 99,

            "& .MuiLinearProgress-bar": {
              borderRadius: 99,
            },
          }}
        />

        <Typography
          sx={{
            mt: 1.5,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {getScoreLabel(normalizedScore)}
        </Typography>
      </Box>
    </Box>
  );
}

function CategoryScoreCard({ label, description, score }) {
  const normalizedScore = normalizeScore(score);
  const percentage = (normalizedScore / 5) * 100;

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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {normalizedScore.toFixed(1)}
        </Typography>
      </Stack>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.75,
          minHeight: 40,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 7,
          mt: 1.5,
          borderRadius: 99,

          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
          },
        }}
      />
    </Box>
  );
}

function MetricCard({ label, value }) {
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
          fontSize: 21,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function FeedbackCard({ title, value, emptyText }) {
  return (
    <Box
      sx={{
        p: 2.5,
        minHeight: 150,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        sx={{
          mb: 1.25,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          fontSize: 13,
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {value || emptyText}
      </Typography>
    </Box>
  );
}

function CommentCard({ value, emptyText }) {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={1.5}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
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
          fontSize: 13,
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {value || emptyText}
      </Typography>
    </Stack>
  );
}

function TimelineRow({ label, date, isLast }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        px: 2.5,
        py: 1.75,
        borderBottom: isLast ? 0 : "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          fontSize: 12,
        }}
      >
        {formatDateTime(date)}
      </Typography>
    </Stack>
  );
}

function normalizeScore(value) {
  return Math.min(5, Math.max(0, Number(value) || 0));
}

function normalizePercentage(value) {
  return Math.round(Math.min(100, Math.max(0, Number(value) || 0)));
}

function getScoreLabel(score) {
  if (score >= 4.5) {
    return "Exceptional";
  }

  if (score >= 4) {
    return "Exceeds Expectations";
  }

  if (score >= 3) {
    return "Meets Expectations";
  }

  if (score >= 2) {
    return "Needs Improvement";
  }

  if (score > 0) {
    return "Unsatisfactory";
  }

  return "Not Scored";
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

export default PerformanceEvaluationDetailsDialog;
