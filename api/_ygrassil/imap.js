import { ImapFlow } from 'imapflow';
import { loadYgrassilEnv } from './env.js';

export async function testImapConnection(source = process.env) {
  const { config } = loadYgrassilEnv(source);
  if (!config.imapPassword) {
    const error = new Error('IMAP_PASSWORD is required.');
    error.statusCode = 503;
    throw error;
  }

  const client = new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: {
      user: config.imapUser,
      pass: config.imapPassword,
    },
    logger: false,
  });

  try {
    await client.connect();
    const mailbox = await client.mailboxOpen('INBOX', { readOnly: true });
    return { ok: true, mailbox: 'INBOX', exists: mailbox.exists };
  } finally {
    await client.logout().catch(() => undefined);
  }
}
