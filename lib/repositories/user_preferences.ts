import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type UserPreferences =
  Database["public"]["Tables"]["user_preferences"]["Row"];

export async function findUserPreferencesByUserId(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select()
    .eq("user_id", userId)
    .single();

  if (error) {
    //"JSON object requested, multiple (or no) rows returned"
    if (error.code === "PGRST116") return null;

    throw new Error(`Failed to find user preferences: ${error.message}`);
  }

  return data;
}
