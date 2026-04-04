import { Suspense, lazy, useState } from "react";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import PageLoader from "./components/PageLoader";
import { isAdminLoggedIn } from "./utils/store";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AppShell = lazy(() => import("./components/AppShell"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentsPage = lazy(() => import("./pages/StudentsPage"));

function AppContent() {
  const [page, setPage] = useState(() => (isAdminLoggedIn() ? "dashboard" : "home"));

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  let content = null;
  if (page === "home")     content = <LandingPage  navigate={navigate} />;
  if (page === "register") content = <RegisterPage navigate={navigate} />;
  if (page === "login")    content = <LoginPage navigate={navigate} onLogin={(ok) => ok && navigate("dashboard")} />;

  if (!content) {
    content = (
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

  return content;
}

export default function App() {
  return (
    <AppSettingsProvider>
      <Suspense fallback={<PageLoader />}>
        <AppContent />
      </Suspense>
    </AppSettingsProvider>
  );
}
