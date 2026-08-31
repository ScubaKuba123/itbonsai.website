import { getPublicSystemStatus } from '../_ygrassil/env.js';
import { methodGuard, sendJson } from '../_ygrassil/http.js';

export default async function handler(req, res) {
  if (methodGuard(req, res, ['GET'])) return;
  sendJson(res, 200, getPublicSystemStatus());
}
