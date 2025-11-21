import { getCurrentUser } from "./actions/getCurrentUser";
import { redirect } from "next/navigation";
import LoginPage from "./login/page";

export default async function Home() {
  const { data } = await getCurrentUser()

  if (data.user) {
    redirect("/dashboard")
  }

  return (
    <LoginPage />
  );
}
