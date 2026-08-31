const trueValues = new Set(['true', '1', 'yes', 'on']);
const falseValues = new Set(['false', '0', 'no', 'off']);

export const protectedServerSecrets = [
  'SMTP_PASSWORD',
  'IMAP_PASSWORD',
  'SUPABASE_SECRET_KEY',
  'AI_API_KEY',
];

export const expectedYgrassilEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'AI_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'IMAP_HOST',
  'IMAP_PORT',
  'IMAP_SECURE',
  'IMAP_USER',
  'IMAP_PASSWORD',
  'ADMIN_TEST_EMAIL',
  'EMAIL_TEST_MODE',
  'OUTBOUND_ENABLED',
  'DAILY_SEND_LIMIT',
];

const value = (source, key, fallback = '') => {
  const raw = source[key];
  return typeof raw === 'string' && raw.trim() ? raw.trim() : fallback;
};

const bool = (source, key, fallback) => {
  const raw = value(source, key).toLowerCase();
  if (trueValues.has(raw)) return true;
  if (falseValues.has(raw)) return false;
  return fallback;
};

const number = (source, key, fallback) => {
  const parsed = Number(value(source, key, String(fallback)));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function loadYgrassilEnv(source = process.env) {
  const config = {
    supabaseUrl: value(source, 'NEXT_PUBLIC_SUPABASE_URL'),
    supabasePublishableKey: value(source, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    supabaseSecretKey: value(source, 'SUPABASE_SECRET_KEY'),
    aiProvider: value(source, 'AI_PROVIDER'),
    aiApiKey: value(source, 'AI_API_KEY'),
    smtpHost: value(source, 'SMTP_HOST', 'mail.spacemail.com'),
    smtpPort: number(source, 'SMTP_PORT', 465),
    smtpSecure: bool(source, 'SMTP_SECURE', true),
    smtpUser: value(source, 'SMTP_USER', 'studio@itbonsai.pl'),
    smtpPassword: value(source, 'SMTP_PASSWORD'),
    imapHost: value(source, 'IMAP_HOST', 'mail.spacemail.com'),
    imapPort: number(source, 'IMAP_PORT', 993),
    imapSecure: bool(source, 'IMAP_SECURE', true),
    imapUser: value(source, 'IMAP_USER', 'studio@itbonsai.pl'),
    imapPassword: value(source, 'IMAP_PASSWORD'),
    adminTestEmail: value(source, 'ADMIN_TEST_EMAIL'),
    emailTestMode: bool(source, 'EMAIL_TEST_MODE', true),
    outboundEnabled: bool(source, 'OUTBOUND_ENABLED', false),
    dailySendLimit: number(source, 'DAILY_SEND_LIMIT', 10),
  };

  const missing = expectedYgrassilEnv.filter((key) => {
    if (key === 'SMTP_HOST' || key === 'SMTP_PORT' || key === 'SMTP_SECURE' || key === 'SMTP_USER') return false;
    if (key === 'IMAP_HOST' || key === 'IMAP_PORT' || key === 'IMAP_SECURE' || key === 'IMAP_USER') return false;
    if (key === 'EMAIL_TEST_MODE' || key === 'OUTBOUND_ENABLED' || key === 'DAILY_SEND_LIMIT') return false;
    return !value(source, key);
  });

  return { config, missing };
}

export function getPublicSystemStatus(source = process.env) {
  const { config, missing } = loadYgrassilEnv(source);
  const databaseReady = Boolean(config.supabaseUrl && config.supabasePublishableKey && config.supabaseSecretKey);
  const aiReady = Boolean(config.aiApiKey);
  const smtpReady = Boolean(config.smtpHost && config.smtpUser && config.smtpPassword && config.adminTestEmail);
  const imapReady = Boolean(config.imapHost && config.imapUser && config.imapPassword);

  return {
    ok: true,
    services: {
      DATABASE: {
        status: databaseReady ? 'configured' : 'needs_configuration',
        detail: databaseReady ? 'Supabase env present' : 'Waiting for Supabase project keys',
      },
      AI: {
        status: aiReady ? 'configured' : 'needs_configuration',
        detail: aiReady ? 'Server API key present' : 'Waiting for AI provider key',
      },
      SMTP: {
        status: smtpReady ? 'configured' : 'needs_configuration',
        detail: smtpReady ? 'Ready for admin-only test' : 'Waiting for SMTP password and admin test email',
      },
      IMAP: {
        status: imapReady ? 'configured' : 'needs_configuration',
        detail: imapReady ? 'Ready for inbox test' : 'Waiting for IMAP password',
      },
      OUTBOUND: {
        status: config.outboundEnabled ? 'enabled' : 'locked',
        detail: config.outboundEnabled ? 'Real outbound can run only outside test mode' : 'Real prospect sending is locked',
      },
    },
    safety: {
      emailTestMode: config.emailTestMode,
      outboundEnabled: config.outboundEnabled,
      dailySendLimit: config.dailySendLimit,
      protectedServerSecrets,
    },
    missing,
  };
}
