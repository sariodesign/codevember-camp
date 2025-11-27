import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function completeOnboarding(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
        .from('onboardings')
        .update({
            completed_at: new Date().toISOString(),
        }).eq("user_id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
