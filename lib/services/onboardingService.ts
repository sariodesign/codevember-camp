import { updateUserPreferences } from '@/lib/repositories/user_preferences';
import { createUserProjects } from '@/lib/repositories/projects.repository';
import { completeOnboarding } from '@/lib/repositories/onboardings.repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/utils/supabase/database.types';
import { mapFocusTimeToDatabase, mapProjectsToDatabase } from '../mappers/onboarding';
import { FocusTimeForm, focusTimeFormSchema, projectsFormSchema, ProjectForm } from '../validations/onboarding';

import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { createClient } from '@/utils/supabase/client';


export async function submitFocusTimeStep(
    formData: FocusTimeForm
) {

    const supabase: SupabaseClient<Database> = createClient()
    const { data: userData } = await getCurrentUser()
    const userId = userData.user?.id
    try {

        const validatedData = focusTimeFormSchema.parse(formData);

        const databaseData = mapFocusTimeToDatabase(validatedData);

        if (!userId) {
            return {
                success: false,
                error: "Something went wrong"
            }
        }
        const responseData = await updateUserPreferences(supabase, {
            userId: userId,
            preferences: databaseData
        })

        return { success: true, data: responseData };
    } catch (error) {
        console.error('Error in submitFocusTimeStep:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function submitProjectsStep(
    formData: ProjectForm
) {

    const supabase: SupabaseClient<Database> = createClient()
    const { data: userData } = await getCurrentUser()
    const userId = userData.user?.id
    try {
        const validatedData = projectsFormSchema.parse(formData);

        const databaseData = mapProjectsToDatabase(validatedData.projects);


        if (!userId) {
            return {
                success: false,
                error: "Missing userId"
            }
        }

        const [projectsResult, onboardingResult] = await Promise.all([
            createUserProjects(supabase, { userId, projects: databaseData }),
            completeOnboarding(supabase, userId)
        ]);

        return {
            success: true,
            data: {
                projects: projectsResult,
                onboarding: onboardingResult
            }
        };
    } catch (error) {
        console.error('Error in submitProjectsStep:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}