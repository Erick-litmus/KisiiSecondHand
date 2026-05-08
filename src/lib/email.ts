import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Fallback transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: (process.env.SMTP_USER || "").trim(),
    pass: (process.env.SMTP_PASS || "").replace(/\s/g, ''),
  },
});

export async function sendVerificationEmail(email: string, otpCode: string) {
  const isResendConfigured = !!resend;
  const isGmailConfigured = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

  if (!isResendConfigured && !isGmailConfigured) {
    console.log("📨 No email service configured. Logging OTP to terminal.");
    console.log(`\n\n🔑 [VERIFICATION CODE FOR ${email}]: ${otpCode} 🔑\n\n`);
    return { success: true, message: "Logged to console" };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);">
          <span style="color: white; font-weight: 900; font-size: 24px; font-style: italic;">K</span>
        </div>
        <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Kisii Market</h1>
      </div>
      
      <div style="background-color: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 24px; font-size: 20px; font-weight: 800;">Verify your email address</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
          Thanks for joining Kisii Market! Please use the following 6-digit code to verify your university email address. This code will expire in 15 minutes.
        </p>
        
        <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #10b981;">${otpCode}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        <p>© ${new Date().getFullYear()} Kisii Market. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      console.log("📨 Sending email via Resend SDK...");
      const { data, error } = await resend.emails.send({
        from: 'Kisii Market <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your email - Kisii Market',
        html: htmlContent,
      });

      if (error) {
        console.error("Resend Error:", error);
        
        // Check if it's the "testing emails" restriction error
        if (error.name === 'validation_error' && error.message.includes('testing emails')) {
          console.log("\n\n⚠️  RESEND SANDBOX MODE: Recipient is not your own email.");
          console.log(`🔑 [VERIFICATION CODE FOR ${email}]: ${otpCode} 🔑`);
          console.log("Check your terminal for the code since this is a test recipient.\n\n");
          return { success: true, message: "Logged to console due to Resend sandbox" };
        }
        
        throw new Error(error.message);
      }
      
      console.log("Resend Success:", data);
      return { success: true };
    } else {
      console.log("📨 Sending email via Gmail SMTP...");
      await transporter.sendMail({
        from: `"Kisii Market" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your email - Kisii Market",
        html: htmlContent,
      });
      return { success: true };
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { error: error.message };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  // Simple check for config
  if (!resend && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    return { error: "Email service is not configured" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);">
          <span style="color: white; font-weight: 900; font-size: 24px; font-style: italic;">K</span>
        </div>
        <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Kisii Market</h1>
      </div>
      
      <div style="background-color: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 24px; font-size: 20px; font-weight: 800;">Reset Your Password</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
          We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetLink}" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Reset Password</a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        <p>© ${new Date().getFullYear()} Kisii Market. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: 'Kisii Market <onboarding@resend.dev>',
        to: [email],
        subject: 'Password Reset Request - Kisii Market',
        html: htmlContent,
      });
      return { success: true };
    } else {
      await transporter.sendMail({
        from: `"Kisii Market" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Request - Kisii Market",
        html: htmlContent,
      });
      return { success: true };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}
