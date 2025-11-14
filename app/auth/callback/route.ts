import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    let next = searchParams.get('next') ?? '/'
    if (!next.startsWith('/')) {
        // if "next" is not a relative URL, use the default
        next = '/'
    }

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        const providerToken = data.session?.provider_token;
        const refreshToken = data.session?.refresh_token;
        console.log({
            providerToken,
            refreshToken
        })

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
            {
                headers: {
                    "Authorization": `Bearer ${providerToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // ✅ SE IL TOKEN È SCADUTO, PROVA A RINNOVARE LA SESSIONE
        if (response.status === 401) {
            throw new Error("Token scaduto, necessario nuovo login");
        }

        console.log(response);

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}