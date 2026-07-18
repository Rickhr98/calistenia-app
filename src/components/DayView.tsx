import { useMemo } from 'react';
import type { Day, EquipmentId, LogEntry, ResolvedExercise } from '../data/types';
import { resolve, bestFor, lastFor } from '../lib/routine';
import { ExerciseCard } from './ExerciseCard';

const QUICK_N = 5;

interface DayViewProps {
  day: Day;
  equipSet: EquipmentId[];
  quickMode: boolean;
  logs: LogEntry[];
  onTrack: (exId: string) => void;
  onHowTo: (exId: string) => void;
}

export function DayView({ day, equipSet, quickMode, logs, onTrack, onHowTo }: DayViewProps) {
  const { shown, hidden } = useMemo(() => {
    if (!day.ex) return { shown: [] as ResolvedExercise[], hidden: 0 };
    const resolved = day.ex.map((ex) => resolve(ex, equipSet));
    const shownAll = resolved.filter((r): r is ResolvedExercise => r !== null);
    const hiddenCount = resolved.length - shownAll.length;
    if (!quickMode) return { shown: shownAll, hidden: hiddenCount };
    const skills = shownAll.filter((x) => x.skill);
    const rest = shownAll.filter((x) => !x.skill);
    return { shown: [...skills, ...rest].slice(0, QUICK_N), hidden: hiddenCount };
  }, [day, equipSet, quickMode]);

  return (
    <div className="px-3.5">
      <div className="flex items-baseline justify-between px-1 pb-2.5 pt-1.5">
        <span className="font-mono text-[13px] font-bold text-accent">{day.label.toUpperCase()}</span>
        <span className="font-display text-[19px] font-semibold">{day.focus}</span>
      </div>

      {day.mobility && (
        <div className="rounded-2xl border border-line bg-surface p-1.5">
          {(quickMode ? day.mobility.slice(0, 3) : day.mobility).map((block, i) => (
            <div key={i} className="flex gap-3 border-b border-line px-3 py-3 last:border-0">
              <div className="w-[46px] flex-none font-mono text-[13px] font-bold text-accent">{block.t}</div>
              <div className="text-[13.5px]">
                {block.d}
                <small className="block text-xs text-muted-foreground">{block.s}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {!day.mobility && quickMode && shown.length > 0 && (
        <div className="mx-1 mb-3 flex items-center gap-2 rounded-xl border border-[#d8ec9f] bg-[#f4fbe0] p-2.5 text-xs font-semibold text-[#4d7a00]">
          ⚡ Rutina rápida · {shown.length} ejercicios (skills primero)
        </div>
      )}

      {!day.mobility && shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-[13.5px] text-muted-foreground">
          <b className="mb-1 block font-display text-ink">Nada disponible con este equipo</b>
          Este día necesita implementos que no marcaste. Cambia tu equipo arriba o elige otro día.
        </div>
      )}

      {!day.mobility &&
        shown.map((r) => (
          <ExerciseCard key={r.id} ex={r} best={bestFor(logs, r.id)} last={lastFor(logs, r.id)} onTrack={onTrack} onHowTo={onHowTo} />
        ))}

      {!day.mobility && !quickMode && hidden > 0 && (
        <div className="pb-0.5 pt-1.5 text-center text-xs text-muted-foreground">
          {hidden} ejercicio{hidden > 1 ? 's' : ''} oculto{hidden > 1 ? 's' : ''} por tu equipo actual
        </div>
      )}
    </div>
  );
}
