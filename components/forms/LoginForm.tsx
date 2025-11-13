"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { login } from "@/app/actions/login";
import Link from "next/dist/client/link";
import { Label } from "../ui/label";

export default function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("email", value.email);
      formData.append("password", value.password);
      await login(formData);
    },
  });

  return (
    <Card className="w-full max-w-md m-auto">
      <CardHeader>
        <CardTitle>
          Benvenuto in <strong>Nome App</strong>
        </CardTitle>
        <CardDescription>
          Inserisci la tua email e la tua password per accedere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "L'email è obbligatoria";
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return "Inserisci un'email valida";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
              return (
                <div>
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>Email</Label>
                  </div>
                  <Input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="tuo@email.com"
                  />
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
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "La password è obbligatoria";
                }
                return undefined;
              },
            }}
          >
            {(field) => {
              return (
                <div>
                  <div className="flex items-start py-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Hai dimenticato la password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                  />
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
            Accedi
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm">
          Non hai un account? <Link href="/signup">Registrati</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
