import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { getCurrentUser } from "../actions/getCurrentUser";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const { data } = await getCurrentUser();

  return (
    <div className="flex flex-col h-screen">
      <Header title='Dashboard' user={data.user} />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
