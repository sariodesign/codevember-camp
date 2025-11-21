import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/utils/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
// type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export async function findProfileById(
    supabase: SupabaseClient<Database>,
    id: string
): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to find profile: ${error.message}`);
    }

    return data;
}

export async function findProfileByEmail(
    supabase: SupabaseClient<Database>,
    email: string
): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to find profile: ${error.message}`);
    }

    return data;
}

export async function updateProfile(
    supabase: SupabaseClient<Database>,
    id: string,
    updates: ProfileUpdate
): Promise<Profile> {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
}

export async function findProfileWithPreferences(
    supabase: SupabaseClient<Database>,
    id: string
) {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      user_preferences (*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to find profile with preferences: ${error.message}`);
    }

    return data;
}

export async function deleteProfile(
    supabase: SupabaseClient<Database>,
    id: string
): Promise<void> {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete profile: ${error.message}`);
    }
}