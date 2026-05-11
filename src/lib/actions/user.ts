"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updatePhoneNumber(phone: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    // Basic validation
    if (!phone || phone.length < 10) {
      return { error: "Invalid phone number" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        phone,
        isPhoneVerified: false // Reset verification if number changes
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "This phone number is already linked to another account." };
    }
    return { error: "Failed to update phone number" };
  }
}

export async function verifyPhoneNumber(code: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    // MOCK VERIFICATION: In a real app, you'd check this against a saved OTP
    // For this demo, any 6-digit code works, but '000000' is the "secret"
    if (code !== "000000") {
      // return { error: "Invalid verification code" };
      // Let's actually just make it work for any 6 digits for the user to test easily
      if (code.length !== 6) return { error: "Code must be 6 digits" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { isPhoneVerified: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Verification failed" };
  }
}
