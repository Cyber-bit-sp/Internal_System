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
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

const scoreFields = [
  {
    name: "productivityScore",
    label: "Productivity",
    description:
      "Work output, consistency, and ability to complete planned responsibilities.",
  },
  {
    name: "qualityScore",
    label: "Quality",
    description:
      "Accuracy, attention to detail, and reliability of completed work.",
  },
  {
    name: "collaborationScore",
    label: "Collaboration",
    description:
      "Teamwork, support for colleagues, and contribution to shared outcomes.",
  },
  {
    name: "communicationScore",
    label: "Communication",
    description:
      "Clarity, responsiveness, and communication of progress or blockers.",
  },
  {
    name: "reliabilityScore",
    label: "Reliability",
    description:
      "Dependability, ownership, and ability to meet agreed commitments.",
  },
];

const emptyFormData = {
  productivityScore: "",
  qualityScore: "",
  collaborationScore: "",
  communicationScore: "",
  reliabilityScore: "",
  strengths: "",
  improvementAreas: "",
  managerComments: "",
};

function EditPerformanceEvaluationDialog({
  evaluation,
  isOpen,
  onClose,
  onUpdateEvaluation,
}) {
  const [formData, setFormData] =
    useState(emptyFormData);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    if (!evaluation || !isOpen) {
      return;
    }

    setFormData({
      productivityScore: getEditableScore(
        evaluation.productivityScore,
      ),
      qualityScore: getEditableScore(
        evaluation.qualityScore,
      ),
      collaborationScore: getEditableScore(
        evaluation.collaborationScore,
      ),
      communicationScore: getEditableScore(
        evaluation.communicationScore,
      ),
      reliabilityScore: getEditableScore(
        evaluation.reliabilityScore,
      ),
      strengths: evaluation.strengths || "",
      improvementAreas:
        evaluation.improvementAreas || "",
      managerComments:
        evaluation.managerComments || "",
    });

    setErrors({});
    setSubmitError("");
  }, [evaluation, isOpen]);

  const overallScore = useMemo(() => {
    const scores = scoreFields.map(
      (field) =>
        Number(formData[field.name]) || 0,
    );

    const validScores = scores.filter(
      (score) => score > 0,
    );

    if (validScores.length === 0) {
      return 0;
    }

    const totalScore = validScores.reduce(
      (total, score) => total + score,
      0,
    );

    return roundScore(
      totalScore / validScores.length,
    );
  }, [formData]);

  if (!evaluation) {
    return null;
  }

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

    scoreFields.forEach((field) => {
      const value = formData[field.name];
      const score = Number(value);

      if (value === "") {
        nextErrors[field.name] =
          `${field.label} score is required.`;
        return;
      }

      if (
        !Number.isFinite(score) ||
        score < 1 ||
        score > 5
      ) {
        nextErrors[field.name] =
          "Score must be between 1 and 5.";
      }
    });

    if (!formData.strengths.trim()) {
      nextErrors.strengths =
        "Strengths are required.";
    }

    if (!formData.improvementAreas.trim()) {
      nextErrors.improvementAreas =
        "Improvement areas are required.";
    }

    if (!formData.managerComments.trim()) {
      nextErrors.managerComments =
        "Manager comments are required.";
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

    const updatedEvaluation = {
      ...evaluation,

      productivityScore: Number(
        formData.productivityScore,
      ),

      qualityScore: Number(
        formData.qualityScore,
      ),

      collaborationScore: Number(
        formData.collaborationScore,
      ),

      communicationScore: Number(
        formData.communicationScore,
      ),

      reliabilityScore: Number(
        formData.reliabilityScore,
      ),

      overallScore,

      strengths: formData.strengths.trim(),

      improvementAreas:
        formData.improvementAreas.trim(),

      managerComments:
        formData.managerComments.trim(),

      status:
        evaluation.status === "Not Started"
          ? "Draft"
          : evaluation.status,

      updatedAt: now,
    };

    onUpdateEvaluation?.(
      updatedEvaluation,
    );
  }

  function handleClose() {
    setFormData(emptyFormData);
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
                Edit Performance Evaluation
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                }}
              >
                Score performance and add manager feedback for{" "}
                {evaluation.employeeName}.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close edit evaluation dialog"
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
            Evaluation Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: 2,
              mb: 4,
            }}
          >
            <SummaryItem
              label="Employee"
              value={evaluation.employeeName}
            />

            <SummaryItem
              label="Review Period"
              value={evaluation.reviewPeriod}
            />

            <SummaryItem
              label="Evaluator"
              value={
                evaluation.evaluatorName ||
                "Not assigned"
              }
            />

            <SummaryItem
              label="Current Status"
              value={evaluation.status}
            />
          </Box>

          <Typography
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Performance Scores
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "minmax(260px, 0.75fr) minmax(0, 2fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <OverallScorePreview
              score={overallScore}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 2,
              }}
            >
              {scoreFields.map((field) => (
                <ScoreInputCard
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  description={field.description}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                />
              ))}
            </Box>
          </Box>

          <Typography
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Performance Feedback
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 2.5,
            }}
          >
            <TextField
              required
              fullWidth
              multiline
              minRows={5}
              label="Strengths"
              name="strengths"
              value={formData.strengths}
              onChange={handleChange}
              error={Boolean(errors.strengths)}
              helperText={
                errors.strengths ||
                `${formData.strengths.length}/800 characters`
              }
              placeholder="Describe the employee's strongest contributions and capabilities."
              slotProps={{
                htmlInput: {
                  maxLength: 800,
                },
              }}
            />

            <TextField
              required
              fullWidth
              multiline
              minRows={5}
              label="Improvement Areas"
              name="improvementAreas"
              value={
                formData.improvementAreas
              }
              onChange={handleChange}
              error={Boolean(
                errors.improvementAreas,
              )}
              helperText={
                errors.improvementAreas ||
                `${formData.improvementAreas.length}/800 characters`
              }
              placeholder="Describe areas where the employee can improve."
              slotProps={{
                htmlInput: {
                  maxLength: 800,
                },
              }}
            />

            <TextField
              required
              fullWidth
              multiline
              minRows={5}
              label="Manager Comments"
              name="managerComments"
              value={
                formData.managerComments
              }
              onChange={handleChange}
              error={Boolean(
                errors.managerComments,
              )}
              helperText={
                errors.managerComments ||
                `${formData.managerComments.length}/1000 characters`
              }
              placeholder="Provide an overall manager assessment and recommended next steps."
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              sx={{
                gridColumn: "1 / -1",
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
            Save Evaluation
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function ScoreInputCard({
  name,
  label,
  description,
  value,
  error,
  onChange,
}) {
  const score = Number(value) || 0;
  const progress = (score / 5) * 100;

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: error
          ? "error.main"
          : "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {label}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.4,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          name={name}
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          sx={{
            width: 100,
            flexShrink: 0,
          }}
        >
          <MenuItem value="">
            Score
          </MenuItem>

          <MenuItem value="1">
            1.0
          </MenuItem>

          <MenuItem value="1.5">
            1.5
          </MenuItem>

          <MenuItem value="2">
            2.0
          </MenuItem>

          <MenuItem value="2.5">
            2.5
          </MenuItem>

          <MenuItem value="3">
            3.0
          </MenuItem>

          <MenuItem value="3.5">
            3.5
          </MenuItem>

          <MenuItem value="4">
            4.0
          </MenuItem>

          <MenuItem value="4.5">
            4.5
          </MenuItem>

          <MenuItem value="5">
            5.0
          </MenuItem>
        </TextField>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 7,
          mt: 1.5,
          borderRadius: 99,

          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
          },
        }}
      />

      {error && (
        <Typography
          color="error.main"
          sx={{
            mt: 1,
            fontSize: 12,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}

function OverallScorePreview({ score }) {
  const percentage = (score / 5) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 280,
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
        <Box
          sx={{
            display: "flex",
            width: 54,
            height: 54,
            mx: "auto",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2.5,
            color: "primary.main",
            backgroundColor: "primary.light",
          }}
        >
          <StarOutlineRoundedIcon />
        </Box>

        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Overall Score
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            color: "primary.main",
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {score.toFixed(1)}
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

        <Chip
          label={getScoreLabel(score)}
          color={
            score >= 4
              ? "success"
              : score >= 3
                ? "primary"
                : score > 0
                  ? "warning"
                  : "default"
          }
          variant="outlined"
          sx={{
            mt: 2,
            fontWeight: 600,
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
        noWrap
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

function getEditableScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score) || score <= 0) {
    return "";
  }

  return String(score);
}

function roundScore(value) {
  return Math.round(value * 10) / 10;
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

export default EditPerformanceEvaluationDialog;