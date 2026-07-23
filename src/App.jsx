import { useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import UsersPage from "./pages/UsersPage";

function App() {
  const [activePage, setActivePage] =
    useState("users");

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;

      case "users":
        return <UsersPage />;

      case "teams":
        return (
          <PlaceholderPage
            title="Team Management"
            description="Create teams, assign managers, and organize employees."
          />
        );

      case "daily-plans":
        return (
          <PlaceholderPage
            title="Daily Plans"
            description="Plan work, record progress, and track daily completion."
          />
        );

      case "performance":
        return (
          <PlaceholderPage
            title="Performance Evaluation"
            description="Review employee progress, consistency, and manager feedback."
          />
        );

      case "settings":
        return (
          <PlaceholderPage
            title="Settings"
            description="Configure organization and application preferences."
          />
        );

      default:
        return <UsersPage />;
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;