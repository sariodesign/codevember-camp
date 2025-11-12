'use client';

import { FocusTimeForm } from '@/components/forms/FocusTimeForm';
import { ProjectsForm } from '@/components/forms/ProjectsForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

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
        productiveTimeSlot: '',
        focusTimeLength: '',
        pauseTimeLength: '',
        sessionsBeforeBreak: '',
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

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center border-4 border-red-500'>
      {/* TODO: Progress bar */}
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && <FocusTimeForm onSubmit={handleFocusTimeSubmit} />}
          {step === 2 && <ProjectsForm />}
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant='outline'>
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
