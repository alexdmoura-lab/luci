import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUrl } from '@/lib/strava/client';
import { stravaConfigured } from '@/lib/strava/tokens';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', request.url));

  if (!stravaConfigured()) {
    return NextResponse.redirect(
      new URL('/progresso?strava=not_configured', request.url)
    );
  }

  const origin = new URL(request.url).origin;
  const authUrl = getAuthUrl({
    clientId: process.env.STRAVA_CLIENT_ID!,
    redirectUri: `${origin}/api/strava/callback`,
    scope: 'read,activity:read,activity:read_all',
    state: user.id,
  });

  return NextResponse.redirect(authUrl);
}
