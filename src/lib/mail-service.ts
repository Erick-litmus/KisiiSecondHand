import nodemailer from "nodemailer";
import { Resend } from "resend";

/**
 * Unified Mail Service for Kisii Market
 * Handles: Verification OTP, Password Resets, Chat Notifications, and Contact Messages.
 * Uses Resend for production deliverability, falls back to Gmail SMTP.
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const getTransporter = () => {
  if (resend) return null; // Use Resend instead

  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").replace(/\s/g, '');

  if (!smtpUser || !smtpPass) {
    console.warn("📨 Mail service: SMTP_USER or SMTP_PASS not configured. Emails will be logged to console.");
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"; // Default Resend test email
const FROM_NAME = "Kisii Market";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const BRAND_COLOR = "#10b981"; // Emerald 500

/**
 * Common HTML Wrapper for consistent branding
 */
const htmlWrapper = (content: string, title: string) => `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 24px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 64px; height: 64px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #0d9488 100%); border-radius: 18px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);">
        <span style="color: white; font-weight: 900; font-size: 28px; font-style: italic; line-height: 64px; display: block; text-align: center; width: 100%;">K</span>
      </div>
      <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Kisii Market</h1>
      <p style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">${title}</p>
    </div>
    
    <div style="background-color: white; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f1f5f9;">
      ${content}
    </div>
    
    <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
      <p>© ${new Date().getFullYear()} Kisii Secondhand Marketplace. All rights reserved.</p>
      <p style="margin-top: 8px;">Safe • Simple • Local</p>
      <p style="margin-top: 16px; font-weight: 400; text-transform: none; color: #cbd5e1;">
        Kisii University Main Campus, Kisii, Kenya<br/>
        This is a transactional email sent to your registered account.
      </p>
    </div>
  </div>
`;

