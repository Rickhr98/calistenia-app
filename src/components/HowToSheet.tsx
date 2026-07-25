import type { HowTo } from '../data/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { StickFigure, EXERCISE_ANIMATIONS } from './exercise-animations';
import './exercise-animations/exercise-animations.css';

interface HowToSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  hw: HowTo | null;
  exerciseId?: string | null;
}

export function HowToSheet({ open, onOpenChange, name, hw, exerciseId }: HowToSheetProps) {
  const animationClass = exerciseId && EXERCISE_ANIMATIONS[exerciseId] ? EXERCISE_ANIMATIONS[exerciseId] : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Puntos clave de técnica</SheetDescription>
        </SheetHeader>
        {animationClass && (
          <div className="mt-4 flex justify-center rounded-lg bg-surface-2 py-6">
            <StickFigure className={animationClass} />
          </div>
        )}
        <ul className="mt-4 list-none p-0">
          {hw?.c.map((cue, i) => (
            <li key={i} className="flex items-start gap-[11px] border-b border-line py-2.5 text-sm last:border-0">
              <span className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span>{cue}</span>
            </li>
          ))}
        </ul>
        {hw && (
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(hw.y)}`}
            target="_blank"
            rel="noopener"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff0033] p-3.5 text-sm font-bold text-white"
          >
            Ver tutorial en YouTube
          </a>
        )}
        <SheetClose asChild>
          <Button className="mt-3.5 w-full text-muted-foreground">Cerrar</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
