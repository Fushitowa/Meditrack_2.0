import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminDashboard from "./modules/dashboard/AdminDashboard";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminDashboard />
  </StrictMode>,
);
