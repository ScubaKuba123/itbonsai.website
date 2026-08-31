import { testImapConnection } from '../_ygrassil/imap.js';
import { methodGuard, sendJson } from '../_ygrassil/http.js';

export default async function handler(req, res) {
  if (methodGuard(req, res, ['POST'])) return;
  try {
    sendJson(res, 200, await testImapConnection());
  } catch (error) {
    sendJson(res, error.statusCode || 500, { ok: false, error: error.message || 'IMAP test failed.' });
  }
}
