import { useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  appointments,
  clinicalRecords,
  doctors,
  patients,
  type Appointment,
  type ClinicalRecord,
  type Doctor,
  type Patient,
} from "../../data/previewData";
import "./WorkspaceSectionPage.css";

export type PortalRole = "admin" | "doctor";
export type PortalSection = "patients" | "doctors" | "appointments" | "records" | "access";

type WorkspaceIcon =
  | "overview"
  | "patients"
  | "doctors"
  | "appointments"
  | "records"
  | "access"
  | "search"
  | "arrow";

interface PageRow {
  id: string;
  initials: string;
  color: string;
  primary: string;
  secondary: string;
  cells: string[];
  status: string;
}

interface PageDefinition {
  title: string;
  description: string;
  searchLabel: string;
  columns: string[];
  rows: PageRow[];
}

interface NavItem {
  title: string;
  to: string;
  icon: WorkspaceIcon;
}

function WorkspaceIconView({ name }: { name: WorkspaceIcon }) {
  const paths: Record<WorkspaceIcon, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    patients: <><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="7" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" /></>,
    doctors: <><path d="M12 3v6m-3-3h6" /><path d="M6 12v2a6 6 0 0 0 12 0v-2" /><path d="M6 12a2.5 2.5 0 1 1-5 0v-1a2.5 2.5 0 0 1 5 0v1Zm18 0a2.5 2.5 0 1 1-5 0v-1a2.5 2.5 0 0 1 5 0v1Z" /><path d="M12 20v2" /></>,
    appointments: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    records: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    access: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="workspace-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function getNavigation(role: PortalRole): NavItem[] {
  if (role === "admin") {
    return [
      { title: "Overview", to: "/admin", icon: "overview" },
      { title: "Patients", to: "/admin/patients", icon: "patients" },
      { title: "Doctors", to: "/admin/doctors", icon: "doctors" },
      { title: "Appointments", to: "/admin/appointments", icon: "appointments" },
      { title: "Clinical records", to: "/admin/records", icon: "records" },
      { title: "Roles & permissions", to: "/admin/access", icon: "access" },
    ];
  }

  return [
    { title: "Overview", to: "/doctor", icon: "overview" },
    { title: "Appointments", to: "/doctor/appointments", icon: "appointments" },
    { title: "My patients", to: "/doctor/patients", icon: "patients" },
    { title: "Clinical records", to: "/doctor/records", icon: "records" },
  ];
}

function getPatientRows(source: Patient[]): PageRow[] {
  return source.map((patient) => ({
    id: patient.id,
    initials: patient.initials,
    color: patient.color,
    primary: patient.name,
    secondary: patient.id,
    cells: [`${patient.age} yrs`, patient.doctor, patient.date],
    status: patient.status,
  }));
}

function getDoctorRows(source: Doctor[]): PageRow[] {
  return source.map((doctor) => ({
    id: doctor.initials,
    initials: doctor.initials,
    color: doctor.color,
    primary: `Dr. ${doctor.name}`,
    secondary: doctor.specialty,
    cells: [doctor.email, doctor.phone, `${doctor.patientCount}`],
    status: doctor.availability,
  }));
}

function getAppointmentRows(source: Appointment[]): PageRow[] {
  return source.map((appointment) => ({
    id: `${appointment.time}-${appointment.patientId}`,
    initials: appointment.initials,
    color: appointment.color,
    primary: appointment.name,
    secondary: appointment.patientId,
    cells: [appointment.displayTime, appointment.reason, appointment.doctor],
    status: appointment.status,
  }));
}

function getRecordRows(source: ClinicalRecord[]): PageRow[] {
  return source.map((record) => ({
    id: record.id,
    initials: record.patient.split(" ").map((part) => part[0]).join(""),
    color: "mint",
    primary: record.patient,
    secondary: `${record.id} · ${record.type}`,
    cells: [record.date, record.doctor, record.diagnosis],
    status: record.status,
  }));
}

