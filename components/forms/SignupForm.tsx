"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password", "");

  const onSubmit = (data: FormValues) => {
    console.log("submit", data);
  };

  return (
    <Card className="w-full max-w-md mx-auto" {...props}>
      <CardHeader>
        <CardTitle>Crea un nuovo account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome e cognome</FieldLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Nome obbligatorio" }}
                render={({ field }) => (
                  <>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Il tuo nome e cognome"
                      {...field}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <FieldDescription
                        className="text-sm text-destructive mt-1"
                        id="name-error"
                      >
                        {errors.name.message}
                      </FieldDescription>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email obbligatoria",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email non valida",
                  },
                }}
                render={({ field }) => (
                  <>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Scrivi la tua email"
                      {...field}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <FieldDescription
                        className="text-sm text-destructive mt-1"
                        id="email-error"
                      >
                        {errors.email.message}
                      </FieldDescription>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "",
                  minLength: { value: 8, message: ''},
                  validate: {
                    hasUpper: (v: string) =>
                      /[A-Z]/.test(v),
                    hasLower: (v: string) =>
                      /[a-z]/.test(v),
                    hasNumber: (v: string) => /\d/.test(v),
                    hasSpecial: (v: string) =>
                      /[^A-Za-z0-9]/.test(v),
                  },
                }}
                render={({ field }) => (
                  <>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Scrivi la tua password"
                      {...field}
                      aria-invalid={!!errors.password}
                      aria-describedby="password-requirements"
                    />
                    <FieldDescription
                      className="text-sm mt-2"
                      id="password-requirements"
                    >
                      <ul className="p-0 m-0 list-none">
                        <li
                          className={
                            (password || "").length >= 8
                              ? "text-foreground font-semibold"
                              : "text-destructive"
                          }
                        >
                          • 8 caratteri
                        </li>
                        <li
                          className={
                            /[A-Z]/.test(password)
                              ? "text-foreground font-semibold"
                              : "text-destructive"
                          }
                        >
                          • 1 maiuscola
                        </li>
                        <li
                          className={
                            /[a-z]/.test(password)
                              ? "text-foreground font-semibold"
                              : "text-destructive"
                          }
                        >
                          • 1 minuscola
                        </li>
                        <li
                          className={
                            /\d/.test(password)
                              ? "text-foreground font-semibold"
                              : "text-destructive"
                          }
                        >
                          • 1 numero
                        </li>
                        <li
                          className={
                            /[^A-Za-z0-9]/.test(password)
                              ? "text-foreground font-semibold"
                              : "text-destructive"
                          }
                        >
                          • 1 carattere speciale
                        </li>
                      </ul>
                      {errors.password && (
                        <div className="text-sm text-destructive mt-1">
                          {errors.password.message}
                        </div>
                      )}
                    </FieldDescription>
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Conferma Password
              </FieldLabel>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Conferma la password",
                  validate: (v: string) =>
                    v === password || "Le password non corrispondono",
                }}
                render={({ field }) => (
                  <>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ripeti la tua password"
                      {...field}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword ? "confirm-error" : undefined
                      }
                    />
                    {errors.confirmPassword && (
                      <FieldDescription
                        className="text-sm text-destructive mt-1"
                        id="confirm-error"
                      >
                        {errors.confirmPassword.message}
                      </FieldDescription>
                    )}
                  </>
                )}
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="w-full"
                  aria-disabled={!isValid}
                >
                  Crea un account
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Crea un account con Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Hai già un account? <a href="#">Accedi</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
