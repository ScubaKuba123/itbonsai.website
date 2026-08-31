import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {getPublicSystemStatus} from './api/_ygrassil/env.js';
import {sendSmtpConnectionTest} from './api/_ygrassil/email.js';
import {testImapConnection} from './api/_ygrassil/imap.js';

const json = (res: import('node:http').ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
};

const ygrassilApi = () => ({
  name: 'ygrassil-local-api',
  configureServer(server: import('vite').ViteDevServer) {
    server.middlewares.use('/api/ygrassil/status', (req, res) => {
      if (req.method !== 'GET') return json(res, 405, {ok: false, error: 'Method not allowed'});
      return json(res, 200, getPublicSystemStatus());
    });
    server.middlewares.use('/api/ygrassil/test-smtp', async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, {ok: false, error: 'Method not allowed'});
      try { return json(res, 200, await sendSmtpConnectionTest()); }
      catch (error) { return json(res, (error as {statusCode?: number}).statusCode || 500, {ok: false, error: error instanceof Error ? error.message : 'SMTP test failed.'}); }
    });
    server.middlewares.use('/api/ygrassil/test-imap', async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, {ok: false, error: 'Method not allowed'});
      try { return json(res, 200, await testImapConnection()); }
      catch (error) { return json(res, (error as {statusCode?: number}).statusCode || 500, {ok: false, error: error instanceof Error ? error.message : 'IMAP test failed.'}); }
    });
  },
});

export default defineConfig({
  plugins:[react(), ygrassilApi()],
  build:{rollupOptions:{input:{main:fileURLToPath(new URL('index.html',import.meta.url)),garden:fileURLToPath(new URL('garden.html',import.meta.url)),prototype:fileURLToPath(new URL('prototype.html',import.meta.url))}}},
});
