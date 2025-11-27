import { FocusTimeForm, ProjectForm } from '@/lib/validations/onboarding';
import { UserPreferences } from '@/lib/repositories/user_preferences';
import { Project } from '../repositories/projects.repository';

export const mapFocusTimeToDatabase = (data: FocusTimeForm): Partial<UserPreferences> => ({
    productive_time_slot: data.productiveTimeSlot,
    focus_time_length: Number(data.focusTimeLength),
    pause_time_length: Number(data.pauseTimeLength),
    sessions_before_break: Number(data.sessionsBeforeBreak),
})



export const mapProjectsToDatabase = (data: ProjectForm['projects']): Partial<Project>[] =>
    data.map((project): Partial<Project> => ({
        name: project.name,
        priority: Number(project.priority),
    }))