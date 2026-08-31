import assert from 'node:assert/strict';
import test from 'node:test';
import { getPublicSystemStatus, protectedServerSecrets } from '../api/_ygrassil/env.js';
import { resolveOutboundRecipient } from '../api/_ygrassil/email.js';

test('public status never exposes secret values', () => {
  const status = getPublicSystemStatus({
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public',
    SUPABASE_SECRET_KEY: 'sb_secret_private',
    AI_API_KEY: 'ai-secret',
    SMTP_PASSWORD: 'smtp-secret',
    IMAP_PASSWORD: 'imap-secret',
    ADMIN_TEST_EMAIL: 'admin@example.com',
  });

  const serialized = JSON.stringify(status);
  for (const secret of ['sb_secret_private', 'ai-secret', 'smtp-secret', 'imap-secret']) {
    assert.equal(serialized.includes(secret), false);
  }
  assert.deepEqual(status.safety.protectedServerSecrets, protectedServerSecrets);
});

test('test mode redirects prospect email to admin only', () => {
  const recipient = resolveOutboundRecipient('lead@example.com', {
    EMAIL_TEST_MODE: 'true',
    OUTBOUND_ENABLED: 'false',
    ADMIN_TEST_EMAIL: 'admin@example.com',
  });

  assert.equal(recipient.to, 'admin@example.com');
  assert.equal(recipient.redirectedToAdmin, true);
  assert.equal(recipient.realProspectSend, false);
});

test('real prospect sending is refused when outbound is locked outside test mode', () => {
  assert.throws(
    () => resolveOutboundRecipient('lead@example.com', {
      EMAIL_TEST_MODE: 'false',
      OUTBOUND_ENABLED: 'false',
      ADMIN_TEST_EMAIL: 'admin@example.com',
    }),
    /OUTBOUND_ENABLED=false/,
  );
});

test('real prospect sending is explicit when outbound is enabled and test mode is off', () => {
  const recipient = resolveOutboundRecipient('lead@example.com', {
    EMAIL_TEST_MODE: 'false',
    OUTBOUND_ENABLED: 'true',
    ADMIN_TEST_EMAIL: 'admin@example.com',
  });

  assert.equal(recipient.to, 'lead@example.com');
  assert.equal(recipient.realProspectSend, true);
});
