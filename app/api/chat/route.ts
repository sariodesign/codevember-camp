import { createOllama } from "ollama-ai-provider-v2";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LLM_MODEL, SYSTEM_PROMPT } from "@/utils/constant/chat";
import { isTimeZoneValue } from "@/utils/shared";

export const runtime = "nodejs";

const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = await streamText({
      model: ollama(LLM_MODEL),
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        getCurrentTime: {
          description: "Returns the current time in HH:MM format.",
          inputSchema: z
            .object({ timeZone: z.string() })
            .describe("The IANA time zone name, e.g., 'America/New_York'."),
          execute: async ({ timeZone }: { timeZone: string }) => {
            if (!isTimeZoneValue(timeZone)) {
              throw new Error("Invalid time zone value");
            }

            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          },
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new NextResponse(
      `Si è verificato un errore: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { status: 500 }
    );
  }
}
