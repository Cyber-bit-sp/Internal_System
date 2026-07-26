import { useEffect, useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

function ManagerReviewDialog({
  plan,
  isOpen,
  onClose,
  onApprove,
  onReturn,
  onComplete,
}) {
  const [reviewComment, setReviewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !plan) {
      return;
    }

    setReviewComment(plan.reviewComment || "");
    setError("");
  }, [isOpen, plan]);

  if (!plan) {
    return null;
  }

  const progress = normalizeProgress(plan.progress);
  const isSubmitted = plan.status === "Submitted";
  const isApproved = plan.status === "Approved";
  const canComplete = isApproved && progress === 100;

  function handleApprove() {
    const now = new Date().toISOString();

    onApprove?.({
      ...plan,
      status: "Approved",
      reviewStatus: "Approved",
      reviewComment: reviewComment.trim(),
      reviewedBy: "Alex Davis",
      reviewedAt: now,
      updatedAt: now,
    });
  }

  function handleReturn() {
    if (!reviewComment.trim()) {
      setError(
        "A review comment is required when returning a plan.",
      );
      return;
    }

    const now = new Date().toISOString();

    onReturn?.({
      ...plan,
      status: "In Progress",
      reviewStatus: "Returned",
      reviewComment: reviewComment.trim(),
      reviewedBy: "Alex Davis",
      reviewedAt: now,
      updatedAt: now,
      submittedAt: null,
    });
  }

  function handleComplete() {
    if (!canComplete) {
      return;
    }

    const now = new Date().toISOString();

    onComplete?.({
      ...plan,
      status: "Completed",
      reviewStatus: "Completed",
      reviewComment: reviewComment.trim(),
      reviewedBy: plan.reviewedBy || "Alex Davis",
      reviewedAt: plan.reviewedAt || now,
      completedAt: now,
      updatedAt: now,
    });
  }

  function handleClose() {
    setReviewComment("");
    setError("");
    onClose?.();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
            <FactCheckOutlinedIcon />
          </Box>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Manager Review
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Review the submitted work and choose the next
              action.
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
              label="Status"
              value={plan.status}
            />

            <SummaryItem
              label="Progress"
              value={`${progress}%`}
            />

            <SummaryItem
              label="Tasks"
              value={`${plan.completedTaskCount || 0}/${
                plan.taskCount || 0
              }`}
            />
          </Box>

          {isSubmitted && (
            <Alert severity="info">
              Approving this plan confirms that the manager has
              reviewed it. Returning it unlocks the plan for
              employee changes.
            </Alert>
          )}

          {isApproved && progress < 100 && (
            <Alert severity="warning">
              This plan is approved, but it cannot be completed
              until progress reaches 100%.
            </Alert>
          )}

          {canComplete && (
            <Alert severity="success">
              This approved plan is ready to be marked as
              completed.
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Manager Review Comment"
            value={reviewComment}
            onChange={(event) => {
              setReviewComment(event.target.value);
              setError("");
            }}
            placeholder="Add feedback, approval notes, or requested changes."
            helperText={`${reviewComment.length}/500 characters`}
            slotProps={{
              htmlInput: {
                maxLength: 500,
              },
            }}
          />

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Returning a plan requires a comment so the employee
            understands what must be revised.
          </Typography>
        </Stack>
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
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Stack direction="row" spacing={1}>
          {isSubmitted && (
            <>
              <Button
                color="warning"
                variant="outlined"
                startIcon={<ReplayRoundedIcon />}
                onClick={handleReturn}
              >
                Return for Revision
              </Button>

              <Button
                color="success"
                variant="contained"
                startIcon={
                  <CheckCircleOutlineRoundedIcon />
                }
                onClick={handleApprove}
              >
                Approve Plan
              </Button>
            </>
          )}

          {isApproved && (
            <Button
              color="success"
              variant="contained"
              disabled={!canComplete}
              startIcon={
                <CheckCircleOutlineRoundedIcon />
              }
              onClick={handleComplete}
            >
              Complete Plan
            </Button>
          )}
        </Stack>
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

export default ManagerReviewDialog;