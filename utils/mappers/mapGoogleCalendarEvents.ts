import { CalendarEvent } from "@/types/event";


export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  location?: string;
  start?: {
    dateTime: string;
  };
  end?: {
    dateTime: string;
  };
}

export function mapGoogleCalendarEvents(googleEvents: GoogleCalendarEvent[]): CalendarEvent[] {
  return googleEvents.map((event: GoogleCalendarEvent) => ({
    id: event.id,
    summary: event.summary,
    description: event.description || "",
    location: event.location || "",
    start: { dateTime: event.start?.dateTime },
    end: { dateTime: event.end?.dateTime }
  }));
}