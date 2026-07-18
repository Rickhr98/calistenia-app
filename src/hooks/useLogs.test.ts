import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const orderMock = vi.fn();
const eqSelectMock: any = vi.fn(() => ({ order: orderMock }));
const selectMock: any = vi.fn(() => ({ eq: eqSelectMock }));
const insertMock: any = vi.fn().mockResolvedValue({ error: null });
const eqDeleteMock: any = vi.fn().mockResolvedValue({ error: null });
const deleteMock: any = vi.fn(() => ({ eq: eqDeleteMock }));
const fromMock: any = vi.fn(() => ({ select: selectMock, insert: insertMock, delete: deleteMock }));

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: (...args: any[]) => fromMock(...args) },
}));

import { useLogs } from './useLogs';

describe('useLogs', () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqSelectMock.mockClear();
    orderMock.mockReset().mockResolvedValue({ data: [] });
    insertMock.mockClear().mockResolvedValue({ error: null });
    deleteMock.mockClear();
    eqDeleteMock.mockClear().mockResolvedValue({ error: null });
  });

  it('returns an empty list with no user', async () => {
    const { result } = renderHook(() => useLogs(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toEqual([]);
  });

  it('loads logs for a user ordered by created_at', async () => {
    orderMock.mockResolvedValue({ data: [{ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 30 }] });
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toEqual([{ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 30 }]);
  });

  it('addLog inserts a row scoped to the user and refreshes', async () => {
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.addLog({ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 40 });
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ ex_id: 'ctw', value: 40, user_id: 'user-1' })
    );
  });

  it('wipe deletes all rows for the user', async () => {
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.wipe();
    });
    expect(deleteMock).toHaveBeenCalled();
    expect(eqDeleteMock).toHaveBeenCalledWith('user_id', 'user-1');
  });
});
