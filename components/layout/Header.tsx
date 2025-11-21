'use client'

import { logout } from "@/app/actions/logout";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Header({ 
  title = "Header",
  user 
}: { 
  title?: string;
  user: any;
}) {
  const [open, setOpen] = useState(false);



  return (
    <header className="w-full border-b bg-muted flex justify-between items-center p-4">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div>
        {user && (
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
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
                <DropdownMenuItem>Profilo</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
