"use server";

import prisma from "@/lib/prisma";
import { MailService } from "@/lib/mail-service";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found to prevent email enumeration attacks
      return { success: true };
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const emailResult = await MailService.sendPasswordResetEmail(email, resetToken);

    if (emailResult.error) {
      return { error: "Failed to send reset email. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Check if expiry is greater than now
        },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "An unexpected error occurred" };
  }
}
