import { CalendarEvent } from "@/types/event";
import { BASE_CALENDAR_URL } from "@/utils/constant/api_url";
import { GoogleCalendarSendUpdates } from "@/utils/enum/google_calendar";

//TODO: change the function so it can be more generic
async function GETEvents(
  token: string,
  params?: URLSearchParams,
  calendarId: string = "primary"
): Promise<Response> {
  //     const startOfMonth = new Date();
  // startOfMonth.setDate(1);
  // startOfMonth.setHours(0, 0, 0, 0);

  // const endOfMonth = new Date(startOfMonth);
  // endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  // const params = new URLSearchParams({
  //   timeMin: startOfMonth.toISOString(),
  //   timeMax: endOfMonth.toISOString(),
  //   singleEvents: 'true',
  //   orderBy: 'startTime',
  // });

  // if (!session?.provider_token){
  //   throw new Error("Token not available");
  // }

  const url = new URL(`${BASE_CALENDAR_URL}${calendarId}/events`);
  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}

/**
 * Crea un evento nel calendario specificato. Default value of calendarId is "primary".
 * Docs: https://developers.google.com/workspace/calendar/api/v3/reference/events/insert
 */
async function INSERTEvent(
  token: string,
  event: CalendarEvent,
  calendarId: string = "primary",
  sendUpdates:
    | GoogleCalendarSendUpdates.All
    | GoogleCalendarSendUpdates.ExternalOnly
    | GoogleCalendarSendUpdates.None = GoogleCalendarSendUpdates.None
): Promise<Response> {
  const url = new URL(`${BASE_CALENDAR_URL}${calendarId}/events`);

  if (sendUpdates !== GoogleCalendarSendUpdates.None) {
    url.searchParams.set("sendUpdates", sendUpdates);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  return response;
}

export { GETEvents, INSERTEvent };
