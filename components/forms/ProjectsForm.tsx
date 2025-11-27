"use client";

import { useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboardingForm } from "@/hooks/onboarding/useOnboardingForm";
import { Project } from "@/lib/validations/onboarding";

interface Props {
  form: ReturnType<typeof useOnboardingForm>
  onSubmit: () => void
}

export const ProjectsForm = ({ form, onSubmit }: Props) => {

  const handleProjectsNumChange = (value: string) => {
    const num = parseInt(value, 10) || 0;
    const newProjects = Array.from({ length: num }, () => ({
      name: "",
      priority: "",
    }));
    form.setFieldValue("projects.numberOfProjects", Number(value));
    form.setFieldValue("projects.projects", newProjects);
  };

  const projects = useStore(form.store, (state) => state.values.projects.projects);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Progetti</h1>
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit()
          }}
        >
          <div className="space-y-4">
            <form.AppField
              name="projects.numberOfProjects"
              children={(field) => {
                return (
                  <div className="space-y-2">
                    <div className="flex items-start py-2">
                      <Label htmlFor={field.name}>
                        A quanti progetti stai lavorando?
                      </Label>
                    </div>
                    <Select
                      value={String(field.state.value)}
                      onValueChange={handleProjectsNumChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona numero progetti" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 progetto</SelectItem>
                        <SelectItem value="2">2 progetti</SelectItem>
                        <SelectItem value="3">3 progetti</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )} */}
                  </div>
                );
              }}
            >
            </form.AppField>

            {projects.map((project: Project, index: number) => (
              <div key={index} className="border rounded p-3 space-y-3">
                <h3 className="font-semibold">Progetto {index + 1}</h3>

                <div className="flex space-x-4">
                  <form.AppField
                    name={`projects.projects[${index}].name`}
                    validators={{
                      onChange: ({ value }) => {
                        if (!(value as string)?.trim()) {
                          return "Il nome del progetto è obbligatorio";
                        }
                        return undefined;
                      },
                    }}
                    children={(field) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>
                            Nome del progetto
                          </Label>
                          <Input
                            id={`name-${index}`}
                            type="text"
                            placeholder="Es. Progetto A"
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      );
                    }}
                  />
                  <form.AppField
                    name={`projects.projects[${index}].priority`}
                    children={(field) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={`priority-${index}`}>
                            Priorità del progetto
                          </Label>
                          <Select
                            value={field.state.value as string}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleziona la priorità" />
                            </SelectTrigger>
                            <SelectContent>
                              {/** 
                               // TODO:  Lasciare così per ora, più avanti si possono gestire i valori con un enum
                               */}
                              <SelectItem value={`${1}`}>Alta</SelectItem>
                              <SelectItem value={`${2}`}>Media</SelectItem>
                              <SelectItem value={`${3}`}>Bassa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            ))}
            <form.SubscribeButton label="Continua" />
          </div>
        </form>
      </form.AppForm>
    </div>
  );
};
