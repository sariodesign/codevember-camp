import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "Il nome del progetto è obbligatorio"),
    priority: z.string().min(1, "La priorità è obbligatoria"),
});

export const focusTimeFormSchema = z.object({
    productiveTimeSlot: z.string().min(1, "Seleziona un momento della giornata"),
    focusTimeLength: z.string().min(1, "Seleziona la durata della sessione"),
    pauseTimeLength: z.string().min(1, "Seleziona la durata della pausa"),
    sessionsBeforeBreak: z.string().min(1, "Seleziona il numero di sessioni prima della pausa"),
})

export const pojectsFormSchema = z.object({
    numberOfProjects: z.number().min(1, "Aggiungere almeno un progetto"),
    projects: z.array(projectSchema),
})

export const onboardingSchema = z.object({
    focusTime: focusTimeFormSchema,
    projects: pojectsFormSchema,
});


export type Project = z.infer<typeof projectSchema>
export type Onboarding = z.infer<typeof onboardingSchema>;
export type ProjectForm = z.infer<typeof pojectsFormSchema>;
export type FocusTimeForm = z.infer<typeof focusTimeFormSchema>;