"use client";

import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/types/event";
import React from "react";
import { getCalendarEvents } from "../actions/getCalendarEvents";




export default function Dashboard() {

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => { 
    const fetchEvents = async () => {
      try {
        const data = await getCalendarEvents();
        console.log("Eventi da google:", data)
        setEvents(data || []);
      } catch (error) {
        console.error("Errore nel recupero degli eventi del calendario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); 

  if (loading) {
    return <div className="p-6">Caricamento eventi del calendario...</div>;
  }

const eventsForSelectedDate = events.filter(event => {
  if (!date || !event.start?.dateTime) return false;
  const eventDate = new Date(event.start.dateTime);
  return eventDate.toDateString() === date.toDateString();
})

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto h-96">
      <div className=" border rounded-lg p-4 bg-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full "
        />
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Eventi del giorno</h2>
        <p className="text-gray-500">{date ? date.toLocaleDateString("it-IT") : "Seleziona una data"}</p>
        <div className="mt-4 space-y-2">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map(event => (
              <div key={event.id} className="p-2 bg-blue-50 border border-blue-200 rounded">
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
