'use client";'

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function Sidebar() {
  return (
  <aside className="w-64 min-h-screen border-r bg-muted p-4 flex flex-col gap-4">
    <h1 className="text-lg font-bold">Menu</h1>
    <Dialog>
      <DialogTrigger asChild className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <button>
          Apri la Chat
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat con AI</DialogTitle>
          <DialogDescription>
            Fai domande o chiedi assistenza.
          </DialogDescription>
        </DialogHeader>

          {/* Qui ci mettiamo il contenuto della chat */}

      </DialogContent>
    </Dialog>
  </aside>
  );
}
