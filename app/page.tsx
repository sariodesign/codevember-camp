import Link from "next/link";
import { getCurrentUser } from "./actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data } = await getCurrentUser()

  if (data.user) {
    redirect("/test-login")
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 h-screen">
      <Link href="/signup">Registrati</Link>
      <Link href="/login">Accedi</Link>
    </div>
  );
}