function getDefinition(role: PortalRole, section: PortalSection): PageDefinition {
  if (section === "patients") {
    const source = role === "doctor" ? [] : patients;
    return {
      title: role === "doctor" ? "My patients" : "Patients",
      description: role === "doctor"
        ? "Review the patients currently assigned to your care."
        : "Search and review patient profiles across your clinic.",
      searchLabel: "Search patients",
      columns: ["Age", "Assigned doctor", "Last visit"],
      rows: getPatientRows(source),
    };
  }

  if (section === "doctors" && role === "admin") {
    return {
      title: "Doctors",
      description: "Manage your clinic's doctor directory and availability.",
      searchLabel: "Search doctors",
      columns: ["Email", "Phone", "Patients"],
      rows: getDoctorRows(doctors),
    };
  }

  if (section === "appointments") {
    const source = role === "doctor" ? [] : appointments;
    return {
      title: role === "doctor" ? "My appointments" : "Appointments",
      description: role === "doctor"
        ? "Your upcoming clinic schedule and patient visits."
        : "Today’s scheduled visits across all providers.",
      searchLabel: "Search appointments",
      columns: ["Time", "Visit reason", "Doctor"],
      rows: getAppointmentRows(source),
    };
  }

  if (section === "records") {
    const source = role === "doctor" ? [] : clinicalRecords;
    return {
      title: role === "doctor" ? "My clinical records" : "Clinical records",
      description: role === "doctor"
        ? "Review your clinical notes and documentation status."
        : "Review clinical documentation recorded by your care team.",
      searchLabel: "Search clinical records",
      columns: ["Visit date", "Clinician", "Diagnosis"],
      rows: getRecordRows(source),
    };
  }

  return {
    title: "Roles & permissions",
    description: "Review access boundaries configured for the clinic workspace.",
    searchLabel: "Search roles",
    columns: ["Users", "Patient access", "Clinical records", "Administration"],
    rows: [
      { id: "admin", initials: "AD", color: "lavender", primary: "Administrator", secondary: "Full clinic management", cells: ["1 demo user", "All clinic patients", "All clinic records", "Manage team and access"], status: "Configured" },
      { id: "doctor", initials: "DR", color: "mint", primary: "Doctor", secondary: "Clinical care team", cells: ["0 users", "Assigned patients", "Assigned patient records", "No access"], status: "Configured" },
      { id: "staff", initials: "ST", color: "blue", primary: "Staff", secondary: "Clinic operations", cells: ["0 demo users", "No access", "No access", "No access"], status: "Restricted" },
    ],
  };
}

function statusClass(status: string) {
  const normalized = status.toLowerCase().replaceAll(" ", "-");
  if (["available", "checked-in", "signed", "configured"].includes(normalized)) return "workspace-status-success";
  if (["upcoming", "scheduled", "restricted"].includes(normalized)) return "workspace-status-neutral";
  if (["in-consultation", "in-progress", "awaiting-review", "with-patient"].includes(normalized)) return "workspace-status-attention";
  return "workspace-status-neutral";
}

function initialsClass(color: string) {
  return `workspace-avatar avatar-${color}`;
}

