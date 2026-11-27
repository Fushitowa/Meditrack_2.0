import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { roleHome } from "../../auth/AuthRoutes";
import { useAuth } from "../../auth/AuthProvider";
import { getSupabaseClient } from "../../config/supabase";

function ChangePasswordPage() {
  const { session, profile, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  if (loading) return <main className="auth-state-page">Checking your account…</main>;
  if (!session) return <Navigate to="/login" replace />;
  if (!profile) {
    return <main className="auth-state-page" role="alert">Your account profile could not be loaded.</main>;
  }
  if (session.user.app_metadata.must_change_password !== true) {
    return <Navigate to={roleHome(profile.role)} replace />;
  }
  const userRole = profile.role;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("new-password") ?? "");
    const confirmation = String(formData.get("confirm-password") ?? "");

    if (password.length < 12) {
      setErrorMessage("Use a new password with at least 12 characters.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    void getSupabaseClient().functions.invoke("complete-password-change", {
      body: { password },
    }).then(async ({ error }) => {
      if (error) throw error;
      const { error: refreshError } = await getSupabaseClient().auth.refreshSession();
      if (refreshError) throw refreshError;
      navigate(roleHome(userRole), { replace: true });
    }).catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update your password.");
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <main className="auth-state-page">
      <section className="auth-card" aria-labelledby="change-password-title">
        <span className="form-kicker">ACCOUNT SECURITY</span>
        <h1 id="change-password-title">Choose a new password</h1>
        <p>Your administrator created a temporary password. Replace it before continuing.</p>
        <form className="auth-password-form" onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input
            autoComplete="new-password"
            id="new-password"
            minLength={12}
            name="new-password"
            required
            type="password"
          />
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            autoComplete="new-password"
            id="confirm-password"
            minLength={12}
            name="confirm-password"
            required
            type="password"
          />
          {errorMessage && <p className="auth-form-error" role="alert">{errorMessage}</p>}
          <button className="sign-in-button" disabled={submitting} type="submit">
            <span>{submitting ? "Updating…" : "Update password"}</span>
          </button>
        </form>
      </section>
    </main>
  );
}

export default ChangePasswordPage;
