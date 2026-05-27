/**
 * Strava API client — server-side only.
 * Handles OAuth token exchange, refresh, and authed activity fetches.
 */

const STRAVA_OAUTH_BASE = 'https://www.strava.com/oauth';
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export type StravaTokenResponse = {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  expires_in: number;
  athlete?: {
    id: number;
    firstname?: string;
    lastname?: string;
    username?: string;
  };
};

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type?: string;
  start_date: string; // ISO
  start_date_local: string; // ISO without TZ
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  total_elevation_gain: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_speed?: number; // m/s
  max_speed?: number;
  has_heartrate?: boolean;
};

export function getAuthUrl({
  clientId,
  redirectUri,
  scope = 'read,activity:read,activity:read_all',
  state,
}: {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope,
  });
  if (state) params.set('state', state);
  return `${STRAVA_OAUTH_BASE}/authorize?${params.toString()}`;
}

/** Exchange authorization code for tokens. */
export async function exchangeCode({
  clientId,
  clientSecret,
  code,
}: {
  clientId: string;
  clientSecret: string;
  code: string;
}): Promise<StravaTokenResponse> {
  const res = await fetch(`${STRAVA_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) {
    throw new Error(`strava code exchange failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as StravaTokenResponse;
}

/** Refresh an expired access token. */
export async function refreshAccessToken({
  clientId,
  clientSecret,
  refreshToken,
}: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<StravaTokenResponse> {
  const res = await fetch(`${STRAVA_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) {
    throw new Error(`strava token refresh failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as StravaTokenResponse;
}

/** Fetch athlete activities. `after` is a unix timestamp. */
export async function listActivities({
  accessToken,
  after,
  perPage = 30,
  page = 1,
}: {
  accessToken: string;
  after?: number;
  perPage?: number;
  page?: number;
}): Promise<StravaActivity[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    page: String(page),
  });
  if (after) params.set('after', String(after));

  const res = await fetch(`${STRAVA_API_BASE}/athlete/activities?${params.toString()}`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`strava list activities failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as StravaActivity[];
}

/** Pace in seconds per km from average speed (m/s). */
export function paceFromSpeed(metersPerSecond: number): number | null {
  if (!metersPerSecond || metersPerSecond <= 0) return null;
  return Math.round(1000 / metersPerSecond);
}

/** Map Strava activity type → Luci workout type. Returns null for ignored types. */
export function mapStravaType(type: string, sportType?: string): 'run' | 'long' | 'swim' | 'strength' | 'rest' | null {
  const t = (sportType ?? type ?? '').toLowerCase();
  if (t === 'run' || t === 'trailrun' || t === 'trail run' || t === 'virtualrun' || t === 'virtual run')
    return 'run';
  if (t === 'swim') return 'swim';
  if (t === 'weighttraining' || t === 'weight training' || t === 'workout' || t === 'crossfit')
    return 'strength';
  if (t === 'walk' || t === 'hike') return 'run'; // logged as easy/recovery
  return null;
}
