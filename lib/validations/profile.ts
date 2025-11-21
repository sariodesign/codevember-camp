import { z } from 'zod';

// Schema per aggiornare il profilo
export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Il nome deve contenere almeno 2 caratteri')
        .max(100, 'Il nome non può superare 100 caratteri')
        .optional(),

    timezone: z
        .string()
        .regex(
            /^[A-Za-z]+\/[A-Za-z_]+$/,
            'Timezone non valido (es. Europe/Rome)'
        )
        .optional(),

    avatarUrl: z
        .url('URL avatar non valido')
        .optional()
        .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;