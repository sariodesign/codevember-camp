"use client";

import { FocusTimeForm } from "@/components/forms/FocusTimeForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface UserOnboardingQuestions {
  focusTime: {
    productiveTimeSlot: string;
    focusTimeLength: string;
    pauseTimeLength: string;
    sessionsBeforeBreak: string;
  };
  projects: {
    projects: string[];
  };
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [userOnboardingQuestions, setUserOnboardingQuestions] =
    useState<UserOnboardingQuestions>({
      focusTime: {
        productiveTimeSlot: "",
        focusTimeLength: "",
        pauseTimeLength: "",
        sessionsBeforeBreak: "",
      },
      projects: {
        projects: [],
      },
    });

  const handleFocusTimeSubmit = (value: any) => {
    console.log(value);
    setUserOnboardingQuestions({
      ...userOnboardingQuestions,
      focusTime: value,
    });
    setStep(2);
  };

  const handleProjectsSubmit = (value: any) => {
    console.log("Projects:", value);
    setUserOnboardingQuestions({
      ...userOnboardingQuestions,
      projects: {
        projects: value,
      },
    });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center border-4 border-red-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="space-y-6 flex justify-between">
              <h1 className="text-2xl font-bold">Onboarding</h1>
              <div>
                Step {step} di 2
                <Progress
                  className="max-w-2xs mx-auto mt-4"
                  value={(step / 2) * 100}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && <FocusTimeForm onSubmit={handleFocusTimeSubmit} />}

          {step === 2 && <ProjectsForm onSubmit={handleProjectsSubmit} />}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant="outline">
              Indietro
            </Button>
          )}

          {/* <Button onClick={() => setStep(step + 1)} disabled={step === 2}>
            Avanti
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
