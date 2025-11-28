"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Label } from "../ui/label";
import Link from "next/link";
import { signUp } from "@/app/actions/signUp";

export function SignupForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const formData = new FormData();
      formData.append("email", value.email);
      formData.append("password", value.password);
      await signUp(formData)
    },
  });

  return (
    <Card className="w-full max-w-md m-auto">
      <CardHeader>
        <CardTitle>
          Benvenuto in <strong>Time Waster Pro</strong>
        </CardTitle>
        <CardDescription>
          Inserisci una email e una password per creare un account.
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
                if (value.length < 8) {
                  return "La password deve essere di almeno 8 caratteri";
                }
                if (!/[A-Z]/.test(value)) {
                  return "La password deve contenere almeno una lettera maiuscola";
                }
                if (!/[a-z]/.test(value)) {
                  return "La password deve contenere almeno una lettera minuscola";
                }
                if (!/[0-9]/.test(value)) {
                  return "La password deve contenere almeno un numero";
                }
                if (!/[!@#$%^&*]/.test(value)) {
                  return "La password deve contenere almeno un carattere speciale";
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
          <Button variant="default" className="w-full">
            Registrati
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p>
          Hai già un account?{" "}
          <Link className="underline" href="/login">
            Accedi
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
