import Header from "@/components/layout/Header";
import { getCurrentUser } from "../actions/getCurrentUser";
import { redirect } from "next/dist/client/components/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getCurrentUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" user={data.user} />
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto">

          {children}
        </main>
      </div>
    </div>
  );
}