function WorkspaceSectionPage({ role, section }: { role: PortalRole; section: PortalSection }) {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const definition = useMemo(() => getDefinition(role, section), [role, section]);
  const navigation = getNavigation(role);
  const isAdmin = role === "admin";
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return definition.rows.filter((row) => {
      const matchesQuery = !normalizedQuery
        || [row.primary, row.secondary, row.status, ...row.cells]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "All statuses" || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [definition.rows, query, statusFilter]);
  const statuses = [...new Set(definition.rows.map((row) => row.status))];
  const currentNav = navigation.find((item) => item.to === location.pathname);
  const roleTitle = isAdmin ? "Admin workspace" : "Doctor workspace";
  const statistic = {
    patients: { label: "Active patients", statuses: ["Checked in", "In consultation", "Scheduled"] },
    doctors: { label: "Available doctors", statuses: ["Available"] },
    appointments: { label: "Upcoming", statuses: ["Upcoming"] },
    records: { label: "Needs review", statuses: ["In progress", "Awaiting review"] },
    access: { label: "Restricted roles", statuses: ["Restricted"] },
  }[section];
  const secondaryCount = definition.rows.filter((row) => statistic.statuses.includes(row.status)).length;

  return (
    <div className={`workspace-page ${isAdmin ? "workspace-admin" : "workspace-doctor"}`}>
      <aside className="workspace-sidebar">
        <Link
          aria-label={isAdmin ? "MediTrack admin workspace" : "MediTrack doctor workspace"}
          className="workspace-brand"
          to={isAdmin ? "/admin" : "/doctor"}
        >
          <span className="workspace-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="13" fill="currentColor" />
              <path d="M20 10.5v19M10.5 20h19" stroke="white" strokeLinecap="round" strokeWidth="3.5" />
              <circle cx="20" cy="20" r="2.2" fill="white" />
            </svg>
          </span>
          <span>MediTrack</span>
          <span className="workspace-role-label">{isAdmin ? "ADMIN" : "DOCTOR"}</span>
        </Link>

        <div className="workspace-clinic">
          <span className="workspace-clinic-mark">NC</span>
          <span><strong>Northstar Clinic</strong><small>{isAdmin ? "Admin workspace" : "Doctor workspace"}</small></span>
        </div>

        <nav className="workspace-navigation" aria-label={isAdmin ? "Admin portal" : "Doctor portal"}>
          <span className="workspace-nav-label">{isAdmin ? "WORKSPACE" : "MY WORKSPACE"}</span>
          {navigation.map((item) => (
            <NavLink
              aria-label={item.title}
              className={({ isActive }) => `workspace-nav-link${isActive ? " active" : ""}`}
              end
              key={item.to}
              title={item.title}
              to={item.to}
            >
              <WorkspaceIconView name={item.icon} />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="workspace-sidebar-bottom">
          <Link
            aria-label={isAdmin ? "Open doctor portal" : "Switch to admin portal"}
            className="workspace-switch"
            to={isAdmin ? "/doctor" : "/admin"}
          >
            <WorkspaceIconView name={isAdmin ? "doctors" : "overview"} />
            <span>{isAdmin ? "Open doctor portal" : "Switch to admin portal"}</span>
            <WorkspaceIconView name="arrow" />
          </Link>
          <div className="workspace-user">
            <span className={`workspace-avatar ${isAdmin ? "avatar-teal" : "avatar-blue"}`}>{isAdmin ? "CA" : "EC"}</span>
            <span><strong>{isAdmin ? "Clinic Admin" : "Doctor"}</strong><small>{isAdmin ? "Administrator" : "Clinician"}</small></span>
          </div>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb"><span>{roleTitle}</span><span>/</span><strong>{currentNav?.title ?? definition.title}</strong></div>
          <Link className="workspace-back-link" to={isAdmin ? "/admin" : "/doctor"}>
            Back to overview <WorkspaceIconView name="arrow" />
          </Link>
        </header>

        <div className="workspace-content">
          <header className="workspace-page-heading">
            <div>
              <span className="workspace-eyebrow">{roleTitle.toUpperCase()}</span>
              <h1>{definition.title}</h1>
              <p>{definition.description}</p>
            </div>
          </header>

          <div className="workspace-preview-banner">
            <span />
            Preview data
            <small>This view is read-only and uses sample data until Supabase is connected.</small>
          </div>

          <section className="workspace-summary" aria-label={`${definition.title} summary`}>
            <article><span>Records in preview</span><strong>{definition.rows.length}</strong><small>Displayed in this demo</small></article>
            <article><span>{statistic.label}</span><strong>{secondaryCount}</strong><small>Based on current sample statuses</small></article>
            <article><span>Workspace</span><strong>{isAdmin ? "Admin" : "Doctor"}</strong><small>{isAdmin ? "Clinic-wide view" : "Assigned care view"}</small></article>
          </section>

          <section className="workspace-table-panel" aria-label={definition.title}>
            <div className="workspace-table-heading">
              <div><h2>{definition.title} directory</h2><p>{rows.length} of {definition.rows.length} sample records</p></div>
              <div className="workspace-table-controls">
                <label className="workspace-search">
                  <WorkspaceIconView name="search" />
                  <input
                    aria-label={definition.searchLabel}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={definition.searchLabel}
                    value={query}
                  />
                </label>
                <label className="workspace-filter-label">
                  <span className="sr-only">Filter by status</span>
                  <select
                    aria-label="Filter by status"
                    onChange={(event) => setStatusFilter(event.target.value)}
                    value={statusFilter}
                  >
                    <option>All statuses</option>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="workspace-table-scroll">
              <table className="workspace-table">
                <thead>
                  <tr>
                    <th>{section === "appointments" ? "Patient" : section === "records" ? "Patient / Record" : section === "access" ? "Role" : section === "doctors" ? "Doctor" : "Patient"}</th>
                    {definition.columns.map((column) => <th key={column}>{column}</th>)}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="workspace-primary-cell">
                          <span className={initialsClass(row.color)}>{row.initials}</span>
                          <span><strong>{row.primary}</strong><small>{row.secondary}</small></span>
                        </div>
                      </td>
                      {row.cells.map((cell, index) => <td key={`${row.id}-${index}`}>{cell}</td>)}
                      <td><span className={`workspace-status ${statusClass(row.status)}`}><i />{row.status}</span></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td className="workspace-empty" colSpan={definition.columns.length + 2}>No records match the current search or status filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="workspace-table-footer">
              <span>Showing {rows.length} sample {rows.length === 1 ? "record" : "records"}</span>
              {(query || statusFilter !== "All statuses") && (
                <button type="button" onClick={() => { setQuery(""); setStatusFilter("All statuses"); }}>Clear filters</button>
              )}
            </footer>
          </section>

          <footer className="workspace-page-footer"><span>© {new Date().getFullYear()} MediTrack</span><span>{roleTitle} · Preview only</span></footer>
        </div>
      </main>
    </div>
  );
}

export default WorkspaceSectionPage;
