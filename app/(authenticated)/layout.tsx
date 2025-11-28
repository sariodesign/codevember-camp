import { BotMessageSquare } from "lucide-react";
import { redirect } from "next/dist/client/components/navigation";
import { getCurrentUser } from "../actions/getCurrentUser";
import Chat from "@/components/chat/Chat";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getCurrentUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <>
      <Header user={data.user} />
      <div className="relative flex">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bottom-2 absolute right-0 mr-4" variant="outline">
            <BotMessageSquare />
            <span>AI Assistant</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle hidden>Sheet title</SheetTitle>
          </SheetHeader>
          <Chat />
        </SheetContent>
      </Sheet>
    </>
  );
}
