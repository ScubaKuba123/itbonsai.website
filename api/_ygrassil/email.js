import nodemailer from 'nodemailer';
import { loadYgrassilEnv } from './env.js';

export function resolveOutboundRecipient(prospectEmail, source = process.env) {
  const { config } = loadYgrassilEnv(source);
  if (config.emailTestMode) {
    if (!config.adminTestEmail) {
      const error = new Error('ADMIN_TEST_EMAIL is required while EMAIL_TEST_MODE=true.');
      error.statusCode = 503;
      throw error;
    }
    return { to: config.adminTestEmail, redirectedToAdmin: true, realProspectSend: false };
  }
  if (!config.outboundEnabled) {
    const error = new Error('Real prospect sending is locked because OUTBOUND_ENABLED=false.');
    error.statusCode = 423;
    throw error;
  }
  if (!prospectEmail) {
    const error = new Error('Missing prospect recipient.');
    error.statusCode = 400;
    throw error;
  }
  return { to: prospectEmail, redirectedToAdmin: false, realProspectSend: true };
}

export function createSmtpTransport(source = process.env) {
  const { config } = loadYgrassilEnv(source);
  if (!config.smtpPassword) {
    const error = new Error('SMTP_PASSWORD is required.');
    error.statusCode = 503;
    throw error;
  }
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });
}

export async function sendSmtpConnectionTest(source = process.env) {
  const { config } = loadYgrassilEnv(source);
  if (!config.adminTestEmail) {
    const error = new Error('ADMIN_TEST_EMAIL is required for SMTP tests.');
    error.statusCode = 503;
    throw error;
  }
  const transporter = createSmtpTransport(source);
  await transporter.verify();
  const info = await transporter.sendMail({
    from: `"Ygrassil Test" <${config.smtpUser}>`,
    to: config.adminTestEmail,
    subject: 'Ygrassil SMTP test',
    text: 'Ygrassil SMTP test message. This was sent only to ADMIN_TEST_EMAIL.',
  });
  return { ok: true, messageId: info.messageId, to: 'ADMIN_TEST_EMAIL' };
}
