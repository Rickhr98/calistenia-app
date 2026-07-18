import type { ResolvedExercise } from '../data/types';

interface ExerciseCardProps {
  ex: ResolvedExercise;
  best: number;
  last: { value: number } | null;
  onTrack: (id: string) => void;
  onHowTo: (id: string) => void;
}

export function ExerciseCard({ ex, best, last, onTrack, onHowTo }: ExerciseCardProps) {
  const unit = ex.type === 'hold' ? 's' : ' reps';
  return (
    <div
      className={`mb-2.5 rounded-2xl border p-3.5 ${
        ex.adapted ? 'border-[#cfe6a8] bg-gradient-to-b from-[#fbfef4] to-white' : 'border-line bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <div className="font-display text-[15.5px] font-semibold leading-tight">{ex.name}</div>
          <div className="mt-0.5 text-[12.5px] text-muted-foreground">
            {ex.target}
            {best ? ` · récord ${best}${unit}` : ''}
          </div>
          {ex.adapted && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-semibold text-[#4d7a00]">
              ↳ Adaptado a tu equipo <s className="font-normal text-muted-foreground">{ex.orig}</s>
            </div>
          )}
        </div>
        <span
          className={`flex-none rounded-[7px] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.05em] ${
            ex.skill ? 'bg-[#eafad0] text-[#4d7a00]' : ex.type === 'hold' ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted-foreground'
          }`}
        >
          {ex.skill ? 'Skill' : ex.type === 'hold' ? 'Hold' : 'Reps'}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onTrack(ex.id)}
          className={`rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold ${ex.type === 'hold' ? 'bg-ink text-white' : 'bg-accent text-white'}`}
        >
          {ex.type === 'hold' ? '⏱ Cronometrar' : '＋ Registrar'}
        </button>
        {ex.hw && (
          <button
            onClick={() => onHowTo(ex.id)}
            className="flex items-center gap-1 rounded-[10px] px-2.5 py-2.5 text-[13px] text-muted-foreground"
          >
            ⓘ Cómo
          </button>
        )}
        <div className={`ml-auto text-right font-mono text-xs font-bold ${last ? 'text-ok' : 'text-muted-foreground'}`}>
          <span className="block text-[10px] font-normal uppercase tracking-[0.08em] text-muted-foreground">último</span>
          {last ? `${last.value}${unit}` : '—'}
        </div>
      </div>
    </div>
  );
}
