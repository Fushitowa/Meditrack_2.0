import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import WorkspaceSectionPage, { type PortalRole, type PortalSection } from "../modules/portal/WorkspaceSectionPage";
import AdminDashboard from "../modules/dashboard/AdminDashboard";
import DoctorDashboard from "../modules/doctors/DoctorDashboard";

const routeTitles: Record<string, string> = {
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
        <Route path="/" element={<Navigate replace to="/admin" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<SectionRoute role="admin" section="patients" />} />
        <Route path="/admin/doctors" element={<SectionRoute role="admin" section="doctors" />} />
        <Route path="/admin/appointments" element={<SectionRoute role="admin" section="appointments" />} />
        <Route path="/admin/records" element={<SectionRoute role="admin" section="records" />} />
        <Route path="/admin/access" element={<SectionRoute role="admin" section="access" />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<SectionRoute role="doctor" section="appointments" />} />
        <Route path="/doctor/patients" element={<SectionRoute role="doctor" section="patients" />} />
        <Route path="/doctor/records" element={<SectionRoute role="doctor" section="records" />} />
        <Route path="*" element={<Navigate replace to="/admin" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
