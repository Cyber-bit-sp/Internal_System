import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

import AppSnackbar from "../components/common/AppSnackbar";
import PerformanceFilters from "../components/performance/PerformanceFilters";
import PerformanceTable from "../components/performance/PerformanceTable";
import PerformanceEvaluationDetailsDialog from "../components/performance/PerformanceEvaluationDetailsDialog";

import { performanceEvaluations as initialEvaluations } from "../data/performanceEvaluations";

import {
  loadPerformanceEvaluations,
  resetStoredPerformanceEvaluations,
  savePerformanceEvaluations,
} from "../utils/performanceEvaluationStorage";

function SummaryCard({ title, value, icon, helperText }) {
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

          <Box sx={{ minWidth: 0 }}>
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

            {helperText && (
              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  fontSize: 11,
                }}
              >
                {helperText}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PerformancePage() {
  const [evaluationList, setEvaluationList] = useState(() =>
    loadPerformanceEvaluations(initialEvaluations),
  );

  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [status, setStatus] = useState("all");

  const [team, setTeam] = useState("all");

  const [reviewPeriod, setReviewPeriod] = useState("all");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    savePerformanceEvaluations(evaluationList);
  }, [evaluationList]);

  const teamOptions = useMemo(() => {
    return [
      ...new Set(
        evaluationList.map((evaluation) => evaluation.teamName).filter(Boolean),
      ),
    ].sort();
  }, [evaluationList]);

  const reviewPeriodOptions = useMemo(() => {
    return [
      ...new Set(
        evaluationList
          .map((evaluation) => evaluation.reviewPeriod)
          .filter(Boolean),
      ),
    ].sort((firstPeriod, secondPeriod) =>
      secondPeriod.localeCompare(firstPeriod, undefined, {
        numeric: true,
      }),
    );
  }, [evaluationList]);

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return evaluationList.filter((evaluation) => {
      const matchesSearch =
        normalizedSearch === "" ||
        String(evaluation.employeeName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(evaluation.employeeEmail || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(evaluation.teamName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(evaluation.department || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(evaluation.evaluatorName || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus = status === "all" || evaluation.status === status;

      const matchesTeam = team === "all" || evaluation.teamName === team;

      const matchesReviewPeriod =
        reviewPeriod === "all" || evaluation.reviewPeriod === reviewPeriod;

      return (
        matchesSearch && matchesStatus && matchesTeam && matchesReviewPeriod
      );
    });
  }, [evaluationList, searchTerm, status, team, reviewPeriod]);

  const completedCount = useMemo(() => {
    return evaluationList.filter(
      (evaluation) => evaluation.status === "Completed",
    ).length;
  }, [evaluationList]);

  const pendingCount = useMemo(() => {
    return evaluationList.filter(
      (evaluation) => evaluation.status !== "Completed",
    ).length;
  }, [evaluationList]);

  const averageScore = useMemo(() => {
    const scoredEvaluations = evaluationList.filter(
      (evaluation) => Number(evaluation.overallScore) > 0,
    );

    if (scoredEvaluations.length === 0) {
      return 0;
    }

    const totalScore = scoredEvaluations.reduce(
      (total, evaluation) => total + Number(evaluation.overallScore || 0),
      0,
    );

    return totalScore / scoredEvaluations.length;
  }, [evaluationList]);

  function clearFilters() {
    setSearchTerm("");
    setStatus("all");
    setTeam("all");
    setReviewPeriod("all");
  }

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

  function handleResetEvaluations() {
    resetStoredPerformanceEvaluations();

    setEvaluationList(
      initialEvaluations.map((evaluation) => ({
        ...evaluation,
      })),
    );

    clearFilters();
    setSelectedEvaluation(null);

    showNotification(
      "Demo performance evaluation data was reset successfully.",
      "info",
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          px: 3,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{
            mb: 3.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography variant="h4">Performance Evaluation</Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 720,
              }}
            >
              Review employee performance using daily-plan completion,
              consistency, quality, and manager feedback.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
            }}
          >
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={handleResetEvaluations}
            >
              Reset Demo Data
            </Button>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => console.log("Create evaluation")}
            >
              Create Evaluation
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2.25,
            mb: 3,
          }}
        >
          <SummaryCard
            title="Total Evaluations"
            value={evaluationList.length}
            icon={<AssessmentOutlinedIcon />}
            helperText="All review records"
          />

          <SummaryCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircleOutlineRoundedIcon />}
            helperText="Finalized evaluations"
          />

          <SummaryCard
            title="Pending"
            value={pendingCount}
            icon={<PendingActionsOutlinedIcon />}
            helperText="Evaluations needing action"
          />

          <SummaryCard
            title="Average Score"
            value={averageScore.toFixed(1)}
            icon={<StarOutlineRoundedIcon />}
            helperText="Average out of 5.0"
          />
        </Box>

        <PerformanceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={status}
          onStatusChange={setStatus}
          team={team}
          onTeamChange={setTeam}
          reviewPeriod={reviewPeriod}
          onReviewPeriodChange={setReviewPeriod}
          teams={teamOptions}
          reviewPeriods={reviewPeriodOptions}
          onClearFilters={clearFilters}
        />

        <Typography
          color="text.secondary"
          sx={{
            mb: 1.25,
            textAlign: "right",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Showing {filteredEvaluations.length} of {evaluationList.length}{" "}
          evaluations
        </Typography>

        <PerformanceTable
          evaluations={filteredEvaluations}
          onViewEvaluation={setSelectedEvaluation}
        />

        <PerformanceEvaluationDetailsDialog
          evaluation={selectedEvaluation}
          isOpen={Boolean(selectedEvaluation)}
          onClose={() => setSelectedEvaluation(null)}
          onEdit={(evaluation) => {
            console.log("Edit evaluation:", evaluation);
          }}
          onSubmit={(evaluation) => {
            console.log("Submit evaluation:", evaluation);
          }}
          onAcknowledge={(evaluation) => {
            console.log("Acknowledge evaluation:", evaluation);
          }}
          onComplete={(evaluation) => {
            console.log("Complete evaluation:", evaluation);
          }}
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

export default PerformancePage;
