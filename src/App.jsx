import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import UsersPage from "./pages/UsersPage";
import TeamsPage from "./pages/TeamsPage";
import DailyPlansPage from "./pages/DailyPlansPage";
import PerformancePage from "./pages/PerformancePage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/users" element={<UsersPage />} />

        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/daily-plans" element={<DailyPlansPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Route>

      <Route
        path="/settings"
        element={
          <PlaceholderPage
            title="Settings"
            description="Configure organization and application preferences."
          />
        }
      />

      <Route path="/" element={<Navigate to="/users" replace />} />

      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}

export default App;
