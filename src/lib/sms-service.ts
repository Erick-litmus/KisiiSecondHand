/**
 * SMS Service for Kisii Market
 * Powered by Africa's Talking (Standard for Kenya)
 */

import { MailService } from "./mail-service";

export const SmsService = {
  /**
   * Send a verification code to a phone number.
   */
  sendVerificationCode: async (phone: string, code: string, userEmail?: string) => {
    const username = process.env.AT_USERNAME;
    const apiKey = process.env.AT_API_KEY;

    // Format phone number to international format (+254...)
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+254" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    console.log(`\n\n📱 [SMS OUTGOING] To: ${formattedPhone} | Code: ${code} 📱\n\n`);

    if (username && apiKey) {
      try {
        const isSandbox = username.toLowerCase() === "sandbox";
        const apiUrl = isSandbox 
          ? "https://api.sandbox.africastalking.com/version1/messaging"
          : "https://api.africastalking.com/version1/messaging";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apikey": apiKey,
          },
          body: new URLSearchParams({
            username: username,
            to: formattedPhone,
            message: `Your Kisii Market verification code is: ${code}. Valid for 10 minutes.`,
          }),
        });

        const result = await response.json();
        console.log("✅ SMS API Response:", result);
        return { success: true, method: "sms" };
      } catch (error) {
        console.error("❌ SMS API Error:", error);
      }
    } else {
      console.warn("⚠️ SMS service: AT_USERNAME or AT_API_KEY not configured. Falling back to email/console.");
    }

    // Fallback to Email if SMS fails or isn't configured
    if (userEmail) {
      await MailService.sendVerificationEmail(userEmail, code);
      return { success: true, method: "email_fallback" };
    }

    return { success: true, method: "console" };
  }
};
