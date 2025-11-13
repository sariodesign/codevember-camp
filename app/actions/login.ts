"use server"


import { redirect } from "next/navigation";
import { checkSession } from "./checkSession"
import { createClient } from "@/utils/supabase/server";

export const login = async (formData: FormData) => {
    const { data } = await checkSession();

    if (data.session) {
        redirect('/onboarding')
    }

    const supabase = await createClient()

    const dataUser = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    const { error } = await supabase.auth.signInWithPassword(dataUser)

    if (error) {
        redirect("/error")
    } else {
        if (data.session) {
            redirect("/onboarding")
        }
    }
}