'use server'

import { BASE_CALENDAR_URL } from "@/utils/constant/api_url";
import { mapGoogleCalendarEvents } from "@/utils/mappers/mapGoogleCalendarEvents";
import { createClient } from "@/utils/supabase/server";



export async function getCalendarEvents() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

  

    const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const endOfMonth = new Date(startOfMonth);
endOfMonth.setMonth(endOfMonth.getMonth() + 1);

const params = new URLSearchParams({
  timeMin: startOfMonth.toISOString(),
  timeMax: endOfMonth.toISOString(),
  singleEvents: 'true',
  orderBy: 'startTime',
});

    if (!session?.provider_token){
      throw new Error("Token not available");
    }

    const response = await fetch(`${BASE_CALENDAR_URL}primary/events?${params}`, {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        "Content-Type": "application/json",
      },
    });

const data = await response.json();
const mappedEvents = mapGoogleCalendarEvents(data.items);
return mappedEvents;
  }
