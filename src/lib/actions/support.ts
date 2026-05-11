"use server";

import { MailService } from "@/lib/mail-service";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields" };
  }

  try {
    await MailService.sendContactForm(name, email, subject, message);
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
