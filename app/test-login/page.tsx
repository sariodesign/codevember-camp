import { redirect } from "next/dist/client/components/navigation"
import { logout } from "../actions/logout"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "../actions/getCurrentUser"



export default async function TestLogin() {

  const { data } = await getCurrentUser()

  if (!data.user) {
    redirect("/login")
  }

  return (
    <div>sono loggato!

      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
