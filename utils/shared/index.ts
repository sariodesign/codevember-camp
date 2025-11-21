import { UserPreferences } from "@/lib/repositories/user_preferences";

const isTimeZoneValue = (timeZone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
};

function createPromptFromUserInfo(userInfo: UserPreferences): string {
  const prompt = `You are assisting a user with their calendar and scheduling needs. Here is their configuration:

User Preferences:
- Productive Time Slot: ${userInfo.productive_time_slot ?? "not configured"}
  (The user is most productive during this time window and prefers to schedule important and deep work sessions here)
- Focus Session Length: ${
    userInfo.focus_time_length ?? "not configured"
  } minutes
  (Preferred length for focused work sessions without interruptions)
- Break Length: ${userInfo.pause_time_length ?? "not configured"} minutes
  (Preferred duration of breaks between focus sessions)
- Sessions Before Break: ${userInfo.sessions_before_break ?? "not configured"}
  (Number of consecutive focus sessions the user prefers before taking a break)

When providing scheduling suggestions or analyzing the calendar:
- Prioritize focus-intensive tasks within the productive time slot
- Use the preferred focus session length when suggesting work blocks
- Insert breaks according to the configured break length and sessions before break
- Avoid scheduling back-to-back meetings that disrupt planned focus and break cycles`;

  return prompt;
}

export { isTimeZoneValue, createPromptFromUserInfo };
