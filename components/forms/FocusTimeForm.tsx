"use client";

import { useForm } from "@tanstack/react-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";

interface FocusTime {
  productiveTimeSlot: string;
  focusTimeLength: string;
  pauseTimeLength: string;
  sessionsBeforeBreak: string;
}

interface Props {
  onSubmit: (value: FocusTime) => void;
  defaultValues?: FocusTime;
}



export const FocusTimeForm = ({ onSubmit, defaultValues }: Props) => {
  const form = useForm({
    defaultValues: defaultValues || {
      productiveTimeSlot: "",
      focusTimeLength: "",
      pauseTimeLength: "",
      sessionsBeforeBreak: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Focus Time</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="space-y-4">
          <form.Field
            name="productiveTimeSlot"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Quando sei più produttivo? è obbligatorio";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
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
                      <SelectItem value="mattina">Mattina</SelectItem>
                      <SelectItem value="pomeriggio">Pomeriggio</SelectItem>
                      <SelectItem value="sera">Sera</SelectItem>
                      <SelectItem value="notte">Notte</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field
            name="focusTimeLength"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Quanto dovrebbero durare le tue sessioni di focus? è obbligatorio";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
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
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="25" id="25" />
                      <Label htmlFor="25">25 min</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="50" id="50" />
                      <Label htmlFor="50">50 min</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="90" id="90" />
                      <Label htmlFor="90">90 min</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Input
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
                        disabled={
                          !field.state.value ||
                          ["25", "50", "90"].includes(field.state.value)
                        }
                      />
                    </div>
                  </RadioGroup>
                  {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field
            name="pauseTimeLength"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Che tipo di pause preferisci? è obbligatorio";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
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
                  {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field
            name="sessionsBeforeBreak"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Quante sessioni di focus vuoi fare prima di una pausa? è obbligatorio";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
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
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="1" id="1" />
                      <Label htmlFor="1">1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="2" id="2" />
                      <Label htmlFor="2">2</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="3" id="3" />
                      <Label htmlFor="3">3 o più</Label>
                    </div>
                  </RadioGroup>
                  {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )}
                </div>
              );
            }}
          </form.Field>
          <Button type="submit" className="w-full">
            Continua
          </Button>
        </div>
      </form>
    </div>
  );
};
