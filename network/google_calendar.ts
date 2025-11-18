import { BASE_CALENDAR_URL } from "@/utils/constant/api_url";

//TODO: change the function so it can be more generic
async function GETEvents(
  token: string,
  calendarId: string = "primary"
): Promise<Response> {
  const response = await fetch(`${BASE_CALENDAR_URL}${calendarId}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}

export { GETEvents };
