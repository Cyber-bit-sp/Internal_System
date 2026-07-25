import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import AppSnackbar from "../components/common/AppSnackbar";
import DailyPlanFilters from "../components/dailyPlans/DailyPlanFilters";
import DailyPlanTable from "../components/dailyPlans/DailyPlanTable";

import { dailyPlans as initialDailyPlans } from "../data/dailyPlans";

import {
  loadDailyPlans,
  resetStoredDailyPlans,
  saveDailyPlans,
} from "../utils/dailyPlanStorage";

function SummaryCard({
  title,
  value,
  icon,
  helperText,
}) {
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
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

function DailyPlansPage() {
  const [planList, setPlanList] = useState(() =>
    loadDailyPlans(initialDailyPlans),
  );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [team, setTeam] =
    useState("all");

  const [planDate, setPlanDate] =
    useState("");

  const [notification, setNotification] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  useEffect(() => {
    saveDailyPlans(planList);
  }, [planList]);

  const teamOptions = useMemo(() => {
    return [
      ...new Set(
        planList
          .map((plan) => plan.teamName)
          .filter(Boolean),
      ),
    ].sort();
  }, [planList]);

  const filteredPlans = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return planList.filter((plan) => {
      const matchesSearch =
        normalizedSearch === "" ||
        String(plan.employeeName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(plan.employeeEmail || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(plan.teamName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(plan.department || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "all" ||
        plan.status === status;

      const matchesTeam =
        team === "all" ||
        plan.teamName === team;

      const matchesDate =
        planDate === "" ||
        plan.planDate === planDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesTeam &&
        matchesDate
      );
    });
  }, [
    planList,
    searchTerm,
    status,
    team,
    planDate,
  ]);

  const completedCount = useMemo(() => {
    return planList.filter(
      (plan) => plan.status === "Completed",
    ).length;
  }, [planList]);

  const inProgressCount = useMemo(() => {
    return planList.filter(
      (plan) =>
        plan.status === "In Progress" ||
        plan.status === "Draft",
    ).length;
  }, [planList]);

  const averageProgress = useMemo(() => {
    if (planList.length === 0) {
      return 0;
    }

    const totalProgress = planList.reduce(
      (total, plan) =>
        total + Number(plan.progress || 0),
      0,
    );

    return Math.round(
      totalProgress / planList.length,
    );
  }, [planList]);

  function clearFilters() {
    setSearchTerm("");
    setStatus("all");
    setTeam("all");
    setPlanDate("");
  }

  function showNotification(
    message,
    severity = "success",
  ) {
    setNotification({
      open: true,
      message,
      severity,
    });
  }

  function closeNotification() {
    setNotification(
      (currentNotification) => ({
        ...currentNotification,
        open: false,
      }),
    );
  }

  function handleResetPlans() {
    resetStoredDailyPlans();

    setPlanList(
      initialDailyPlans.map((plan) => ({
        ...plan,
      })),
    );

    clearFilters();

    showNotification(
      "Demo daily plan data was reset successfully.",
      "info",
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3.5 }}
        >
          <Box>
            <Typography variant="h4">
              Daily Plans
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Record daily tasks, monitor progress, and
              review employee completion.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              variant="outlined"
              startIcon={
                <RestartAltRoundedIcon />
              }
              onClick={handleResetPlans}
            >
              Reset Demo Data
            </Button>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() =>
                console.log("Create daily plan")
              }
            >
              Create Plan
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: 2.25,
            mb: 3,
          }}
        >
          <SummaryCard
            title="Total Plans"
            value={planList.length}
            icon={<AssignmentOutlinedIcon />}
            helperText="All available daily plans"
          />

          <SummaryCard
            title="Completed"
            value={completedCount}
            icon={
              <CheckCircleOutlineRoundedIcon />
            }
            helperText="Plans marked as completed"
          />

          <SummaryCard
            title="In Progress"
            value={inProgressCount}
            icon={<PendingActionsOutlinedIcon />}
            helperText="Draft and active plans"
          />

          <SummaryCard
            title="Average Progress"
            value={`${averageProgress}%`}
            icon={<TrendingUpRoundedIcon />}
            helperText="Average across all plans"
          />
        </Box>

        <DailyPlanFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={status}
          onStatusChange={setStatus}
          team={team}
          onTeamChange={setTeam}
          planDate={planDate}
          onPlanDateChange={setPlanDate}
          teams={teamOptions}
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
          Showing {filteredPlans.length} of{" "}
          {planList.length} plans
        </Typography>

        <DailyPlanTable
          plans={filteredPlans}
          onViewPlan={(plan) =>
            console.log("View plan:", plan)
          }
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

export default DailyPlansPage;