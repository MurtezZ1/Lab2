import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export function isEmailConfigured() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPassword && env.smtpFrom);
}

function transporter() {
  if (!isEmailConfigured()) return null;
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },
  });
}

export async function sendEmail({ to, subject, text, html }) {
  const transport = transporter();
  if (!transport) {
    return { sent: false, skipped: true, reason: "SMTP is not configured." };
  }

  await transport.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
  });

  return { sent: true, skipped: false };
}

export function frontendUrl(path) {
  return `${env.clientUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
