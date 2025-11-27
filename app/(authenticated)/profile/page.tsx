import { LightningBoltIcon, LapTimerIcon, PauseIcon, UpdateIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { getCurrentUser } from "../../actions/getCurrentUser";
import { createClient } from "@/utils/supabase/server"
import { findUserPreferencesByUserId } from "@/lib/repositories/user_preferences";
import { findProfileById } from "@/lib/repositories/profile.repository";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default async function ProfilePage() {
  const supabase = await createClient();
  const currentUser = await findProfileById(supabase, (await getCurrentUser()).data.user?.id || "");
  const preferencesData = await findUserPreferencesByUserId(supabase, currentUser?.id || "");

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div className="pt-6">
        <h1 className="text-2xl font-bold mb-4">Il mio profilo</h1>
        <p className="text-gray-700">Benvenuto nella tua pagina del profilo!</p>
      </div>
      {currentUser && (
        <Card className="p-4 border-slate-300 shadow-none">
          <h2>Dettagli personali</h2>
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src={currentUser.avatar_url || ""} />
              <AvatarFallback>
                {currentUser.full_name
                  ? currentUser.full_name.charAt(0)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            {currentUser && (
              <div className="flex flex-col gap-y-2">
                <p className="text-xl leading-none"><strong> {currentUser.full_name}</strong></p>
                <p className="leading-none">{currentUser.email}</p>
                <p className="text-xs italic font-bold">Registrato il: {new Date(currentUser.created_at!).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      <Card className="p-4 border-slate-300 shadow-none">
        <CardHeader className="p-0">
          <CardTitle>Preferenze personali</CardTitle>
          <CardDescription>
            Gestisci le tue preferenze personali per le sessioni di focus e le pause.
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Pencil1Icon />
              <span>Modifica</span>
            </Button>
          </CardAction>
        </CardHeader>
        {preferencesData && (
          <ul key={preferencesData.id}>
            <li className="flex gap-x-1 items-center">
              <LightningBoltIcon /> 
              <strong>Slot produttività:</strong> 
              <span>{preferencesData.productive_time_slot}</span>
            </li>
            <li className="flex gap-x-1 items-center">
              <LapTimerIcon /> 
              <strong>Durata della sessione di focus:</strong> 
              <span>{preferencesData.focus_time_length}</span>
            </li>
            <li className="flex gap-x-1 items-center">
              <PauseIcon /> 
              <strong>Durata della pausa:</strong> 
              <span>{preferencesData.pause_time_length}</span>
            </li>
            <li className="flex gap-x-1 items-center">
              <UpdateIcon /> 
              <strong>Pausa ogni 3/4 sessioni:</strong> 
              <span>{preferencesData.sessions_before_break}</span>
            </li>
          </ul>
        )}
        {!preferencesData && (
          <p>No preferences set.</p>
        )}
      </Card>
    </section>
  );
}