import { useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type UserProfile, type UserRole } from "./AuthProvider";

export function roleHome(role: UserRole): string {
  return role === "doctor" ? "/doctor" : "/admin";
}

function LoadingNotice() {
  return <main className="auth-state-page" aria-live="polite">Checking your account…</main>;
}

function AccessNotice({ message }: { message: string }) {
  return (
    <main className="auth-state-page">
      <p role="alert">{message}</p>
      <SignOutButton className="auth-sign-out" />
    </main>
  );
}

export function SignOutButton({ className }: { className: string }) {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Unable to sign out.");
    }
  }

  return (
    <>
      <button aria-label="Sign out" className={className} type="button" onClick={() => void handleSignOut()}>Sign out</button>
      {error && <span className="sign-out-error" role="alert">{error}</span>}
    </>
  );
}

function homeForProfile(profile: UserProfile): string {
  return roleHome(profile.role);
}

export function RequireRole({ role, children }: { role: "admin" | "doctor"; children: ReactNode }) {
  const { session, profile, loading, error } = useAuth();
  if (loading) return <LoadingNotice />;
  if (!session) return <Navigate to="/login" replace />;
  if (!profile) {
    return <AccessNotice message={error ?? "Your account profile could not be loaded."} />;
  }
  if (session.user.app_metadata.must_change_password === true) {
    return <Navigate to="/change-password" replace />;
  }
  if (profile.role === "staff") {
    return <AccessNotice message="This account does not have access to a MediTrack workspace." />;
  }
  if (profile.role !== role) {
    return <Navigate to={homeForProfile(profile)} replace />;
  }
  return children;
}

export function HomeRedirect() {
  const { session, profile, loading, error } = useAuth();
  if (loading) return <LoadingNotice />;
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.app_metadata.must_change_password === true) {
    return <Navigate to="/change-password" replace />;
  }
  if (!profile) {
    return <AccessNotice message={error ?? "Your account profile could not be loaded."} />;
  }
  if (profile.role === "staff") {
    return <AccessNotice message="This account does not have access to a MediTrack workspace." />;
  }
  return <Navigate to={homeForProfile(profile)} replace />;
}
