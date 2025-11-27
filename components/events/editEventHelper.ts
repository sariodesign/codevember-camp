import type { CalendarEvent } from "@/types/event";
import type { EditEventFormValues } from "@/components/forms/EditEventForm";


export function buildPatchFromValues(values: EditEventFormValues, originalEvent: CalendarEvent) {
  const usesDateTime = !!originalEvent.start?.dateTime;
  const patch: Partial<CalendarEvent> = {};

  if (values.summary !== undefined) patch.summary = values.summary;
  if (values.description !== undefined) patch.description = values.description;

  if (values.start) {
    patch.start = usesDateTime
      ? { dateTime: new Date(values.start).toISOString() }
      : { date: values.start };
  }

  if (values.end) {
    patch.end = usesDateTime
      ? { dateTime: new Date(values.end).toISOString() }
      : { date: values.end };
  }

  return patch;
}