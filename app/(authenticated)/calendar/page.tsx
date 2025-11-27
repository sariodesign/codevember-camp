"use client";

import Calendar from '@/components/ui/calendar';
import { useCalendar } from '@/hooks/calendar/useCalendar';

export default function CalendarPage() {
  const { /* date, eventsForSelectedDate, setDate, loading, hasEvents */
    events
  } =  useCalendar();

  return (
    <section className="max-w-6xl mx-auto space-y-6 p-8">
      {events && events.length === 0 && <p>Nessun evento trovato.</p>}
      <Calendar items={events} />
    </section>
  ); 
}