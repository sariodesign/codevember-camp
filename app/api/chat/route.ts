import { createOllama } from "ollama-ai-provider-v2";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LLM_MODEL, SYSTEM_PROMPT } from "@/utils/constant/chat";
import { isTimeZoneValue } from "@/utils/shared";
import { createClient } from "@/utils/supabase/server";
import { CalendarEvent } from "@/types/event";
import { GETEvents } from "@/network/google_calendar";
import { UserInfo } from "@/types/userInfos";

export const runtime = "nodejs";

const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const supabase = await createClient();

    const result = await streamText({
      model: ollama(LLM_MODEL),
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        getUserInfoPrompt: {
          description:
            "Returns user information from the session. Use this tool first when user ask for event-related information.",
          inputSchema: z.object().describe("No input needed."),
          outputSchema: z.string().describe("The user information prompt."),
          execute: async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
              throw new Error("Impossible to get session");
            }

            const userId = data.user?.id;

            const { data: userInfo } = await supabase
              .from("onboardings")
              .select()
              .eq("user_id", userId)
              .single();

            if (!userInfo) {
              throw new Error("User info not found");
            }

            const prompt = createPromptFromUserInfo(userInfo as UserInfo);

            return prompt;
          },
        },
        getCurrentTime: {
          description: "Returns the current time in HH:MM format.",
          inputSchema: z
            .object({ timeZone: z.string() })
            .describe("The IANA time zone name, e.g., 'America/New_York'."),
          execute: async ({ timeZone }: { timeZone: string }) => {
            console.log("getCurrentTime called with timeZone:", timeZone);
            if (!isTimeZoneValue(timeZone)) {
              return "The timezone is not valid. I want a format like this: America/New_York";
            }

            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
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
              if (event.description) {
                allDesciptions.push(event.description);
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

function createPromptFromUserInfo(userInfo: UserInfo): string {
  const prompt = `You are assisting a user with their calendar and scheduling needs. Here is their configuration:

User Preferences:
- Productive Hours: ${userInfo.productive_hours_start} to ${
    userInfo.productive_hours_end
  }
  (The user is most productive during these hours and prefers important tasks scheduled within this window)
- Focus Session Duration: ${userInfo.focus_session_duration} minutes
  (Preferred length for deep work sessions without interruptions)
- Preferred Meeting Duration: ${userInfo.preferred_meeting_duration} minutes
  (Default length for scheduled meetings)
- Auto Schedule Focus Sessions: ${
    userInfo.auto_schedule_focus_sessions ? "Enabled" : "Disabled"
  }
  (${
    userInfo.auto_schedule_focus_sessions
      ? "Automatically create focus blocks in the calendar"
      : "Manual focus session scheduling required"
  })

When providing scheduling suggestions or analyzing the calendar:
- Respect the productive hours window for focus-intensive tasks
- Consider the user's preferred durations when suggesting new events
- ${
    userInfo.auto_schedule_focus_sessions
      ? "Suggest available slots for focus sessions"
      : "Ask before scheduling focus sessions"
  }
- Avoid scheduling back-to-back meetings when possible`;

  return prompt;
}
