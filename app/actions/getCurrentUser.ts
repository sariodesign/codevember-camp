"use server"

import { createClient } from "@/utils/supabase/server"

export const getCurrentUser = async () => {
    const supabase = await createClient()
    
    return supabase.auth.getUser()
}