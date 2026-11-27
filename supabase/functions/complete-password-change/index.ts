import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { jsonResponse, optionsResponse } from "../_shared/http.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return optionsResponse();
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Sign in before changing your password." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Password change service is not configured." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const token = authorization.slice("Bearer ".length);
  const { data, error: userError } = await supabase.auth.getUser(token);
  if (userError || !data.user) {
    return jsonResponse({ error: "Your session is invalid or expired. Sign in again." }, 401);
  }
  if (data.user.app_metadata.must_change_password !== true) {
    return jsonResponse({ error: "A password change is not required for this account." }, 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }
  if (
    typeof body !== "object"
    || body === null
    || !("password" in body)
    || typeof body.password !== "string"
  ) {
    return jsonResponse({ error: "A new password is required." }, 400);
  }

  const password = body.password;
  if (password.length < 12 || new TextEncoder().encode(password).length > 72) {
    return jsonResponse({ error: "Use a new password of at least 12 characters and no more than 72 UTF-8 bytes." }, 400);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(data.user.id, {
    password,
    app_metadata: { ...data.user.app_metadata, must_change_password: false },
  });
  if (updateError) {
    return jsonResponse({ error: updateError.message }, 400);
  }

  return jsonResponse({ ok: true });
});
