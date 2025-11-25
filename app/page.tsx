import { getCurrentUser } from "./actions/getCurrentUser";
import { redirect } from "next/navigation";
import LoginPage from "./login/page";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const { data } = await getCurrentUser()
  if (!data.user?.id) {
    return (
      <LoginPage />
    );
  }

  const supabase: SupabaseClient<Database> = await createClient()
  const { data: userOnboarding } = await supabase.from("onboardings").select("*").eq("user_id", data.user?.id).single()

  if (data.user && userOnboarding?.completed_at) {
    redirect("/dashboard")
  } else {
    redirect("/onboarding")
  }
}
