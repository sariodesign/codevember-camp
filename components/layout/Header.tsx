'use client'

import { logout } from "@/app/actions/logout";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ 
  user 
}: { 
  user: any;
}) {
  const [open, setOpen] = useState(false);



  return (
    <header className="w-full border-b border-stone-200 flex justify-between items-center p-4">
      <div>
        <h1 className="text-xl font-bold">Nome App</h1>
      </div>

      <div>
        {user && (
          <div className="flex items-center">
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2">
                <p className="">{user.user_metadata.full_name}</p>
                {open ? <ChevronUp className="mt-1" /> : <ChevronDown className="mt-1" />}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profilo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
