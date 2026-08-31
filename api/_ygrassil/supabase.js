import { createClient } from '@supabase/supabase-js';
import { loadYgrassilEnv } from './env.js';

export function createSupabaseAdminClient(source = process.env) {
  const { config } = loadYgrassilEnv(source);
  if (!config.supabaseUrl || !config.supabaseSecretKey) {
    const error = new Error('Supabase URL and secret key are required.');
    error.statusCode = 503;
    throw error;
  }
  return createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
