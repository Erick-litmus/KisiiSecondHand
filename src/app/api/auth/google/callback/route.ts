import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { login as setAuthSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const dynamicAppUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || dynamicAppUrl;
  const cleanAppUrl = APP_URL.endsWith("/") ? APP_URL.slice(0, -1) : APP_URL;
  const REDIRECT_URI = `${cleanAppUrl}/api/auth/google/callback`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // callback URL encoded in state
  const error = searchParams.get("error");

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(`${APP_URL}/login?error=google_cancelled`);
  }

  try {
    console.log("📥 Google Callback Received!");
    // 1. Exchange authorization code for tokens
    console.log("🔄 Exchanging code for tokens...");
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("❌ Google token exchange failed:", errText);
      return NextResponse.redirect(`${APP_URL}/login?error=google_token_failed`);
    }

    const tokens = await tokenRes.json();
    const accessToken: string = tokens.access_token;
    console.log("✅ Tokens received!");

    // 2. Fetch Google user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("❌ Failed to fetch Google profile");
      return NextResponse.redirect(`${APP_URL}/login?error=google_profile_failed`);
    }

    const profile = await profileRes.json();
    const { id: googleId, email, name, picture } = profile;
    console.log(`👤 Logging in user: ${email}`);

    if (!email) {
      return NextResponse.redirect(`${APP_URL}/login?error=google_no_email`);
    }

    // 3. Upsert user in DB
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            isVerified: true,
            avatar: user.avatar || picture,
          },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split("@")[0])}&background=10b981&color=fff&size=256`,
          googleId,
          password: null,
          role: "USER",
          isVerified: true,
        },
      });
    }

    // 4. Set our custom JWT session
    await setAuthSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    // 5. Redirect to intended page or home
    const redirectTo = state ? decodeURIComponent(state) : "/";
    const finalUrl = `${APP_URL}${redirectTo}`;
    console.log(`🚀 Redirecting to: ${finalUrl}`);
    return NextResponse.redirect(finalUrl);
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${APP_URL}/login?error=google_server_error`);
  }
}
