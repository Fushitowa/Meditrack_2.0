import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "../auth/AuthProvider";
import { HomeRedirect, RequireRole } from "../auth/AuthRoutes";
import ChangePasswordPage from "../modules/authentication/ChangePasswordPage";
import LoginPage from "../modules/authentication/LoginPage";
import WorkspaceSectionPage, { type PortalRole, type PortalSection } from "../modules/portal/WorkspaceSectionPage";
import AdminDashboard from "../modules/dashboard/AdminDashboard";
import DoctorDashboard from "../modules/doctors/DoctorDashboard";

const routeTitles: Record<string, string> = {
  "/login": "Sign in",
  "/change-password": "Change password",
  "/admin": "Admin dashboard",
  "/admin/patients": "Patients",
  "/admin/doctors": "Doctors",
  "/admin/appointments": "Appointments",
  "/admin/records": "Clinical records",
  "/admin/access": "Roles & permissions",
  "/doctor": "Doctor dashboard",
  "/doctor/appointments": "My appointments",
  "/doctor/patients": "My patients",
  "/doctor/records": "My clinical records",
};

function PageTitle() {
  const { pathname } = useLocation();
  const title = routeTitles[pathname] ?? "MediTrack";
  useEffect(() => {
    document.title = `${title} | MediTrack`;
  }, [title]);

  return null;
}

function SectionRoute({ role, section }: { role: PortalRole; section: PortalSection }) {
  return <WorkspaceSectionPage role={role} section={section} />;
}

function AppRoutes() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="/admin/patients" element={<RequireRole role="admin"><SectionRoute role="admin" section="patients" /></RequireRole>} />
        <Route path="/admin/doctors" element={<RequireRole role="admin"><SectionRoute role="admin" section="doctors" /></RequireRole>} />
        <Route path="/admin/appointments" element={<RequireRole role="admin"><SectionRoute role="admin" section="appointments" /></RequireRole>} />
        <Route path="/admin/records" element={<RequireRole role="admin"><SectionRoute role="admin" section="records" /></RequireRole>} />
        <Route path="/admin/access" element={<RequireRole role="admin"><SectionRoute role="admin" section="access" /></RequireRole>} />
        <Route path="/doctor" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
        <Route path="/doctor/appointments" element={<RequireRole role="doctor"><SectionRoute role="doctor" section="appointments" /></RequireRole>} />
        <Route path="/doctor/patients" element={<RequireRole role="doctor"><SectionRoute role="doctor" section="patients" /></RequireRole>} />
        <Route path="/doctor/records" element={<RequireRole role="doctor"><SectionRoute role="doctor" section="records" /></RequireRole>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
