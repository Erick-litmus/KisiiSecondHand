"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { login as setAuthSession, logout as clearAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendVerificationEmail } from "@/lib/email";

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function register(formData: any) {
  const { email, password, name, avatar } = formData;

  console.log("Registering user:", email);

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        console.log("User already exists and is verified:", email);
        return { error: "Email already in use" };
      }
      
      // User exists but is not verified - update and send new OTP
      console.log("User exists but is unverified, updating and sending new OTP:", email);
      const hashedPassword = await bcrypt.hash(password, 10);
      const otpCode = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          name: name || email.split("@")[0],
          avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split("@")[0])}&background=10b981&color=fff&size=256`,
          otpCode,
          otpExpiresAt,
        },
      });

      await sendVerificationEmail(email, otpCode);
      return { success: true, email };
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log("Creating user in database...");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split("@")[0])}&background=10b981&color=fff&size=256`,
        role: "USER",
        isVerified: false,
        otpCode,
        otpExpiresAt,
      },
    });

    console.log("User created with ID:", user.id);
    
    // Send verification email
    await sendVerificationEmail(email, otpCode);
    
    // Note: We don't set the auth session yet. They must verify first.
    return { success: true, email };
  } catch (err: any) {
    console.error("CRITICAL Registration error:", err);
    // Return more specific error for debugging
    return { error: err.message || "Something went wrong during registration" };
  }
}

export async function login(formData: any) {
  const { email, password } = formData;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Google OAuth users have no password – direct them to use Google sign-in
    if (!user.password) {
      return { error: "This account was created with Google. Please use 'Continue with Google' to sign in." };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    if (!user.isVerified) {
      // User is not verified, generate a new OTP and send it
      const otpCode = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      
      await prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpiresAt }
      });
      
      await sendVerificationEmail(email, otpCode);
      return { error: "Email not verified. A new verification code has been sent.", requiresVerification: true, email };
    }

    await setAuthSession({ id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar });

    return { success: true };
  } catch (err: any) {
    console.error("Login error:", err);
    return { error: err.message || "Something went wrong during login" };
  }
}

export async function clearSession() {
  await clearAuthSession();
  revalidatePath("/");
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export async function verifyOTP(formData: any) {
  const { email, code } = formData;

  if (!email || !code) {
    return { error: "Email and code are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.isVerified) {
      return { error: "User is already verified" };
    }

    if (user.otpCode !== code) {
      return { error: "Invalid verification code" };
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return { error: "Verification code has expired. Please log in to request a new one." };
    }

    // Verify user and clear OTP fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Log the user in
    await setAuthSession({ id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar });

    return { success: true };
  } catch (err: any) {
    console.error("Verification error:", err);
    return { error: err.message || "Something went wrong during verification" };
  }
}
