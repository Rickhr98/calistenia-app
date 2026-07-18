import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { LogEntry } from '../data/types';

export interface UseLogsResult {
  logs: LogEntry[];
  loading: boolean;
  addLog: (entry: Pick<LogEntry, 'ex_id' | 'skill' | 'type' | 'value'>) => Promise<void>;
  wipe: () => Promise<void>;
}

export function useLogs(userId: string | null): UseLogsResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('logs').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    setLogs((data as LogEntry[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = useCallback(
    async (entry: Pick<LogEntry, 'ex_id' | 'skill' | 'type' | 'value'>) => {
      if (!userId) return;
      const { error } = await supabase.from('logs').insert({ ...entry, user_id: userId });
      if (error) throw error;
      await refresh();
    },
    [userId, refresh]
  );

  const wipe = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase.from('logs').delete().eq('user_id', userId);
    if (error) throw error;
    await refresh();
  }, [userId, refresh]);

  return { logs, loading, addLog, wipe };
}
