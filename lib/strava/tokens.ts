import { createClient } from '@/lib/supabase/server';
import { refreshAccessToken } from './client';

export type StravaTokenRow = {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO
  athlete_id: number;
  athlete_firstname: string | null;
  athlete_lastname: string | null;
  connected_at: string;
  updated_at: string;
};

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

export function stravaConfigured(): boolean {
  return !!CLIENT_ID && !!CLIENT_SECRET;
}

export async function getStravaTokenForUser(userId: string): Promise<StravaTokenRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('strava_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return (data as StravaTokenRow | null) ?? null;
}

/**
 * Returns a fresh access token, refreshing it if expired.
 * Throws if Strava credentials aren't configured.
 */
export async function ensureFreshAccessToken(userId: string): Promise<StravaTokenRow | null> {
  if (!stravaConfigured()) throw new Error('strava_not_configured');
  const row = await getStravaTokenForUser(userId);
  if (!row) return null;

  const expiresAt = new Date(row.expires_at).getTime();
  const now = Date.now();
  // Refresh if less than 5 minutes remaining.
  if (expiresAt - now > 5 * 60 * 1000) return row;

  const refreshed = await refreshAccessToken({
    clientId: CLIENT_ID!,
    clientSecret: CLIENT_SECRET!,
    refreshToken: row.refresh_token,
  });

  const supabase = await createClient();
  const newExpiresAt = new Date(refreshed.expires_at * 1000).toISOString();
  const { data: updated } = await supabase
    .from('strava_tokens')
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: newExpiresAt,
    })
    .eq('user_id', userId)
    .select('*')
    .single();

  return (updated as StravaTokenRow) ?? row;
}

export async function deleteStravaToken(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('strava_tokens').delete().eq('user_id', userId);
}
