import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminOnly } from "./guards/AdminOnly";
import { PublicOnly } from "./guards/PublicOnly";
import { MonitorOnly } from "./guards/MonitorOnly";

const DashboardPage = lazy(() =>
  import("./pages/private/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const DashboardMonitor = lazy(() =>
  import("./pages/private/DashboardMonitor").then((module) => ({ default: module.DashboardMonitor })),
);
const IndexPage = lazy(() =>
  import("./pages/public/IndexPage").then((module) => ({ default: module.IndexPage })),
);
const CourtPage = lazy(() =>
  import("./pages/public/CourtPage").then((module) => ({ default: module.CourtPage })),
);
const ClubPage = lazy(() =>
  import("./pages/public/ClubPage").then((module) => ({ default: module.ClubPage })),
);
const Profile = lazy(() =>
  import("./pages/public/Profile").then((module) => ({ default: module.Profile })),
);
const Horarios = lazy(() =>
  import("./pages/public/Horarios").then((module) => ({ default: module.Horarios })),
);
const Login = lazy(() =>
  import("./pages/public/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/public/Register").then((module) => ({ default: module.Register })),
);

const ClassesPage = lazy(() =>
  import("./pages/public/ClassesPage").then((module) => ({ default: module.ClassesPage })),
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <span>Cargando...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Dashboard */}
        <Route element={<AdminOnly redirectPath="/login" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/:page" element={<DashboardPage />} />
        </Route>

        <Route element={<MonitorOnly redirectPath="/login" />}>
          <Route path="/dashboard/monitor" element={<DashboardMonitor />} />
        </Route>

        {/* Public */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/pistas" element={<CourtPage />} />
        <Route path="/clubes" element={<ClubPage />} />
        <Route path="/horarios" element={<Horarios />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/clases" element={<ClassesPage />} />

        {/* Auth */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
