import { useEffect } from "react";
import AdminDashboard from "../modules/dashboard/AdminDashboard";
import DoctorDashboard from "../modules/doctors/DoctorDashboard";

function App() {
  const isDoctorPortal = window.location.pathname.replace(/\/+$/, "") === "/doctor";

  useEffect(() => {
    document.title = isDoctorPortal ? "Doctor portal | MediTrack" : "Admin dashboard | MediTrack";
  }, [isDoctorPortal]);

  return isDoctorPortal ? <DoctorDashboard /> : <AdminDashboard />;
}

export default App;
