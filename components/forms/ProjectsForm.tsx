"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Project = {
  name: string;
  priority: string;
};

interface Props {
  onSubmit: (value: Project[]) => void;
}

export const ProjectsForm = ({ onSubmit }: Props) => {
  const [projectForms, setProjectForms] = useState(0);

  const form = useForm({
    defaultValues: {
      projectsNum: "0",
      projects: [] as Project[],
    },
    onSubmit: async ({ value }) => {
      onSubmit(value.projects);
      console.log("Submitting projects:", value.projects);
    },
  });

  const handleProjectsNumChange = (value: string) => {
    const num = parseInt(value, 10) || 0;
    const newProjects = Array.from({ length: num }, () => ({
      name: "",
      priority: "",
    }));
    form.setFieldValue("projectsNum", value);
    form.setFieldValue("projects", newProjects);
    setProjectForms((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Progetti</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="space-y-4">
          <form.Field
            name="projectsNum"
            validators={{
              onChange: ({ value }) => {
                if (!value || value === "0") {
                  return "A quanti progetti stai lavorando? è obbligatorio";
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
                      A quanti progetti stai lavorando?
                    </Label>
                  </div>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      handleProjectsNumChange(value);
                    }}
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
                  {field.state.meta.errorMap["onChange"] && (
                    <em className="text-red-700 dark:text-red-400 text-sm">
                      {field.state.meta.errorMap["onChange"]}
                    </em>
                  )}
                </div>
              );
            }}
          </form.Field>

          {form
            .getFieldValue("projects")
            .map((project: Project, index: number) => (
              <div key={index} className="border rounded p-3 space-y-3">
                <h3 className="font-semibold">Progetto {index + 1}</h3>

                <div className="flex space-x-4">
                  <form.Field name={`projects[${index}].name`}
                  validators={{
                    onChange: ({value}) => {
                      if(!value?.trim()){
                        return "Il nome del progetto è obbligatorio";
                      }
                      return undefined;
                    }
                  }}>
                    {(field) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>
                            Nome del progetto
                          </Label>
                          <Input
                            id={`name-${index}`}
                            type="text"
                            placeholder="Es. Progetto A"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      );
                    }}
                  </form.Field>
                  <form.Field name={`projects[${index}].priority`}>
                    {(field) => {
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
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="media">Media</SelectItem>
                              <SelectItem value="bassa">Bassa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }}
                  </form.Field>
                </div>
              </div>
            ))}

          <Button type="submit" className="w-full">
            Continua
          </Button>
        </div>
      </form>
    </div>
  );
};
