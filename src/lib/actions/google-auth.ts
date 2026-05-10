"use server";

import { headers } from "next/headers";

export async function getGoogleAuthUrl(callbackPath: string = "/") {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  // Prioritize the dynamic host to ensure the redirect_uri always matches the current environment
  const APP_URL = dynamicAppUrl;

  if (!GOOGLE_CLIENT_ID) {
    return { error: "Google login is not configured. Please contact support." };
  }

  // Normalize APP_URL to remove trailing slash if it exists
  const cleanAppUrl = APP_URL.endsWith("/") ? APP_URL.slice(0, -1) : APP_URL;
  const REDIRECT_URI = `${cleanAppUrl}/api/auth/google/callback`;
  
  if (process.env.NODE_ENV !== "production") {
    console.log(`🌐 Google Auth Redirect URI: ${REDIRECT_URI}`);
  }

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
