"use client";

import { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FocusTimeForm } from "@/components/forms/FocusTimeForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { useOnboardingForm } from "@/hooks/onboarding/useOnboardingForm";
import { submitFocusTimeStep, submitProjectsStep } from "@/lib/services/onboardingService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Onboarding() {

  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter()
  const form = useOnboardingForm()

  const handleFocusTimeSubmit = useCallback(async () => {
    toast.promise(submitFocusTimeStep(form.getFieldValue("focusTime")).then((data) => {
      if (data.success) {
        setTimeout(() => setCurrentStep(2), 1000)
        return "Focus time step submitted successfully";
      } else {
        console.log(data.error)
        throw new Error("");
      }
    })
      .catch((err) => {
        console.error(err);
        throw err;
      }),
      {
        loading: 'Submitting focus time...',
        success: (data) => `${data}`,
        error: `Submission failed`
      }
    )
  }, []);

  const handleProjectsSubmit = useCallback(async () => {
    toast.promise(submitProjectsStep(form.getFieldValue("projects")).then((data) => {
      if (data.success) {
        setTimeout(() => {
          toast.success("Onboarding completed successfully")
          router.replace("/dashboard")
        }, 1000)
        return "Projects step submitted successfully";
      } else {
        console.log(data.error)
        throw new Error("");
      }
    })
      .catch((err) => {
        console.error(err);
        throw err;
      }),
      {
        loading: 'Submitting projects...',
        success: (data) => `${data}`,
        error: `Submission failed`
      }
    )
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="space-y-6 flex justify-between">
              <h1 className="text-2xl font-bold">Onboarding</h1>
              <div>
                step {currentStep} di 2
                <Progress
                  className="max-w-2xs mx-auto mt-4"
                  value={(currentStep / 2) * 100}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <FocusTimeForm
              form={form}
              onSubmit={handleFocusTimeSubmit}
            />
          )}

          {currentStep === 2 && (
            <ProjectsForm
              form={form}
              onSubmit={handleProjectsSubmit}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {currentStep > 1 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)} variant="outline">
              Indietro
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
