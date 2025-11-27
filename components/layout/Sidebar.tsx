'use client'
 
import { usePathname } from 'next/navigation'
import { Calendar, LayoutDashboard } from "lucide-react"
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname()
 
  return (
    <aside className="w-fit min-h-screen border-r border-stone-200 px-4 py-8">
      <div className="flex flex-col gap-4">
        <Link href="/dashboard" className={`flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-accent ${pathname === '/dashboard' ? 'text-blue-500' : ''}`}>
          <LayoutDashboard />
          <span>Dashboard</span>
        </Link>
        <Link href="/calendar" className={`flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-accent ${pathname === '/calendar' ? 'text-blue-500' : ''}`}>
          <Calendar />
          <span>Calendar</span>
        </Link>
      </div>
      {/* Sidebar content goes here */}
    </aside>
  );
}
