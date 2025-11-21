import type { Database } from '@/utils/supabase/database.types';

type ProfileDb = Database['public']['Tables']['profiles']['Row'];

export interface ProfileDto {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    timezone: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface ProfilePageDto {
    profile: ProfileDto;
    stats: {
        isComplete: boolean;
        memberSince: string;
    };
}

export interface ProfileUpdateResponseDto {
    success: boolean;
    profile: ProfileDto;
    message?: string;
}

export function toProfileDto(profileDb: ProfileDb): ProfileDto {
    return {
        id: profileDb.id,
        email: profileDb.email,
        fullName: profileDb.full_name,
        avatarUrl: profileDb.avatar_url,
        timezone: profileDb.timezone ?? 'Europe/Rome',
        createdAt: profileDb.created_at ?? new Date().toISOString(),
        updatedAt: profileDb.updated_at,
    };
}

export function toProfilePageDto(profileDb: ProfileDb): ProfilePageDto {
    const profile = toProfileDto(profileDb);

    const createdDate = new Date(profile.createdAt);
    const memberSince = createdDate.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
    });

    return {
        profile,
        stats: {
            isComplete: !!(profile.fullName && profile.timezone !== 'Europe/Rome'),
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
        profile: toProfileDto(profileDb),
        message,
    };
}