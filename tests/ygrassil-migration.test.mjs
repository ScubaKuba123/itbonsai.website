import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { URL } from 'node:url';

const sql = readFileSync(new URL('../supabase/migrations/20260831135000_ygrassil_core.sql', import.meta.url), 'utf8');

const tables = [
  'campaigns',
  'leads',
  'lead_contacts',
  'website_audits',
  'business_research',
  'opportunities',
  'proposals',
  'email_drafts',
  'email_messages',
  'email_threads',
  'reply_classifications',
  'followups',
  'suppression_list',
  'activity_log',
  'sending_events',
  'system_settings',
];

test('migration creates every required Ygrassil table', () => {
  for (const table of tables) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}\\b`, 'i'));
  }
});

test('migration enables RLS on every protected Ygrassil table', () => {
  for (const table of tables) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
});

test('migration does not grant anonymous read policies', () => {
  assert.equal(/\bto\s+anon\b/i.test(sql), false);
});
