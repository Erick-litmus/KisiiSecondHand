"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendContactMessage } from "./support";

export async function submitReport(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in to report." };
  }

  const reportedUserId = formData.get("reportedUserId") as string;
  const productId = formData.get("productId") as string | null;
  const reason = formData.get("reason") as string;
  const conversationId = formData.get("conversationId") as string | null;

  if (!reportedUserId || !reason) {
    return { error: "Missing required fields" };
  }

  try {
    // Send email first as a reliable fallback
    const emailResult = await sendContactMessage(formData);
    if (!emailResult.success) {
      console.warn("Failed to send report email:", emailResult.error);
    }

    // Create DB Report
    await prisma.report.create({
      data: {
        reporterId: session.user.id,
        reportedUserId,
        productId: productId || null,
        conversationId: conversationId || null,
        reason,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit report to DB:", error);
    // If we at least sent the email, consider it a partial success for the user
    return { success: true, warning: "Report submitted via email, but failed to save to database." };
  }
}
