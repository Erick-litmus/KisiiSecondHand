"use server";

export async function getGoogleAuthUrl(callbackPath: string = "/") {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!GOOGLE_CLIENT_ID) {
    return { error: "Google login is not configured. Please contact support." };
  }

  const REDIRECT_URI = `${APP_URL}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: encodeURIComponent(callbackPath),
  });

  return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
}
