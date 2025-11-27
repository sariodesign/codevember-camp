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
      {events && events.length === 0 && <p>Nessun evento trovato.</p>}
      <Calendar
        items={events}
        onDelete={handleDelete}
        deletingId={deletingId}
        editEventFromValues={editEventFromValues}
        updatingId={updatingId}
        createEventFromValues={handleCreateEvent}
        creatingId={creatingId}
      />
    </section>
  );
}
