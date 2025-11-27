import { createOllama } from "ollama-ai-provider-v2";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LLM_MODEL, SYSTEM_PROMPT } from "@/utils/constant/chat";
import { createPromptFromUserInfo } from "@/utils/shared";
import { createClient } from "@/utils/supabase/server";
import { CalendarEvent } from "@/types/event";
import { GETEvents, INSERTEvent } from "@/network/google_calendar";
import {
  findUserPreferencesByUserId,
  UserPreferences,
} from "@/lib/repositories/user_preferences";
import { findProfileById } from "@/lib/repositories/profile.repository";

export const runtime = "nodejs";

const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const supabase = await createClient();
    const infoUserPrompt = await getUserPrompt();

    const result = await streamText({
      model: ollama(LLM_MODEL),
      system: SYSTEM_PROMPT.concat("\n").concat(infoUserPrompt),
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        addGoogleCalendarEvent: {
          description:
            "Adds a new event to the user's Google Calendar. Call this tool when the user wants to add an event to their calendar. If not specified, use the user preferences for timezone, time range and session length.",
          inputSchema: z.object({
            summary: z
              .string()
              .optional()
              .describe("The summary or title of the event."),
            description: z
              .string()
              .optional()
              .describe("The description of the event."),
            location: z
              .string()
              .optional()
              .describe("The location of the event."),
            startDateTime: z
              .string()
              .describe(
                "The start date and time in ISO format, e.g., '2025-11-22T10:00:00+01:00'."
              ),
            endDateTime: z
              .string()
              .describe(
                "The end date and time in ISO format, e.g., '2025-11-22T11:00:00+01:00'."
              ),
            timeZone: z
              .string()
              .optional()
              .describe("The IANA time zone name, e.g., 'America/New_York'."),
          }),
          execute: async ({
            summary,
            description,
            location,
            startDateTime,
            endDateTime,
            timeZone,
          }: {
            summary?: string;
            description?: string;
            location?: string;
            startDateTime: string;
            endDateTime: string;
            timeZone?: string;
          }) => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
              throw new Error("Impossible to get session");
            }

            const providerToken = data.session?.provider_token;

            if (!providerToken) {
              throw new Error("No provider token available");
            }

            const eventDetails: string = `
                Summary: ${summary ?? "N/A"}
                Description: ${description ?? "N/A"}
                Location: ${location ?? "N/A"}
                Start DateTime: ${startDateTime}
                End DateTime: ${endDateTime}
                TimeZone: ${timeZone ?? "N/A"}`;

            const response: Response = await INSERTEvent(providerToken, {
              summary,
              description,
              location,
              start: {
                dateTime: startDateTime,
                timeZone: timeZone,
              },
              end: {
                dateTime: endDateTime,
                timeZone: timeZone,
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error(
                "Error response from Google Calendar API:",
                errorData
              );
              return `Failed to add event: ${
                errorData.error?.message ?? "Unknown error"
              }`;
            }

            return `Event added successfully to your Google Calendar. Event Details: ${eventDetails}`;
          },
        },
        getAllTheEvents: {
          description:
            "Returns all the descriptions of events happening today from Google Calendar.",
          inputSchema: z.any().describe("No input needed."),
          execute: async () => {
            const { data, error } = await supabase.auth.getSession();
            let response: Response;
            let allEvents: CalendarEvent[] = [];

            if (error) {
              throw new Error("Impossible to get session");
            }

            let providerToken = data.session?.provider_token;

            response = await GETEvents(providerToken!);

            //TODO: handle token refresh, is not working properly
            if (response.status === 401 && data.session) {
              const { data: refreshData, error: refreshError } =
                await supabase.auth.refreshSession(data.session);

              if (refreshError || !refreshData.session?.provider_token) {
                throw new Error("Token scaduto, necessario nuovo login");
              }

              providerToken = refreshData.session.provider_token;

              response = await GETEvents(providerToken);
            }

            const dataEvent = await response.json();
            allEvents = allEvents.concat(dataEvent.items || []);

            const allDesciptions: string[] = [];
            allEvents.forEach((event) => {
              if (event.summary) {
                allDesciptions.push(event.summary);
              }
            });
            return allDesciptions;
          },
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new NextResponse(
      `Si è verificato un errore: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { status: 500 }
    );
  }
}

async function getUserPrompt() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error("Impossible to get session");
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const userInfo = await findUserPreferencesByUserId(supabase, userId);
    const userProfile = await findProfileById(supabase, userId);

    if (!userInfo || !userProfile?.timezone) {
      throw new Error("Missing info");
    }

    const prompt = createPromptFromUserInfo(
      userInfo as UserPreferences,
      userProfile?.timezone
    );

    return prompt;
  } catch (err) {
    return `Error retrieving user info: ${
      err instanceof Error ? err.message : String(err)
    }`;
  }
}
