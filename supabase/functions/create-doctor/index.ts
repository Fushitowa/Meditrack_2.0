import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { corsHeaders, jsonResponse, optionsResponse } from "../_shared/http.ts";

interface CreateDoctorRequest {
  fullName: string;
  specialty: string;
  email: string;
  password: string;
}

function isCreateDoctorRequest(value: unknown): value is CreateDoctorRequest {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.fullName === "string"
    && typeof body.specialty === "string"
    && typeof body.email === "string"
    && typeof body.password === "string";
}

function passwordIsValid(password: string): boolean {
  return password.length >= 12 && new TextEncoder().encode(password).length <= 72;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return optionsResponse();
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Sign in as an administrator to create a doctor account." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Doctor account service is not configured." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const token = authorization.slice("Bearer ".length);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return jsonResponse({ error: "Your session is invalid or expired. Sign in again." }, 401);
  }

  const { data: callerProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileLookupError) {
    return jsonResponse({ error: "Unable to verify administrator access." }, 500);
  }
  if (callerProfile?.role !== "admin") {
    return jsonResponse({ error: "Only an administrator can create doctor accounts." }, 403);
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }
  if (!isCreateDoctorRequest(requestBody)) {
    return jsonResponse({ error: "Name, specialty, email, and temporary password are required." }, 400);
  }

  const fullName = requestBody.fullName.trim();
  const specialty = requestBody.specialty.trim();
  const email = requestBody.email.trim().toLowerCase();
  const password = requestBody.password;
  if (!fullName || fullName.length > 120 || !specialty || specialty.length > 120) {
    return jsonResponse({ error: "Enter a name and specialty of 1–120 characters." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }
  if (!passwordIsValid(password)) {
    return jsonResponse({ error: "Use a temporary password of at least 12 characters and no more than 72 UTF-8 bytes." }, 400);
  }

  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
    app_metadata: { must_change_password: true },
  });
  if (createError || !createdUser.user) {
    return jsonResponse({
      error: createError?.message ?? "Supabase Auth did not return the created user.",
    }, 400);
  }

  const { data: savedProfile, error: saveProfileError } = await supabase
    .from("profiles")
    .update({ email, full_name: fullName, role: "doctor" })
    .eq("id", createdUser.user.id)
    .select("id")
    .maybeSingle();

  const profileSaveFailed = Boolean(saveProfileError) || !savedProfile;
  const { error: saveDoctorError } = profileSaveFailed
    ? { error: null }
    : await supabase.from("doctors").insert({
      profile_id: createdUser.user.id,
      specialty,
    });

  if (profileSaveFailed || saveDoctorError) {
    const { error: cleanupError } = await supabase.auth.admin.deleteUser(createdUser.user.id);
    if (cleanupError) {
      return jsonResponse({
        error: "Saving the doctor profile failed, and automatic account cleanup also failed. Contact your Supabase administrator.",
      }, 500);
    }
    return jsonResponse({ error: "Could not save the doctor profile. No doctor account was kept." }, 500);
  }

  return jsonResponse({ id: createdUser.user.id });
});