export const MailService = {
  /**
   * Send a 6-digit verification code
   */
  sendVerificationEmail: async (email: string, code: string) => {
    const html = htmlWrapper(`
      <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 800; text-align: center;">Welcome to the Marketplace!</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 32px; text-align: center;">
        Your security is our priority. Please use the verification code below to confirm your identity and secure your Kisii Market account.
      </p>
      
      <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <span style="font-family: monospace; font-size: 42px; font-weight: 900; color: ${BRAND_COLOR}; letter-spacing: 8px; display: block;">${code}</span>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0; text-align: center;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    `, "Identity Verification");

    // Try Resend first if configured
    if (resend) {
      try {
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: `Your Verification Code: ${code}`,
          html,
        });
        return { success: true };
      } catch (err: any) {
        console.error("❌ Resend Error:", err);
        // Fallback will happen below
      }
    }

    // Fallback to Gmail SMTP
    const transporter = getTransporter();
    if (!transporter) {
      console.log(`\n\n🔑 [VERIFICATION CODE FOR ${email}]: ${code} 🔑\n\n`);
      return { success: true, message: "Logged to console" };
    }

    try {
      await transporter.sendMail({
        from: `"${FROM_NAME}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Your Verification Code: ${code}`,
        text: `Welcome to Kisii Market! Your verification code is: ${code}`,
        html,
        headers: {
          'X-Entity-Ref-ID': Date.now().toString(),
          'X-Priority': '1 (Highest)',
        }
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Gmail Fallback):", error);
      console.log(`\n\n🔑 [VERIFICATION CODE FOR ${email}]: ${code} 🔑\n\n`);
      return { error: error.message };
    }
  },

  /**
   * Send password reset link
   */
  sendPasswordResetEmail: async (email: string, token: string) => {
    const transporter = getTransporter();
    if (!transporter) return { error: "SMTP not configured" };

    const resetLink = `${BASE_URL}/reset-password?token=${token}`;
    const html = htmlWrapper(`
      <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 800; text-align: center;">Reset Your Password</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 32px; text-align: center;">
        We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.
      </p>
      
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${resetLink}" style="display: inline-block; background-color: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 18px 36px; border-radius: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);">Reset Password</a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0; text-align: center;">
        If you didn't request this, your password will remain unchanged.
      </p>
    `, "Account Recovery");

    try {
      await transporter.sendMail({
        from: `"Kisii Market" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Request - Kisii Market",
        html,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Password Reset):", error);
      return { error: error.message };
    }
  },

  /**
   * Send notification for a new message
   */
  sendNewMessageNotification: async (toEmail: string, fromName: string, messagePreview: string, conversationId: string) => {
    const transporter = getTransporter();
    if (!transporter) return { success: true };

    const chatLink = `${BASE_URL}/messages/${conversationId}`;
    const html = htmlWrapper(`
      <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 800;">New Message from ${fromName}</h2>
      
      <div style="background-color: #f8fafc; border-left: 4px solid ${BRAND_COLOR}; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
        <p style="color: #334155; font-size: 16px; font-style: italic; margin: 0;">"${messagePreview}"</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 16px;">
        <a href="${chatLink}" style="display: inline-block; background-color: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Reply in Chat</a>
      </div>
    `, "Chat Notification");

    try {
      await transporter.sendMail({
        from: `"Kisii Market Notifications" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `New message from ${fromName} on Kisii Market`,
        html,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Chat):", error);
      return { error: error.message };
    }
  },

  /**
   * Send notification for product approval/rejection
   */
  sendProductStatusEmail: async (toEmail: string, productName: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    const transporter = getTransporter();
    if (!transporter) return { success: true };

    const isApproved = status === "APPROVED";
    const title = isApproved ? "Listing Approved" : "Listing Update";
    const dashboardLink = `${BASE_URL}/dashboard`;

    const html = htmlWrapper(`
      <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 800; text-align: center;">
        ${isApproved ? "Great news!" : "Update on your listing"}
      </h2>
      <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 24px; text-align: center;">
        Your product <strong style="color: #0f172a;">"${productName}"</strong> has been <span style="color: ${isApproved ? BRAND_COLOR : "#ef4444"}; font-weight: 800;">${status.toLowerCase()}</span> by our moderation team.
      </p>
      
      ${!isApproved && reason ? `
        <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.1em;">Reason for rejection</p>
          <p style="margin: 0; font-size: 15px; color: #991b1b; font-weight: 600;">${reason}</p>
        </div>
      ` : `
        <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin-bottom: 32px; text-align: center;">
          <p style="margin: 0; font-size: 15px; color: #166534; font-weight: 600;">Your item is now live and visible to all students!</p>
        </div>
      `}
      
      <div style="text-align: center;">
        <a href="${dashboardLink}" style="display: inline-block; background-color: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Go to Dashboard</a>
      </div>
    `, title);

    try {
      await transporter.sendMail({
        from: `"Kisii Market" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `${isApproved ? "✅ Approved" : "❌ Rejected"}: ${productName}`,
        html,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Product Status):", error);
      return { error: error.message };
    }
  },

  /**
   * Notify admin of a new product submission
   */
  sendAdminNewProductNotification: async (productName: string, sellerName: string, productId: string) => {
    const transporter = getTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (!transporter || !adminEmail) return { success: true };

    const adminLink = `${BASE_URL}/admin`;
    const html = htmlWrapper(`
      <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 800;">New Listing for Review</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        A new product has been submitted and is waiting for your approval.
      </p>
      
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
        <div style="margin-bottom: 16px;">
          <p style="margin: 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Product</p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #0f172a;">${productName}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Seller</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #334155;">${sellerName}</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${adminLink}" style="display: inline-block; background-color: #0f172a; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Review in Admin Panel</a>
      </div>
    `, "Moderation Alert");

    try {
      await transporter.sendMail({
        from: `"System Alert" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `[Moderation Required] ${productName} by ${sellerName}`,
        html,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Admin Notification):", error);
      return { error: error.message };
    }
  },

  /**
   * Send contact form submission to admin
   */
  sendContactForm: async (senderName: string, senderEmail: string, subject: string, message: string) => {
    const transporter = getTransporter();
    if (!transporter) return { error: "SMTP not configured" };

    const html = htmlWrapper(`
      <div style="margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; font-weight: 800; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 0.1em;">Sender Details</p>
        <h2 style="margin: 4px 0; font-size: 20px; font-weight: 800; color: #0f172a;">${senderName}</h2>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #64748b;">${senderEmail}</p>
      </div>
      
      <div style="margin-bottom: 32px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Subject</p>
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b;">${subject}</p>
      </div>

      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Message Body</p>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
      </div>
    `, "Inquiry Received");

    try {
      await transporter.sendMail({
        from: `"${senderName} via Kisii Market" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        replyTo: senderEmail,
        subject: `[Contact] ${subject}: ${senderName}`,
        html,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ MailService Error (Contact):", error);
      return { error: error.message };
    }
  }
};
