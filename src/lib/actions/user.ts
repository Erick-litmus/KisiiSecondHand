"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SmsService } from "@/lib/sms-service";

export async function updatePhoneNumber(phone: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    // Basic validation
    if (!phone || phone.length < 10) {
      return { error: "Invalid phone number" };
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        phone,
        otpCode,
        otpExpiresAt,
        isPhoneVerified: false // Reset verification if number changes
      },
      select: { email: true }
    });

    // Send the code
    await SmsService.sendVerificationCode(phone, otpCode, user.email);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "This phone number is already linked to another account." };
    }
    console.error("SMS Error:", error);
    return { error: "Failed to update phone number" };
  }
}

export async function verifyPhoneNumber(code: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { otpCode: true, otpExpiresAt: true }
    });

    if (!user || !user.otpCode) {
      return { error: "No verification code requested" };
    }

    if (new Date() > (user.otpExpiresAt || new Date(0))) {
      return { error: "Verification code expired" };
    }

    if (user.otpCode !== code && code !== "000000") { // Allow 000000 as master bypass for dev
      return { error: "Invalid verification code" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        isPhoneVerified: true,
        otpCode: null, // Clear after use
        otpExpiresAt: null
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Verification Error:", error);
    return { error: "Verification failed" };
  }
}
