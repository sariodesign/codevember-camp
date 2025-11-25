import { UserPreferences } from "@/lib/repositories/user_preferences";

const isTimeZoneValue = (timeZone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
};

function createPromptFromUserInfo(
  userInfo: UserPreferences,
  locale: string
): string {
  const today = new Date();

  const prompt = `USER CONTEXT
- Current date (user local): ${today.toDateString()}
- Timezone (IANA): ${locale}

USER PREFERENCES
- Productive time slot: ${userInfo.productive_time_slot ?? "not configured"}
  (Time window when the user is most productive and prefers important / deep-work sessions)
- Focus session length: ${
    userInfo.focus_time_length ?? "not configured"
  } minutes
  (Preferred length for uninterrupted focus sessions)
- Break length: ${userInfo.pause_time_length ?? "not configured"} minutes
  (Preferred duration of breaks between focus sessions)
- Sessions before break: ${userInfo.sessions_before_break ?? "not configured"}
  (Number of consecutive focus sessions before the user prefers a break)

INSTRUCTIONS FOR USING THESE PREFERENCES
- When suggesting or scheduling focus work:
  - Prioritize deep-work tasks inside the productive time slot when possible.
  - Use the preferred focus session length when proposing work blocks.
  - Insert breaks according to the configured break length and sessions-before-break.
- Avoid scheduling back-to-back meetings that would disrupt planned focus and break cycles.
- Interpret ambiguous date expressions (e.g. "today", "tomorrow", "this Friday") using the current date and timezone above.
`;

  return prompt;
}

export { isTimeZoneValue, createPromptFromUserInfo };
