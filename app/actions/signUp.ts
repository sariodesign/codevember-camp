"use server"

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./getCurrentUser";
import { redirect } from "next/navigation";

export const signUp = async (formData: FormData) => {
    const { data } = await getCurrentUser();

    if (data.user) {
        redirect('/onboarding')
    }

    const supabase = await createClient()

    const dataUser = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    const { error } = await supabase.auth.signUp(dataUser)

    if (error) {
        redirect("/error")
    } else {
        if (data.user) {
            redirect("/onboarding")
        }
    }

}