import { useState } from "react";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { isAdminLoggedIn } from "./utils/store";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";

function AppContent() {
  const [page, setPage] = useState(() => (isAdminLoggedIn() ? "dashboard" : "home"));

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  switch (page) {
    case "home":
      return <LandingPage navigate={navigate} />;
    case "register":
      return <RegisterPage navigate={navigate} />;
    case "login":
      return <LoginPage navigate={navigate} onLogin={(ok) => ok && navigate("dashboard")} />;
    default:
      return (
        <AppShell page={page} navigate={navigate}>
          {page === "dashboard" && (
            isAdminLoggedIn()
              ? <Dashboard navigate={navigate} />
              : <LoginPage navigate={navigate} onLogin={(ok) => ok && navigate("dashboard")} />
          )}
          {page === "students" && <StudentsPage navigate={navigate} isAdmin={isAdminLoggedIn()} />}
        </AppShell>
      );
  }
}

export default function App() {
  return (
    <AppSettingsProvider>
      <AppContent />
    </AppSettingsProvider>
  );
}
