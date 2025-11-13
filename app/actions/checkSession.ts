"use server"

import { createClient } from "@/utils/supabase/server"

export const checkSession = async () => {
    const supabase = await createClient()
    return supabase.auth.getSession()
}