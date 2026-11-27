import { useEffect, useState, type FormEvent } from "react";
import { getFunctionErrorMessage } from "../../auth/doctorAccountFunctions";
import { getSupabaseClient } from "../../config/supabase";

interface DoctorAccount {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

interface DoctorAccountForm {
  fullName: string;
  specialty: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface DoctorProfileRecord {
  id: string;
  full_name: string;
  email: string;
}

interface DoctorSpecialtyRecord {
  profile_id: string;
  specialty: string | null;
}

const emptyForm: DoctorAccountForm = {
  fullName: "",
  specialty: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

function DoctorManagementPanel() {
  const [doctors, setDoctors] = useState<DoctorAccount[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdCredential, setCreatedCredential] = useState<{ email: string; password: string } | null>(null);

  async function loadDoctors() {
    setDirectoryLoading(true);
    setDirectoryError(null);
    try {
      const supabase = getSupabaseClient();
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "doctor")
        .order("full_name");
      if (profileError) throw profileError;

      const profileRows = (profileData ?? []) as DoctorProfileRecord[];
      if (profileRows.length === 0) {
        setDoctors([]);
        return;
      }

      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("profile_id, specialty")
        .in("profile_id", profileRows.map((doctor) => doctor.id));
      if (doctorError) throw doctorError;

      const specialties = new Map(
        ((doctorData ?? []) as DoctorSpecialtyRecord[])
          .map((doctor) => [doctor.profile_id, doctor.specialty ?? ""]),
      );
      setDoctors(profileRows.map((doctor) => ({
        id: doctor.id,
        name: doctor.full_name,
        specialty: specialties.get(doctor.id) ?? "",
        email: doctor.email,
      })));
    } catch (error) {
      setDirectoryError(messageFrom(error));
    } finally {
      setDirectoryLoading(false);
    }
  }

  useEffect(() => {
    void loadDoctors();
  }, []);

  function updateForm(field: keyof DoctorAccountForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (form.password !== form.confirmPassword) {
      setFormError("The temporary passwords do not match.");
      return;
    }
    if (form.password.length < 12 || new TextEncoder().encode(form.password).length > 72) {
      setFormError("Use a temporary password of at least 12 characters and no more than 72 UTF-8 bytes.");
      return;
    }

    setSubmitting(true);
    void getSupabaseClient().functions.invoke("create-doctor", {
      body: {
        fullName: form.fullName.trim(),
        specialty: form.specialty.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      },
    }).then(async ({ error }) => {
      if (error) throw new Error(await getFunctionErrorMessage(error));
      setCreatedCredential({ email: form.email.trim().toLowerCase(), password: form.password });
      setForm(emptyForm);
      await loadDoctors();
    }).catch((error: unknown) => {
      setFormError(messageFrom(error));
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <div className="doctor-management">
      <section className="doctor-account-panel" aria-labelledby="create-doctor-heading">
        <header className="doctor-account-heading">
          <div>
            <h2 id="create-doctor-heading">Create doctor account</h2>
            <p>Only administrators can add doctors. Passwords are managed by Supabase Auth and never saved in the doctor directory.</p>
          </div>
        </header>

        {createdCredential && (
          <div className="doctor-account-success" role="status">
            <div>
              <strong>Doctor account created for {createdCredential.email}.</strong>
              <p>Share this temporary password securely. The doctor must replace it at first sign-in.</p>
              <code>{createdCredential.password}</code>
            </div>
            <button type="button" onClick={() => setCreatedCredential(null)}>Dismiss</button>
          </div>
        )}

        <form className="doctor-account-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input
              autoComplete="name"
              maxLength={120}
              onChange={(event) => updateForm("fullName", event.target.value)}
              required
              value={form.fullName}
            />
          </label>
          <label>
            <span>Specialty</span>
            <input
              autoComplete="organization-title"
              maxLength={120}
              onChange={(event) => updateForm("specialty", event.target.value)}
              required
              value={form.specialty}
            />
          </label>
          <label>
            <span>Work email</span>
            <input
              autoComplete="email"
              onChange={(event) => updateForm("email", event.target.value)}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            <span>Temporary password</span>
            <input
              autoComplete="new-password"
              maxLength={72}
              minLength={12}
              onChange={(event) => updateForm("password", event.target.value)}
              required
              type="password"
              value={form.password}
            />
          </label>
          <label>
            <span>Confirm temporary password</span>
            <input
              autoComplete="new-password"
              maxLength={72}
              minLength={12}
              onChange={(event) => updateForm("confirmPassword", event.target.value)}
              required
              type="password"
              value={form.confirmPassword}
            />
          </label>
          {formError && <p className="auth-form-error" role="alert">{formError}</p>}
          <button className="doctor-account-submit" disabled={submitting || createdCredential !== null} type="submit">
            {submitting ? "Creating account…" : "Create doctor account"}
          </button>
        </form>
      </section>

      <section className="workspace-table-panel" aria-labelledby="doctor-directory-heading">
        <div className="workspace-table-heading">
          <div>
            <h2 id="doctor-directory-heading">Doctor directory</h2>
            <p>Name, specialty, and email. Passwords are never displayed here.</p>
          </div>
        </div>
        <div className="workspace-table-scroll">
          <table className="workspace-table">
            <thead>
              <tr><th>Name</th><th>Specialty</th><th>Email</th></tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty || "—"}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))}
              {directoryLoading && <tr><td className="workspace-empty" colSpan={3}>Loading doctor accounts…</td></tr>}
              {!directoryLoading && directoryError && <tr><td className="workspace-empty" colSpan={3}>{directoryError}</td></tr>}
              {!directoryLoading && !directoryError && doctors.length === 0 && (
                <tr><td className="workspace-empty" colSpan={3}>No doctor accounts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="workspace-table-footer">
          <span>{doctors.length} doctor {doctors.length === 1 ? "account" : "accounts"}</span>
          <button disabled={directoryLoading} onClick={() => void loadDoctors()} type="button">Refresh</button>
        </footer>
      </section>
    </div>
  );
}

export default DoctorManagementPanel;
