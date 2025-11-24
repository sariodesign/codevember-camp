"use client";

import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/types/event";
import React, { useMemo } from "react";
import { GETEvents } from "@/network/google_calendar";
import { createClient } from "@/utils/supabase/client";
import { mapGoogleCalendarEvents } from "@/utils/mappers/mapGoogleCalendarEvents";
import type { GoogleCalendarEvent } from "@/utils/mappers/mapGoogleCalendarEvents";

export default function Dashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const getUserToken = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.provider_token;
    return token;
  };

  const fetchEvents = React.useCallback(async () => {
    const params = new URLSearchParams({
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
    });

    try {
      const token = await getUserToken();
      if (token) {
        const calendarEvents = await GETEvents(token, params).then((response) =>
          response.json()
        ).then(({ items }: { items: GoogleCalendarEvent[]}): CalendarEvent[] =>{

          const data = mapGoogleCalendarEvents(items);
          return data;
        });
          setEvents(calendarEvents || []);
      }
    
    } catch (error) {
      console.error("Errore nel recupero degli eventi del calendario:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsForSelectedDate = useMemo(() => {
    return events.filter((event) => {
      if (!date || !event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events, date]);

  if (loading) {
    return <div className="p-6">Caricamento eventi del calendario...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto h-96">
        <div className=" border rounded-lg p-4 bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              hasEvents: (day) => {
                return events.some((event) => {
                  if (!event.start?.dateTime) return false;
                  const eventDate = new Date(event.start.dateTime);
                  return eventDate.toDateString() === day.toDateString();
                });
              },
            }}
            modifiersClassNames={{
              hasEvents:
                "underline decoration-4 decoration-green-600 font-semibold",
            }}
            className="w-full "
          />
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Eventi del giorno</h2>
          <p className="text-gray-500">
            {date ? date.toLocaleDateString("it-IT") : "Seleziona una data"}
          </p>
          <div className="mt-4 space-y-2">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="p-2 bg-blue-50 border border-blue-200 rounded"
                >
                  <h3 className="font-semibold">{event.summary}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nessun evento per questa data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
