import { GETEvents } from "@/network/google_calendar";
import { CalendarEvent } from "@/types/event";
import { GoogleCalendarEvent, mapGoogleCalendarEvents } from "@/utils/mappers/mapGoogleCalendarEvents";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useDashboard = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
                const calendarEvents = await GETEvents(token, params).then((response) =>
                    response.json()
                ).then(({ items }: { items: GoogleCalendarEvent[] }): CalendarEvent[] => {

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

    useEffect(() => {
        fetchEvents();
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
    }

    return {
        date, setDate, events, eventsForSelectedDate, loading, hasEvents
    }
}