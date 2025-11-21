import type { Database } from '@/utils/supabase/database.types';

type ProfileDb = Database['public']['Tables']['profiles']['Row'];

export interface ProfilePageDto {
    profile: ProfileDb;
    stats: {
        isComplete: boolean;
        memberSince: string;
    };
}

export interface ProfileUpdateResponseDto {
    success: boolean;
    profile: ProfileDb;
    message?: string;
}

export function toProfilePageDto(profileDb: ProfileDb): ProfilePageDto {


    const createdDate = new Date(profileDb.created_at || new Date());
    const memberSince = createdDate.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
    });

    return {
        profile: profileDb,
        stats: {
            isComplete: !!(profileDb.full_name && profileDb.timezone !== 'Europe/Rome'),
            memberSince,
        },
    };
}

export function toProfileUpdateResponse(
    profileDb: ProfileDb,
    message = 'Profilo aggiornato con successo'
): ProfileUpdateResponseDto {
    return {
        success: true,
        profile: profileDb,
        message,
    };
}