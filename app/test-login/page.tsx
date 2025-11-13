import { redirect } from "next/dist/client/components/navigation"
import { checkSession } from "../actions/checkSession"
import { logout } from "../actions/logout"
import { Button } from "@/components/ui/button"



export default async function TestLogin() {

  const { data } = await checkSession()

  if (!data.session) {
    redirect("/login")
  }

    return (
        <div>sono loggato!

            <Button onClick={logout}>Logout</Button>
        </div>
    )
}
