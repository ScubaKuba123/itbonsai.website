import { createSmtpTransport, resolveOutboundRecipient } from '../_ygrassil/email.js';
import { loadYgrassilEnv } from '../_ygrassil/env.js';
import { methodGuard, readJson, sendJson } from '../_ygrassil/http.js';

export default async function handler(req, res) {
  if (methodGuard(req, res, ['POST'])) return;
  try {
    const body = await readJson(req);
    const prospectEmail = typeof body.prospectEmail === 'string' ? body.prospectEmail.trim() : '';
    const subject = typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim().slice(0, 180) : 'Ygrassil test draft';
    const text = typeof body.text === 'string' && body.text.trim() ? body.text.trim().slice(0, 40000) : '';

    if (!text) {
      sendJson(res, 400, { ok: false, error: 'Missing email draft text.' });
      return;
    }

    const { config } = loadYgrassilEnv();
    const recipient = resolveOutboundRecipient(prospectEmail);
    const transporter = createSmtpTransport();
    const info = await transporter.sendMail({
      from: `"Ygrassil" <${config.smtpUser}>`,
      to: recipient.to,
      subject,
      text,
    });

    sendJson(res, 200, {
      ok: true,
      messageId: info.messageId,
      deliveredTo: recipient.redirectedToAdmin ? 'ADMIN_TEST_EMAIL' : 'prospect',
      realProspectSend: recipient.realProspectSend,
    });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { ok: false, error: error.message || 'Send test failed.' });
  }
}
