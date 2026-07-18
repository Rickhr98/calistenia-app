import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signInWithOtpMock = vi.fn();
const signOutMock = vi.fn();

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
      signInWithOtp: (...args: unknown[]) => signInWithOtpMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
    },
  },
}));

import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    getSessionMock.mockReset().mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockReset().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    signInWithOtpMock.mockReset().mockResolvedValue({ error: null });
    signOutMock.mockReset().mockResolvedValue({ error: null });
  });

  it('starts loading and resolves to no session', async () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it('signInWithEmail calls signInWithOtp and returns no error on success', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    let response: { error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signInWithEmail('me@example.com');
    });
    expect(signInWithOtpMock).toHaveBeenCalledWith(expect.objectContaining({ email: 'me@example.com' }));
    expect(response?.error).toBeNull();
  });

  it('signInWithEmail surfaces the error message on failure', async () => {
    signInWithOtpMock.mockResolvedValue({ error: { message: 'boom' } });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    let response: { error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signInWithEmail('me@example.com');
    });
    expect(response?.error).toBe('boom');
  });
});
