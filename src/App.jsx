import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/users"
          element={<UsersPage />}
        />

        <Route
          path="/teams"
          element={
            <PlaceholderPage
              title="Team Management"
              description="Create teams, assign managers, and organize employees."
            />
          }
        />

        <Route
          path="/daily-plans"
          element={
            <PlaceholderPage
              title="Daily Plans"
              description="Plan work, record progress, and track daily completion."
            />
          }
        />

        <Route
          path="/performance"
          element={
            <PlaceholderPage
              title="Performance Evaluation"
              description="Review employee progress, consistency, and manager feedback."
            />
          }
        />

        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Configure organization and application preferences."
            />
          }
        />

        <Route
          path="/"
          element={<Navigate to="/users" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/users" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;