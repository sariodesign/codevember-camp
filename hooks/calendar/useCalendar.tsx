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
import { toast } from "sonner";

export const useCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<boolean>(false);

  // Range is calculated dynamically inside fetchEvents (we fetch referenceMonth -1 .. +1)

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
      toast.success("Event deleted successfully!");
      await fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event.");
      console.error("Errore durante l'eliminazione dell'evento:", error);
      alert("Si è verificato un errore durante l'eliminazione dell'evento.");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchEvents = useCallback(async (referenceMonth?: Date) => {
    // if no month provided, use current date as reference
    const ref = referenceMonth ?? new Date();

    // start = first day of previous month at 00:00
    const start = new Date(
      ref.getFullYear(),
      ref.getMonth() - 1,
      1,
      0,
      0,
      0,
      0
    );

    // end = first day of the month after next (exclusive boundary)
    const end = new Date(ref.getFullYear(), ref.getMonth() + 2, 1, 0, 0, 0, 0);

    const allItems: GoogleCalendarEvent[] = [];
    let pageToken: string | undefined = undefined;

    try {
      const token = await getUserToken();
      if (!token) return setEvents([]);

      do {
        const params = new URLSearchParams({
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          singleEvents: "true",
          orderBy: "startTime",
          maxResults: "2500",
        });
        if (pageToken) params.set("pageToken", pageToken);

        const res = await GETEvents(token, params);
        if (!res.ok) {
          const text = await res.text().catch(() => "Errore server");
          throw new Error(text || `HTTP ${res.status}`);
        }

        const json = await res.json();
        allItems.push(...(json.items ?? []));
        pageToken = json.nextPageToken;
      } while (pageToken);

      const calendarEvents = mapGoogleCalendarEvents(allItems);
      setEvents(calendarEvents || []);
    } catch (error) {
      console.error("Errore nel recupero degli eventi del calendario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const onCalendarUpdated = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail;
      const monthIso = detail?.month as string | undefined;
      const month = monthIso ? new Date(monthIso) : undefined;
      fetchEvents(month);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "calendar:updated",
        onCalendarUpdated as EventListener
      );
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "calendar:updated",
          onCalendarUpdated as EventListener
        );
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
      toast.success("Event updated successfully!");
      await fetchEvents();
    } catch {
      toast.error("Failed to update event.");
    } finally {
      setUpdatingId(null);
    }
  };

  const createEventFromValues = async (
    values: EditEventFormValues,
    _selectedDate?: Date
  ) => {
    const newEvent = buildEventFromValues(values, _selectedDate);

    try {
      setCreatingId(true);
      const token = await getUserToken();
      if (!token) throw new Error("Token non disponibile");
      const res = await INSERTEvent(token, newEvent);
      if (!res.ok) {
        const text = await res.text().catch(() => "Errore server");
        throw new Error(text || `HTTP ${res.status}`);
      }

      toast.success("Event created successfully!");
      await fetchEvents();
    } catch (error) {
      toast.error("Failed to create event.");
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
