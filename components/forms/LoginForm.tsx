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
import { GoogleIcon } from "../icons/GoogleIcon";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const supabase = createClient();

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
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Benvenuto in <strong>Nome App</strong>
        </CardTitle>
        <CardDescription>
          Accedi con il tuo account Google per continuare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full flex items-center justify-center gap-3"
          onClick={async () =>
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `http://localhost:3000/auth/callback`,
                scopes: "https://www.googleapis.com/auth/calendar",
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
              },
            })
          }
        >
          <GoogleIcon />
          Continua con Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        
        <p className="text-xs text-muted-foreground mt-4">
          Accedendo accetti i termini e la privacy. I dati saranno usati solo per autenticazione e
          sincronizzazione del calendario.
        </p>
      </CardFooter>
    </Card>
  );
}
