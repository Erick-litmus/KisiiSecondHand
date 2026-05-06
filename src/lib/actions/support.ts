"use server";

import nodemailer from "nodemailer";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name} via Kisii Market" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact] ${subject}: ${name}`,
      text: `New message from ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #059669; padding: 24px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">New Contact Message</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff; color: #1e293b;">
            <div style="margin-bottom: 24px;">
              <p style="margin: 0; font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.1em;">Sender Details</p>
              <h2 style="margin: 4px 0; font-size: 20px; font-weight: 800; color: #0f172a;">${name}</h2>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #64748b;">${email}</p>
            </div>
            
            <div style="margin-bottom: 32px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Message Subject</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b;">${subject}</p>
            </div>

            <div style="margin-bottom: 32px;">
              <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Message Body</p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
            
            <p style="margin: 0; font-size: 14px; color: #94a3b8; text-align: center;">
              You can reply directly to this email to contact the sender.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
