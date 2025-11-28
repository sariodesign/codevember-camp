"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOnboardingForm } from "@/hooks/onboarding/useOnboardingForm";

interface Props {
  form: ReturnType<typeof useOnboardingForm>
  onSubmit: () => void
}

const Error = ({ field }: { field: any }) => (
  <>
    {field.state.meta.errorMap["onChange"] && (
      <em key={field} className="text-red-700 dark:text-red-400 text-sm">
        {Array.isArray(field.state.meta.errorMap["onChange"])
          ? field.state.meta.errorMap["onChange"]
            .map((e) => (e as any)?.message ?? String(e))
            .join(", ")
          : String(field.state.meta.errorMap["onChange"])}
      </em>
    )}
  </>
)

const RadioGroupListItem = ({ value, children }: { value: number, children: ReactNode }) => (
  <div className="flex items-center gap-2">
    <RadioGroupItem value={`${value}`} id={`${value}`} />
    <Label htmlFor={`${value}`}>{children}</Label>
  </div>
)

export const FocusTimeForm = ({ form, onSubmit }: Props) => (
  <div className="space-y-6">
    <h1 className="text-xl font-semibold">Focus Time</h1>
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit()
        }}
      >
        <div className="space-y-4">
          <form.AppField
            name="focusTime.productiveTimeSlot"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>
                      In quale momento della giornata sei più produttivo?
                    </Label>
                  </div>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un momento" />
                    </SelectTrigger>
                    <SelectContent>
                      {/** 
                       // TODO:  Lasciare così per ora, più avanti si possono gestire i valori con un enum
                       */}

                      <SelectItem value="9:00-13:00">Mattina</SelectItem>
                      <SelectItem value="14:00-18:00">Pomeriggio</SelectItem>
                      <SelectItem value="19:00-23:00">Sera</SelectItem>
                      <SelectItem value="23:00-08:00">Notte</SelectItem>
                    </SelectContent>
                  </Select>
                  <Error field={field} />
                </div>
              );
            }}
          />
          <form.AppField
            name="focusTime.focusTimeLength"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>
                      Quanto dovrebbero durare le tue sessioni di focus?
                    </Label>
                  </div>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <RadioGroupListItem value={25}>25 min</RadioGroupListItem>
                    <RadioGroupListItem value={50}>50 min</RadioGroupListItem>
                    <RadioGroupListItem value={90}>90 min</RadioGroupListItem>
                  </RadioGroup>
                  <div className="flex items-center gap-2">
                    <Input
                      id="custom"
                      type="number"
                      placeholder="Inserisci la durata"
                      value={
                        field.state.value &&
                          !["25", "50", "90", "custom"].includes(
                            field.state.value
                          )
                          ? field.state.value
                          : ""
                      }
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                    />
                  </div>
                  <Error field={field} />
                </div>
              );
            }}
          />
          <form.AppField
            name="focusTime.pauseTimeLength"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>
                      Che tipo di pause preferisci?
                    </Label>
                  </div>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona la durata" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">5 min</SelectItem>
                      <SelectItem value="15min">15 min</SelectItem>
                      <SelectItem value="30min">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                  <Error field={field} />
                </div>
              );
            }}
          />
          <form.AppField
            name="focusTime.sessionsBeforeBreak"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>
                      Quante sessioni di focus vuoi fare prima di una pausa?
                    </Label>
                  </div>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <RadioGroupListItem value={1}>1</RadioGroupListItem>
                    <RadioGroupListItem value={2}>2</RadioGroupListItem>
                    <RadioGroupListItem value={3}>3 o più</RadioGroupListItem>
                  </RadioGroup>
                  <Error field={field} />
                </div>
              );
            }}
          />
          <form.SubscribeButton label="Continua" />
        </div>
      </form>
    </form.AppForm>
  </div>
);