import { useState } from 'react';
import { DAYS } from './data/days';
import type { ResolvedExercise } from './data/types';
import { resolve } from './lib/routine';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { useLogs } from './hooks/useLogs';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { EquipmentSheet } from './components/EquipmentSheet';
import { DayView } from './components/DayView';
import { ProgressView } from './components/ProgressView';
import { HowToSheet } from './components/HowToSheet';
import { TimerSheet } from './components/TimerSheet';
import { RepsSheet } from './components/RepsSheet';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const { session, loading: authLoading, signOut } = useAuth();
  const userId = session?.user.id ?? null;
  const { equipSet, quickMode, setEquipSet, setQuickMode } = useSettings(userId);
  const { logs, addLog, wipe } = useLogs(userId);

  const [active, setActive] = useState('d1');
  const [equipOpen, setEquipOpen] = useState(false);
  const [howToId, setHowToId] = useState<string | null>(null);
  const [timerEx, setTimerEx] = useState<ResolvedExercise | null>(null);
  const [repsEx, setRepsEx] = useState<ResolvedExercise | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1900);
  };

  if (authLoading) return null;
  if (!session) return <Login />;

  const currentDay = DAYS.find((d) => d.id === active);

  const findResolved = (exId: string): ResolvedExercise | null => {
    for (const day of DAYS) {
      if (!day.ex) continue;
      for (const ex of day.ex) {
        const r = resolve(ex, equipSet);
        if (r?.id === exId) return r;
      }
    }
    return null;
  };

  const handleTrack = (exId: string) => {
    const r = findResolved(exId);
    if (!r) return;
    if (r.type === 'hold') setTimerEx(r);
    else setRepsEx(r);
  };

  const handleSaveHold = async (value: number) => {
    if (!timerEx) return;
    try {
      await addLog({ ex_id: timerEx.id, skill: timerEx.skill, type: 'hold', value });
      showToast(`Guardado: ${value}s`);
    } catch {
      showToast('No se pudo guardar 😕');
    }
    setTimerEx(null);
  };

  const handleSaveReps = async (value: number) => {
    if (!repsEx) return;
    try {
      await addLog({ ex_id: repsEx.id, skill: repsEx.skill, type: 'reps', value });
      showToast(`Guardado: ${value} reps`);
    } catch {
      showToast('No se pudo guardar 😕');
    }
    setRepsEx(null);
  };

  const handleWipe = async () => {
    if (!window.confirm('¿Borrar todos tus registros? No se puede deshacer.')) return;
    try {
      await wipe();
      showToast('Registros borrados');
    } catch {
      showToast('No se pudieron borrar los registros 😕');
    }
  };

  const howToEx = howToId ? findResolved(howToId) : null;
  const timerBest = timerEx ? Math.max(0, ...logs.filter((l) => l.ex_id === timerEx.id).map((l) => l.value)) : 0;

  return (
    <div className="mx-auto min-h-screen max-w-[560px] pb-[90px]">
      <Header
        equipSet={equipSet}
        quickMode={quickMode}
        onOpenEquip={() => setEquipOpen(true)}
        onToggleQuick={() => setQuickMode(!quickMode)}
        onSignOut={() => signOut()}
      />

      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {DAYS.map((d) => (
            <TabsTrigger key={d.id} value={d.id}>
              {d.label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="prog">📈 Progreso</TabsTrigger>
        </TabsList>
      </Tabs>

      <main>
        {active === 'prog' || !currentDay ? (
          <ProgressView logs={logs} onWipe={handleWipe} />
        ) : (
          <DayView day={currentDay} equipSet={equipSet} quickMode={quickMode} logs={logs} onTrack={handleTrack} onHowTo={setHowToId} />
        )}
      </main>

      <EquipmentSheet open={equipOpen} onOpenChange={setEquipOpen} equipSet={equipSet} onChange={setEquipSet} />
      <HowToSheet open={!!howToId} onOpenChange={(o) => !o && setHowToId(null)} name={howToEx?.name ?? ''} hw={howToEx?.hw ?? null} />
      {timerEx && (
        <TimerSheet
          open={!!timerEx}
          onOpenChange={(o) => !o && setTimerEx(null)}
          name={timerEx.name}
          target={timerEx.target}
          best={timerBest}
          onSave={handleSaveHold}
        />
      )}
      {repsEx && (
        <RepsSheet open={!!repsEx} onOpenChange={(o) => !o && setRepsEx(null)} name={repsEx.name} target={repsEx.target} onSave={handleSaveReps} />
      )}

      {toastMsg && (
        <div className="fixed bottom-[104px] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-[18px] py-2.5 text-sm font-medium text-white">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
