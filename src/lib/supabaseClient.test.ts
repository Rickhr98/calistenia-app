import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createClientMock = vi.fn(() => ({ mocked: true }));
vi.mock('@supabase/supabase-js', () => ({ createClient: createClientMock }));

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
  });

  afterEach(() => vi.unstubAllEnvs());

  it('creates the client with the configured env vars', async () => {
    const { supabase } = await import('./supabaseClient');
    expect(createClientMock).toHaveBeenCalledWith('https://example.supabase.co', 'anon-key');
    expect(supabase).toEqual({ mocked: true });
  });
});
