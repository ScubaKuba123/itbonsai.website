export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

export function sendJson(res, status, body) {
  res.status(status).json(body);
}

export function methodGuard(req, res, methods) {
  if (methods.includes(req.method)) return false;
  sendJson(res, 405, { ok: false, error: 'Method not allowed' });
  return true;
}
