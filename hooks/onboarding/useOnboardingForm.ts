import { formOptions } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/shared/form";
import { onboardingSchema, Project } from "@/lib/validations/onboarding";

const onboardingFormOptions = formOptions({
    defaultValues: {
        focusTime: {
            productiveTimeSlot: "",
            focusTimeLength: "",
            pauseTimeLength: "",
            sessionsBeforeBreak: "",
        },
        projects: {
            numberOfProjects: 0,
            projects: [] as Project[],
        }
    },
    validators: {
        onChange: onboardingSchema
    },
    onSubmit: async ({ value }) => {
        // Do something
        // ...
    }
})

export const useOnboardingForm = () => useAppForm(onboardingFormOptions)