import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "../config/supabase";

export type UserRole = "admin" | "doctor" | "staff";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  specialty: string | null;
}

interface AuthContextValue {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: User; profile: UserProfile }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected authentication error occurred.";
}

function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "doctor" || value === "staff";
}

async function loadProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await getSupabaseClient()
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (
    !data
    || typeof data.id !== "string"
    || typeof data.email !== "string"
    || typeof data.full_name !== "string"
    || !isUserRole(data.role)
  ) {
    throw new Error("This account has no valid MediTrack profile. Contact your administrator.");
  }

  let specialty: string | null = null;
  if (data.role === "doctor") {
    const { data: doctorData, error: doctorError } = await getSupabaseClient()
      .from("doctors")
      .select("specialty")
      .eq("profile_id", data.id)
      .maybeSingle();
    if (doctorError) throw doctorError;
    if (!doctorData || typeof doctorData.specialty !== "string") {
      throw new Error("This doctor account has no specialty profile. Contact your administrator.");
    }
    specialty = doctorData.specialty;
  }

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    specialty,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;

    try {
      const supabase = getSupabaseClient();
      const authChange = supabase.auth.onAuthStateChange((event, nextSession) => {
        setSession(nextSession);
        if (!nextSession || event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
          setProfile(null);
          setError(null);
          setLoading(Boolean(nextSession));
        }
      });
      unsubscribe = () => authChange.data.subscription.unsubscribe();

      void supabase.auth.getSession().then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setError(sessionError.message);
          setLoading(false);
          return;
        }
        setSession(data.session);
        if (!data.session) setLoading(false);
      }).catch((sessionError: unknown) => {
        if (!active) return;
        setError(errorMessage(sessionError));
        setLoading(false);
      });
    } catch (clientError) {
      setError(errorMessage(clientError));
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    let active = true;
    setLoading(true);
    void loadProfile(session.user.id).then((nextProfile) => {
      if (!active) return;
      setProfile(nextProfile);
      setError(null);
      setLoading(false);
    }).catch((profileError: unknown) => {
      if (!active) return;
      setProfile(null);
      setError(errorMessage(profileError));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [session?.user.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) throw signInError;

    try {
      const nextProfile = await loadProfile(data.user.id);
      setSession(data.session);
      setProfile(nextProfile);
      setLoading(false);
      return { user: data.user, profile: nextProfile };
    } catch (profileError) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw new Error(`${errorMessage(profileError)} Sign-out also failed: ${signOutError.message}`);
      }
      throw profileError;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error: signOutError } = await getSupabaseClient().auth.signOut();
    if (signOutError) throw signOutError;
  }, []);

  const value = useMemo(
    () => ({ session, profile, loading, error, signIn, signOut }),
    [session, profile, loading, error, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
