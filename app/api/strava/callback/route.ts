import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exchangeCode } from '@/lib/strava/client';
import { stravaConfigured } from '@/lib/strava/tokens';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/progresso?strava=denied', request.url));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', request.url));

  if (!stravaConfigured()) {
    return NextResponse.redirect(new URL('/progresso?strava=not_configured', request.url));
  }

  try {
    const tokens = await exchangeCode({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      code,
    });

    const expiresAt = new Date(tokens.expires_at * 1000).toISOString();

    const { error: dbErr } = await supabase
      .from('strava_tokens')
      .upsert(
        {
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
          athlete_id: tokens.athlete?.id ?? 0,
          athlete_firstname: tokens.athlete?.firstname ?? null,
          athlete_lastname: tokens.athlete?.lastname ?? null,
        },
        { onConflict: 'user_id' }
      );

    if (dbErr) {
      console.error('strava upsert failed', dbErr);
      return NextResponse.redirect(new URL('/progresso?strava=db_error', request.url));
    }

    return NextResponse.redirect(new URL('/progresso?strava=connected', request.url));
  } catch (e) {
    console.error('strava callback error', e);
    return NextResponse.redirect(new URL('/progresso?strava=oauth_error', request.url));
  }
}
