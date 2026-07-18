import { SKILLS } from '../data/skills';
import { bestSkill } from '../lib/routine';
import type { LogEntry } from '../data/types';
import { Progress } from './ui/progress';

interface ProgressViewProps {
  logs: LogEntry[];
  onWipe: () => void;
}

export function ProgressView({ logs, onWipe }: ProgressViewProps) {
  const sessions = new Set(logs.map((l) => new Date(l.created_at ?? 0).toISOString().slice(0, 10))).size;

  return (
    <div className="px-3.5">
      <div className="flex items-baseline justify-between px-1 pb-2.5 pt-1.5">
        <span className="font-mono text-[13px] font-bold text-accent">PROGRESO</span>
        <span className="font-display text-[19px] font-semibold">Tus récords</span>
      </div>

      <div className="mb-3.5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{sessions}</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Días activos</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{logs.length}</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Registros</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{bestSkill(logs, 'handstand') || 0}s</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Mejor HS</div>
        </div>
      </div>

      {Object.entries(SKILLS).map(([key, skill]) => {
        const best = bestSkill(logs, key);
        const pct = Math.min(100, Math.round((best / skill.goal) * 100));
        const hits = logs.filter((l) => l.skill === key).slice(-14);
        const max = Math.max(...hits.map((x) => x.value), 1);
        return (
          <div key={key} className="mb-3 rounded-2xl border border-line bg-surface p-4">
            <h3 className="flex items-baseline justify-between text-base font-semibold">
              {skill.name}
              <span className="font-mono text-[22px] font-bold">
                {best}
                <small className="text-xs font-normal text-muted-foreground">/{skill.goal}s</small>
              </span>
            </h3>
            <Progress value={pct} className="my-3" indicatorClassName={best >= skill.goal ? 'bg-gradient-to-r from-amber to-lime' : undefined} />
            <div className="flex justify-between font-mono text-[10.5px] text-muted-foreground">
              {skill.milestones.map((m) => (
                <span key={m}>{m}s</span>
              ))}
            </div>
            {hits.length ? (
              <div className="mt-3 flex h-[34px] items-end gap-[3px]">
                {hits.map((h, i) => (
                  <i
                    key={i}
                    className={`block flex-1 rounded-t ${h.value === max ? 'bg-accent' : 'bg-accent-soft'}`}
                    style={{ height: `${Math.max(8, (h.value / max) * 100)}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 p-2 text-center text-[12.5px] text-muted-foreground">Aún sin registros — cronométrate en la pestaña del día</div>
            )}
          </div>
        );
      })}

      <button onClick={onWipe} className="mx-auto mt-2 block text-xs text-muted-foreground underline">
        Borrar todos los registros
      </button>
    </div>
  );
}
