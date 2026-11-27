import { FunctionsHttpError } from "@supabase/supabase-js";

export async function getFunctionErrorMessage(error: Error): Promise<string> {
  if (error instanceof FunctionsHttpError && error.context instanceof Response) {
    try {
      const body: unknown = await error.context.clone().json();
      if (
        typeof body === "object"
        && body !== null
        && "error" in body
        && typeof body.error === "string"
      ) {
        return body.error;
      }
    } catch {
      return error.message;
    }
  }
  return error.message;
}
