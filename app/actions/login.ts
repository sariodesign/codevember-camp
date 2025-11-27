"use server"


import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./getCurrentUser";

export const login = async (formData: FormData) => {
    const { data } = await getCurrentUser();

    if (data.user) {
        redirect('/test-login')
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
        if (data.user) {
            redirect("/test-login")
        }
    }
}