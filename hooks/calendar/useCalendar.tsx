import {
  buildPatchFromValues,
  buildEventFromValues,
} from "@/components/events/editEventHelper";
import { EditEventFormValues } from "@/components/forms/EditEventForm";
import {
  DELETEEvent,
  GETEvents,
  INSERTEvent,
  PATCHEvent,
} from "@/network/google_calendar";
import { CalendarEvent } from "@/types/event";
import {
  GoogleCalendarEvent,
  mapGoogleCalendarEvents,
} from "@/utils/mappers/mapGoogleCalendarEvents";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<boolean>(false);

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

  const handleDelete = async (eventId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo evento?")) {
      return;
    }
    if (!getUserToken()) {
      alert("Token non disponibile. Impossibile eliminare l'evento.");
      return;
    }
    try {
      setDeletingId(eventId);
      const res = await DELETEEvent((await getUserToken()) as string, eventId);
      if (!res.ok) {
        throw new Error("Errore durante l'eliminazione dell'evento.");
      }
      await fetchEvents();
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'evento:", error);
      alert("Si è verificato un errore durante l'eliminazione dell'evento.");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchEvents = useCallback(async () => {
    const params = new URLSearchParams({
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
    });

    try {
      const token = await getUserToken();
      if (token) {
        const calendarEvents = await GETEvents(token, params)
          .then((response) => response.json())
          .then(
            ({ items }: { items: GoogleCalendarEvent[] }): CalendarEvent[] => {
              const data = mapGoogleCalendarEvents(items);
              return data;
            }
          );
        setEvents(calendarEvents || []);
      }
    } catch (error) {
      console.error("Errore nel recupero degli eventi del calendario:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
      const onCalendarUpdated = () => {
        fetchEvents();
      };

      if (typeof window !== "undefined") {
        window.addEventListener("calendar:updated", onCalendarUpdated);
      }

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("calendar:updated", onCalendarUpdated);
        }
      };
    }, [fetchEvents]);

  const eventsForSelectedDate = useMemo(() => {
    return events.filter((event) => {
      if (!date || !event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events, date]);

  const hasEvents = (day: Date) => {
    return events.some((event) => {
      if (!event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  const editEventFromValues = async (
    event: CalendarEvent,
    values: EditEventFormValues
  ) => {
    const patch = buildPatchFromValues(values, event);
    if (!patch || Object.keys(patch).length === 0) {
      return;
    }

    try {
      setUpdatingId(event.id ?? null);
      const token = await getUserToken();
      if (!token) throw new Error("Token non disponibile");
      const res = await PATCHEvent(token, event.id!, patch);
      if (!res.ok) {
        const text = await res.text().catch(() => "Errore server");
        throw new Error(text || `HTTP ${res.status}`);
      }
      await fetchEvents();
    } finally {
      setUpdatingId(null);
    }
  };

  const createEventFromValues = async (
values: EditEventFormValues, selectedDate: Date  ) => {
    const newEvent = buildEventFromValues(values);

    try {
      setCreatingId(true);
      const token = await getUserToken();
      if (!token) throw new Error("Token non disponibile");
      const res = await INSERTEvent(token, newEvent);
      if (!res.ok) {
        const text = await res.text().catch(() => "Errore server");
        throw new Error(text || `HTTP ${res.status}`);
      }
      await fetchEvents();
    } catch (error) {
      console.error("Errore durante la creazione dell'evento:", error);
      alert("Si è verificato un errore durante la creazione dell'evento.");
    } finally {
      setCreatingId(false);
    }
  };

  return {
    date,
    setDate,
    events,
    eventsForSelectedDate,
    loading,
    hasEvents,
    handleDelete,
    deletingId,
    setDeletingId,
    editEventFromValues,
    updatingId,
    setUpdatingId,
    createEventFromValues,
    creatingId,
  };
};
