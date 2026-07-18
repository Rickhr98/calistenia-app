import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const maybeSingleMock = vi.fn();
const upsertMock: any = vi.fn().mockResolvedValue({ error: null });
const eqMock: any = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock: any = vi.fn(() => ({ eq: eqMock }));
const fromMock: any = vi.fn(() => ({ select: selectMock, upsert: upsertMock }));

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: (...args: any[]) => fromMock(...args) },
}));

import { useSettings } from './useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    upsertMock.mockClear();
    maybeSingleMock.mockReset().mockResolvedValue({ data: null });
  });

  it('defaults to floor-only equipment with no user', async () => {
    const { result } = renderHook(() => useSettings(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.equipSet).toEqual(['floor']);
    expect(result.current.quickMode).toBe(false);
  });

  it('loads existing settings for a user', async () => {
    maybeSingleMock.mockResolvedValue({ data: { equip_set: ['floor', 'wall'], quick_mode: true } });
    const { result } = renderHook(() => useSettings('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.equipSet).toEqual(['floor', 'wall']);
    expect(result.current.quickMode).toBe(true);
  });

  it('setEquipSet updates state and upserts', async () => {
    const { result } = renderHook(() => useSettings('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.setEquipSet(['floor', 'pullbar']);
    });
    expect(result.current.equipSet).toEqual(['floor', 'pullbar']);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', equip_set: ['floor', 'pullbar'] })
    );
  });
});
