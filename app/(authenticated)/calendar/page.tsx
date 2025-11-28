"use client";

import { EditEventFormValues } from "@/components/forms/EditEventForm";
import Calendar from "@/components/ui/calendar";
import { useCalendar } from "@/hooks/calendar/useCalendar";

export default function CalendarPage() {
  const {
    events,
    handleDelete,
    deletingId,
    editEventFromValues,
    updatingId,
    createEventFromValues,
    creatingId,
    loading
  } = useCalendar();

  const handleCreateEvent = async (
    values: EditEventFormValues,
    selectedDate: Date | undefined
  ) => {
    if (!selectedDate) return;
    await createEventFromValues(values, selectedDate);
  };

  return (
    <section className="max-w-6xl mx-auto space-y-6 p-8">
      {loading ? (
        <p>Caricamento eventi...</p>
      ) : (
        <>
          {events && events.length > 0 ? (
            <Calendar
              items={events}
              onDelete={handleDelete}
              deletingId={deletingId}
              editEventFromValues={editEventFromValues}
              updatingId={updatingId}
              createEventFromValues={handleCreateEvent}
              creatingId={creatingId}
            />
          ) : (
            <p>Nessun evento trovato.</p>
          )}
        </>
      )}  
      
    </section>
  );
}
