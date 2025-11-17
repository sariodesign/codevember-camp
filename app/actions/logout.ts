'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const logout = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error during sign out:", error.message);
    // Optionally, handle the error (e.g., show a message to the user)
  } 
    redirect("/login");
  }


