import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  appointments,
  doctors,
  patients,
  recentActivity as activity,
} from "../../data/previewData";
import "./AdminDashboard.css";

type IconName =
  | "overview"
  | "patients"
  | "doctors"
  | "appointments"
  | "records"
  | "search"
  | "arrow"
  | "calendar"
  | "clock"
  | "plus"
  | "more";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    patients: <><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="7" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" /></>,
    doctors: <><path d="M12 3v6m-3-3h6" /><path d="M6 12v2a6 6 0 0 0 12 0v-2" /><path d="M6 12a2.5 2.5 0 1 1-5 0v-1a2.5 2.5 0 0 1 5 0v1Zm18 0a2.5 2.5 0 1 1-5 0v-1a2.5 2.5 0 0 1 5 0v1Z" /><path d="M12 20v2" /></>,
    appointments: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    records: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="dashboard-icon"
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

const weeklyVisits = [
  { day: "Mon", value: 54 },
  { day: "Tue", value: 73 },
  { day: "Wed", value: 62 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 42 },
  { day: "Sun", value: 28 },
];

function initialsClass(color: string) {
  return `person-avatar avatar-${color}`;
}

function AdminDashboard() {
  const [patientSearch, setPatientSearch] = useState("");
  const visiblePatients = patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.doctor}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase()),
  );
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const todayHeading = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date()).toUpperCase();

  const navigation = [
    { label: "Overview", to: "/admin", icon: "overview" as const },
    { label: "Patients", to: "/admin/patients", icon: "patients" as const },
    { label: "Doctors", to: "/admin/doctors", icon: "doctors" as const },
    { label: "Appointments", to: "/admin/appointments", icon: "appointments" as const },
    { label: "Clinical records", to: "/admin/records", icon: "records" as const },
    { label: "Roles & permissions", to: "/admin/access", icon: "records" as const },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" to="/admin" aria-label="MediTrack dashboard">
          <span className="dashboard-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="13" fill="currentColor" />
              <path d="M20 10.5v19M10.5 20h19" stroke="white" strokeLinecap="round" strokeWidth="3.5" />
              <circle cx="20" cy="20" r="2.2" fill="white" />
            </svg>
          </span>
          <span>MediTrack</span>
          <span className="brand-admin-label">ADMIN</span>
        </Link>

        <div className="sidebar-clinic">
          <span className="clinic-avatar">NC</span>
          <span className="clinic-copy">
            <strong>Northstar Clinic</strong>
            <span>Workspace</span>
          </span>
          <span className="clinic-switch" aria-hidden="true">⌄</span>
        </div>

        <Link aria-label="Open doctor portal" className="portal-switch-link" to="/doctor" title="Open doctor portal">
          <Icon name="doctors" />
          <span>Open doctor portal</span>
          <Icon name="arrow" />
        </Link>

        <nav className="dashboard-nav" aria-label="Admin portal">
          <span className="nav-section-label">WORKSPACE</span>
          {navigation.map((item) => (
            <NavLink
              aria-label={item.label}
              className={({ isActive }) => `dashboard-nav-link${isActive ? " active" : ""}`}
              end
              key={item.to}
              to={item.to}
              title={item.label}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.to === "/admin/appointments" && <span className="nav-count">8</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-mark">?</span>
            <span><strong>Need a hand?</strong><small>Visit our help center</small></span>
            <Icon name="arrow" />
          </div>
          <div className="sidebar-profile">
            <span className="person-avatar avatar-teal">CA</span>
            <span className="profile-copy"><strong>Clinic Admin</strong><small>Administrator</small></span>
            <button className="icon-button profile-menu" type="button" aria-label="Profile options">
              <Icon name="more" />
            </button>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <Icon name="search" />
              <input aria-label="Search MediTrack" placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>
            <span className="topbar-divider" />
            <button className="icon-button notification-button" type="button" aria-label="Notifications">
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
              <span />
            </button>
            <span className="topbar-date"><Icon name="calendar" /> {today}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-heading" id="overview">
            <div>
              <span className="dashboard-eyebrow">{todayHeading}</span>
              <h1>Good morning, Admin <span className="wave-emoji" aria-hidden="true">✦</span></h1>
              <p>Here’s what’s happening at your clinic today.</p>
            </div>
            <button className="primary-action" type="button">
              <Icon name="plus" /> Add new patient
            </button>
          </section>

          <div className="preview-notice">
            <span className="preview-pulse" />
            Preview dashboard
            <span>Sample data only — connect Supabase to see live clinic information.</span>
          </div>

          <section className="metrics-grid" aria-label="Clinic summary">
            <article className="metric-card">
              <div className="metric-topline"><span>Appointments today</span><span className="metric-icon metric-teal"><Icon name="appointments" /></span></div>
              <div className="metric-value-row"><strong>24</strong><span className="metric-change positive">↗ 12.5%</span></div>
              <span className="metric-footnote">Compared to yesterday</span>
              <div className="metric-sparkline spark-teal" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="metric-card">
              <div className="metric-topline"><span>Total patients</span><span className="metric-icon metric-lilac"><Icon name="patients" /></span></div>
              <div className="metric-value-row"><strong>1,284</strong><span className="metric-change positive">↗ 8.2%</span></div>
              <span className="metric-footnote">Added over the last 30 days</span>
              <div className="metric-sparkline spark-lilac" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="metric-card">
              <div className="metric-topline"><span>Active doctors</span><span className="metric-icon metric-blue"><Icon name="doctors" /></span></div>
              <div className="metric-value-row"><strong>18</strong><span className="metric-change neutral">of 22 total</span></div>
              <span className="metric-footnote">4 doctors currently unavailable</span>
              <div className="metric-sparkline spark-blue" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="metric-card">
              <div className="metric-topline"><span>Pending reviews</span><span className="metric-icon metric-amber"><Icon name="records" /></span></div>
              <div className="metric-value-row"><strong>07</strong><span className="metric-change attention">Needs attention</span></div>
              <span className="metric-footnote">Clinical notes awaiting review</span>
              <div className="metric-sparkline spark-amber" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
          </section>

          <div className="dashboard-primary-grid">
            <section className="panel visits-panel">
              <div className="panel-heading">
                <div><h2>Patient visits</h2><p>Clinic activity throughout the week</p></div>
                <button className="select-button" type="button">This week <span>⌄</span></button>
              </div>
              <div className="visits-summary">              <strong>415</strong><span>visits this week</span><span className="summary-change">↑ 14.8%</span></div>
              <div className="chart-area" role="img" aria-label="Patient visits by day: Monday 54, Tuesday 73, Wednesday 62, Thursday 88, Friday 68, Saturday 42, Sunday 28">
                <div className="chart-y-labels" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span></div>
                <div className="chart-plot">
                  <div className="chart-grid-lines" aria-hidden="true"><i /><i /><i /><i /></div>
                  {weeklyVisits.map((visit) => (
                    <div className="chart-column" key={visit.day}>
                      <div className={`chart-bar${visit.day === "Thu" ? " chart-bar-highlight" : ""}`} style={{ height: `${visit.value}%` }}>
                        {visit.day === "Thu" && <span className="chart-tooltip">88 visits</span>}
                      </div>
                      <span className={visit.day === "Thu" ? "chart-day selected" : "chart-day"}>{visit.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel appointments-panel" id="appointments">
              <div className="panel-heading">
                <div><h2>Today’s appointments</h2><p>{today}</p></div>
                <a className="panel-link" href="#appointments">View schedule <Icon name="arrow" /></a>
              </div>
              <div className="appointment-list">
                {appointments.map((appointment) => (
                  <article className="appointment-item" key={`${appointment.time}-${appointment.name}`}>
                    <span className="appointment-time">{appointment.time}</span>
                    <span className={`appointment-timeline ${appointment.status === "In consultation" ? "timeline-active" : ""}`} />
                    <span className={initialsClass(appointment.color)}>{appointment.initials}</span>
                    <div className="appointment-details">
                      <strong>{appointment.name}</strong>
                      <span>{appointment.reason}</span>
                      <small>{appointment.doctor}</small>
                    </div>
                    <span className={`appointment-status status-${appointment.status.toLowerCase().replaceAll(" ", "-")}`}>{appointment.status}</span>
                  </article>
                ))}
              </div>
              <a className="appointments-footer-link" href="#appointments"><Icon name="clock" /> 19 more appointments today <Icon name="arrow" /></a>
            </section>
          </div>

          <section className="panel patients-panel" id="patients">
            <div className="panel-heading patients-panel-heading">
              <div><h2>Recent patients</h2><p>Latest patient activity across your clinic</p></div>
              <div className="patients-tools">
                <label className="table-search">
                  <Icon name="search" />
                  <input
                    aria-label="Filter recent patients"
                    onChange={(event) => setPatientSearch(event.target.value)}
                    placeholder="Search patients"
                    value={patientSearch}
                  />
                </label>
                <a className="panel-link" href="#patients">View all <Icon name="arrow" /></a>
              </div>
            </div>
            <div className="patients-table-wrap">
              <table className="patients-table">
                <thead><tr><th>Patient</th><th>Patient ID</th><th>Last visit</th><th>Assigned doctor</th><th>Status</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {visiblePatients.map((patient) => (
                    <tr key={patient.id}>
                      <td><span className={initialsClass(patient.color)}>{patient.initials}</span><strong>{patient.name}</strong></td>
                      <td className="patient-id">{patient.id}</td>
                      <td>{patient.date}</td>
                      <td>{patient.doctor}</td>
                      <td><span className={`patient-status patient-${patient.status.toLowerCase().replaceAll(" ", "-")}`}><i />{patient.status}</span></td>
                      <td><button className="icon-button row-menu" type="button" aria-label={`More options for ${patient.name}`}><Icon name="more" /></button></td>
                    </tr>
                  ))}
                  {visiblePatients.length === 0 && (
                    <tr><td className="empty-search" colSpan={6}>No patients match “{patientSearch}”.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="dashboard-secondary-grid">
            <section className="panel doctors-panel" id="doctors">
              <div className="panel-heading"><div><h2>Doctors on duty</h2><p>Availability across your care team</p></div><a className="panel-link" href="#doctors">View team <Icon name="arrow" /></a></div>
              <div className="doctor-list">
                {doctors.map((doctor) => (
                  <article className="doctor-item" key={doctor.initials}>
                    <span className={initialsClass(doctor.color)}>{doctor.initials}</span>
                    <span className="doctor-details"><strong>Dr. {doctor.name}</strong><small>{doctor.specialty}</small></span>
                    <span className={`doctor-availability${doctor.availability === "Available" ? " doctor-available" : ""}`}><i />{doctor.availability}</span>
                  </article>
                ))}
              </div>
              <a className="doctors-footer-link" href="#doctors"><Icon name="plus" /> Add a doctor</a>
            </section>

            <section className="panel activity-panel" id="activity">
              <div className="panel-heading"><div><h2>Recent activity</h2><p>Updates from your clinical team</p></div><button className="icon-button" type="button" aria-label="Activity options"><Icon name="more" /></button></div>
              <div className="activity-list">
                {activity.map((item) => (
                  <article className="activity-item" key={item.title}>
                    <span className={`activity-marker activity-${item.color}`}><Icon name="records" /></span>
                    <span className="activity-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
                    <time>{item.time}</time>
                  </article>
                ))}
              </div>
              <a className="activity-footer-link" href="#activity">View activity log <Icon name="arrow" /></a>
            </section>
          </div>
          <footer className="dashboard-footer"><span>© {new Date().getFullYear()} MediTrack</span><span>Thoughtful tools for better care.</span></footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
