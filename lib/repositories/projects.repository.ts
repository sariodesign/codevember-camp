import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
// type NewProjectInput = {
//     id?: string;
//     name: string;
//     priority: number;
//     created_at?: string | null;
//     updated_at?: string | null;
// };

// export async function createUserProjects(
//     supabase: SupabaseClient<Database>,
//     {
//         userId,
//         projects
//     }: {
//         userId: string;
//         projects: any;
//     }
// ): Promise<Project[]> {
//     // Agganciamo user_id (obbligatorio nel tipo Project)
//     const projectsWithUserId = projects.map((p: NewProjectInput) => ({
//         ...p,
//         user_id: userId,
//     } as NewProjectInput));

//     const { data, error } = await supabase
//         .from('projects')
//         .upsert(projectsWithUserId, { onConflict: 'id' })
//         .select();

//     if (error) throw error;
//     return data as Project[];
// }

export async function createUserProjects(
    supabase: SupabaseClient<Database>,
    {
        userId,
        projects
    }: {
        userId: string;
        projects: Partial<Project>[]
    }): Promise<Project[]> {
    const projectsWithUserId: ProjectInsert[] = projects.map(p => ({
        name: p.name!,
        priority: p.priority!,
        user_id: userId
    }));

    const { data, error } = await supabase.from('projects').insert(projectsWithUserId).select();
    if (error) throw error;

    return data ?? [];
}
