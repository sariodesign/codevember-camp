"use client";
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
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const supabase = createClient();

  return (
    <Card className="w-full max-w-md m-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Benvenuto in <strong>Time Waster Pro</strong>
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
                redirectTo: `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL}/auth/callback`,
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
