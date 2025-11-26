import { getCurrentUser } from "../actions/getCurrentUser";
import { getUserPreferences } from "../actions/getUserPreferences";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default async function ProfilePage() {
  const { data: userData } = await getCurrentUser();
  const { data: preferencesData } = await getUserPreferences()

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div className="pt-6">
        <h1 className="text-2xl font-bold mb-4">My profile</h1>
        <p className="text-gray-700">Welcome to your profile page!</p>
      </div>
      <Card className="p-4">
        <h2>Personal Details</h2>
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={userData.user?.user_metadata.avatar_url || ""} />
            <AvatarFallback>
              {userData.user?.user_metadata.full_name
                ? userData.user.user_metadata.full_name.charAt(0)
                : "U"}
            </AvatarFallback>
          </Avatar>
          {userData.user && (
            <div className="flex flex-col gap-y-2">
              <p className="text-xl leading-none"><strong> {userData.user.user_metadata.full_name}</strong></p>
              <p className="leading-none">{userData.user.email}</p>
              <p className="text-xs italic font-bold">Registrato il: {new Date(userData.user.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </Card>
      <Card className="p-4">
        <h2>Personal preferences</h2>
        {preferencesData && preferencesData.length > 0 && (
          <>
            {preferencesData.map((pref) => (
              <ul key={pref.id}>
                <li>{pref.productive_time_slot}</li>
                <li>{pref.focus_time_length}</li>
                <li>{pref.pause_time_length}</li>
                <li>{pref.sessions_before_break}</li>
              </ul>
            ))}
          </>
        )}
        {(!preferencesData || preferencesData.length === 0) && (
          <p>No preferences set.</p>
        )}
      </Card>
    </section>
  );
}