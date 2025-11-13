"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { GoogleIcon } from "../icons/GoogleIcon";



export default function LoginForm() {
  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader>
        <CardTitle>
          Benvenuto in <strong>Nome App</strong>
        </CardTitle>
        <CardDescription>
          Inserisci la tua email e la tua password per accedere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">E-mail</FieldLabel>
            <Input
              id="username"
              type="email"
              placeholder="mariorossi@email.com"
              required
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Hai dimenticato la password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Accedi
        </Button>

        <Button variant="outline" className="w-full">
          Crea un nuovo account
        </Button>
        <p className="text-sm font-semibold mt-4">Oppure continua con</p>
        <Button className="w-full">
          <GoogleIcon />
          Google
        </Button>
      </CardFooter>
    </Card>
  );
}
