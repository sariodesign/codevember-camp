interface UserInfo {
  id: string;
  user_id: string;
  productive_hours_start: string;
  productive_hours_end: string;
  focus_session_duration: number;
  preferred_meeting_duration: number;
  auto_schedule_focus_sessions: boolean;
  focus_time_before_meetings: number;
  min_meeting_notice: number;
  allow_ai_rescheduling: boolean;
  working_days: string;
  created_at: string;
  completed_at: string | null;
}

export type { UserInfo };
