import nodemailer from "nodemailer";

let transporterInstance: any = null;

export function getTransporter() {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporterInstance;
}

export const transporter = {
  sendMail: (options: any) => getTransporter().sendMail(options)
};
