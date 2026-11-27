import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./DoctorDashboard.css";
import { appointments as previewAppointments, patients as previewPatients } from "../../data/previewData";

type IconName = "overview" | "calendar" | "patients" | "records" | "search" | "arrow";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    patients: <><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="7" r="3.5" /><path d="M17 4.5a3.5 3.5 0 0 1 0 6.8M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" /></>,
    records: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="doctor-icon"
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

const appointments = previewAppointments.map((appointment) => ({
    time: appointment.displayTime,
    patient: appointment.name,
    patientId: appointment.patientId,
    age: `${appointment.age} yrs`,
    reason: appointment.reason,
    status: appointment.status,
    initials: appointment.initials,
    color: appointment.color,
  }));

const followUps: { initials: string; name: string; detail: string; due: string; color: string }[] = [];

const navigation = [
  { label: "Overview", to: "/doctor", icon: "overview" as const },
  { label: "Appointments", to: "/doctor/appointments", icon: "calendar" as const },
  { label: "My patients", to: "/doctor/patients", icon: "patients" as const },
  { label: "Clinical records", to: "/doctor/records", icon: "records" as const },
];

function DoctorDashboard() {
  const [patientSearch, setPatientSearch] = useState("");
  const { pathname } = useLocation();
  const activeSection = navigation.find((item) => item.to === pathname)?.label ?? "Overview";
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
  const visibleAppointments = appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.reason} ${appointment.patientId}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase()),
  );
  const visiblePatients = previewPatients
    .filter((patient) => `${patient.name} ${patient.id} ${patient.condition}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase()));

  return (
    <div className="doctor-dashboard">
      <aside className="doctor-sidebar">
        <Link className="doctor-brand" to="/doctor" aria-label="MediTrack doctor portal">
          <span className="doctor-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="13" fill="currentColor" />
              <path d="M20 10.5v19M10.5 20h19" stroke="white" strokeLinecap="round" strokeWidth="3.5" />
              <circle cx="20" cy="20" r="2.2" fill="white" />
            </svg>
          </span>
          <span>MediTrack</span>
          <span className="doctor-brand-label">DOCTOR</span>
        </Link>

        <div className="doctor-workspace-card">
          <span className="doctor-clinic-mark">NC</span>
          <span><strong>Northstar Clinic</strong><small>Doctor workspace</small></span>
        </div>

        <nav className="doctor-nav" aria-label="Doctor portal">
          <span className="doctor-nav-label">MY WORKSPACE</span>
          {navigation.map((item) => (
            <NavLink
              aria-label={item.label}
              className={({ isActive }) => `doctor-nav-link${isActive ? " active" : ""}`}
              end
              key={item.to}
              to={item.to}
              title={item.label}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="doctor-sidebar-bottom">
          <Link aria-label="Switch to admin portal" className="admin-portal-link" to="/admin" title="Switch to admin portal">
            <Icon name="overview" />
            <span><strong>Admin portal</strong><small>Switch workspace</small></span>
            <Icon name="arrow" />
          </Link>
          <div className="doctor-user">
            <span className="doctor-avatar doctor-avatar-teal">DR</span>
            <span className="doctor-user-copy"><strong>Doctor</strong><small>Clinician</small></span>
            <span className="doctor-user-more" aria-hidden="true">···</span>
          </div>
        </div>
      </aside>

      <main className="doctor-main">
        <header className="doctor-topbar">
          <div className="doctor-breadcrumb"><span>Doctor workspace</span><span>/</span><strong>{activeSection}</strong></div>
          <div className="doctor-topbar-right">
            <label className="doctor-global-search">
              <Icon name="search" />
              <input aria-label="Search patients and appointments" placeholder="Search patients..." />
            </label>
            <span className="doctor-topbar-date"><Icon name="calendar" /> {today}</span>
            <span className="doctor-avatar doctor-avatar-teal topbar-doctor-avatar" aria-label="Doctor">DR</span>
          </div>
        </header>

        <div className="doctor-content">
          <section className="doctor-heading" id="doctor-overview">
            <div>
              <span className="doctor-eyebrow">{todayHeading}</span>
              <h1>Good morning, Doctor</h1>
              <p>Here’s your care schedule and patient follow-ups for today.</p>
            </div>
            <span className="doctor-shift">Doctor preview</span>
          </section>

          <div className="doctor-preview-note">
            <span />
            Doctor portal preview
            <small>Sample data only — no patient information is connected.</small>
          </div>

          <section className="doctor-stat-grid" aria-label="Your clinic summary">
            <article className="doctor-stat-card">
              <span>Appointments today</span><span className="doctor-stat-icon stat-green"><Icon name="calendar" /></span>
              <strong>0</strong><small>No appointments scheduled</small>
            </article>
            <article className="doctor-stat-card">
              <span>My patients</span><span className="doctor-stat-icon stat-purple"><Icon name="patients" /></span>
              <strong>0</strong><small>No patients assigned</small>
            </article>
            <article className="doctor-stat-card">
              <span>Notes to complete</span><span className="doctor-stat-icon stat-amber"><Icon name="records" /></span>
              <strong>0</strong><small>No notes to review</small>
            </article>
          </section>

          <div className="doctor-main-grid">
            <section className="doctor-panel doctor-appointments" id="doctor-appointments">
              <div className="doctor-panel-heading">
                <div><h2>Today’s appointments</h2><p>{today}</p></div>
                <a href="#doctor-appointments" className="doctor-text-link">Full schedule <Icon name="arrow" /></a>
              </div>
              <div className="doctor-appointment-list">
                {visibleAppointments.map((appointment) => (
                  <article className="doctor-appointment" key={appointment.patient}>
                    <span className="doctor-appointment-time">{appointment.time}</span>
                    <span className={`doctor-avatar doctor-avatar-${appointment.color}`}>{appointment.initials}</span>
                    <div className="doctor-appointment-detail">
                      <strong>{appointment.patient} <small>{appointment.age}</small></strong>
                      <span>{appointment.reason}</span>
                    </div>
                    <span className={`doctor-appointment-status doctor-status-${appointment.status.toLowerCase().replaceAll(" ", "-")}`}>{appointment.status}</span>
                  </article>
                ))}
                {visibleAppointments.length === 0 && (
                  <p className="doctor-empty-state">{patientSearch ? `No appointments match “${patientSearch}”.` : "No appointments yet."}</p>
                )}
              </div>
            </section>

            <section className="doctor-panel follow-up-panel" id="doctor-notes">
              <div className="doctor-panel-heading">
                <div><h2>Follow-ups &amp; notes</h2><p>Items that need your attention</p></div>
                <span className="doctor-follow-up-count">{followUps.length}</span>
              </div>
              <div className="doctor-follow-up-list">
                {followUps.map((item) => (
                  <article className="doctor-follow-up" key={item.name}>
                    <span className={`doctor-avatar doctor-avatar-${item.color}`}>{item.initials}</span>
                    <span className="follow-up-copy"><strong>{item.name}</strong><small>{item.detail}</small></span>
                    <time>{item.due}</time>
                  </article>
                ))}
                {followUps.length === 0 && <p className="doctor-empty-state">No follow-ups yet.</p>}
              </div>
              <a className="doctor-list-footer" href="#doctor-notes">Review clinical notes <Icon name="arrow" /></a>
            </section>
          </div>

          <section className="doctor-panel doctor-patients-panel" id="doctor-patients">
            <div className="doctor-panel-heading doctor-patients-heading">
              <div><h2>My patients</h2><p>Patients assigned to your care</p></div>
              <label className="doctor-patient-search">
                <Icon name="search" />
                <input
                  aria-label="Search today's patients"
                  onChange={(event) => setPatientSearch(event.target.value)}
                  placeholder="Search today's patients"
                  value={patientSearch}
                />
              </label>
            </div>
            <div className="doctor-patient-strip">
              {visiblePatients.slice(0, 3).map((patient) => (
                <article className="doctor-patient-card" key={patient.id}>
                  <span className={`doctor-avatar doctor-avatar-${patient.color}`}>{patient.initials}</span>
                  <span><strong>{patient.name}</strong><small>{patient.condition}</small></span>
                  <Link to="/doctor/appointments" aria-label={`View ${patient.name}'s appointment`}><Icon name="arrow" /></Link>
                </article>
              ))}
              {visiblePatients.length === 0 && (
                <p className="doctor-empty-state">{patientSearch ? `No patients match “${patientSearch}”.` : "No patients yet."}</p>
              )}
            </div>
          </section>
          <footer className="doctor-footer"><span>© {new Date().getFullYear()} MediTrack</span><span>Doctor workspace · Preview</span></footer>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
