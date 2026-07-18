import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { EquipmentId } from '../data/types';

export interface UseSettingsResult {
  equipSet: EquipmentId[];
  quickMode: boolean;
  loading: boolean;
  setEquipSet: (next: EquipmentId[]) => Promise<void>;
  setQuickMode: (next: boolean) => Promise<void>;
}

const DEFAULT_EQUIP: EquipmentId[] = ['floor'];

export function useSettings(userId: string | null): UseSettingsResult {
  const [equipSet, setEquipSetState] = useState<EquipmentId[]>(DEFAULT_EQUIP);
  const [quickMode, setQuickModeState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEquipSetState(DEFAULT_EQUIP);
      setQuickModeState(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from('user_settings')
      .select('equip_set, quick_mode')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }: { data: { equip_set: EquipmentId[]; quick_mode: boolean } | null }) => {
        if (cancelled) return;
        if (data) {
          setEquipSetState(data.equip_set ?? DEFAULT_EQUIP);
          setQuickModeState(Boolean(data.quick_mode));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = useCallback(
    async (next: { equip_set?: EquipmentId[]; quick_mode?: boolean }) => {
      if (!userId) return;
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: userId, equip_set: equipSet, quick_mode: quickMode, ...next });
      if (error) throw error;
    },
    [userId, equipSet, quickMode]
  );

  const setEquipSet = useCallback(
    async (next: EquipmentId[]) => {
      setEquipSetState(next);
      await persist({ equip_set: next });
    },
    [persist]
  );

  const setQuickMode = useCallback(
    async (next: boolean) => {
      setQuickModeState(next);
      await persist({ quick_mode: next });
    },
    [persist]
  );

  return { equipSet, quickMode, loading, setEquipSet, setQuickMode };
}
