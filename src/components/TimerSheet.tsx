import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { fmtSeconds } from '../lib/routine';

interface TimerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  target: string;
  best: number;
  onSave: (value: number) => void;
}

export function TimerSheet({ open, onOpenChange, name, target, best, onSave }: TimerSheetProps) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [manual, setManual] = useState('');
  const startedAt = useRef(0);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      setRunning(false);
      setManual('');
    }
  }, [open]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 100);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (!running) {
      startedAt.current = Date.now() - elapsed * 1000;
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const save = () => {
    const man = parseFloat(manual);
    const value = !Number.isNaN(man) && man > 0 ? man : Math.round(elapsed * 10) / 10;
    if (!value) return;
    onSave(Math.round(value * 10) / 10);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Meta: {target}</SheetDescription>
        </SheetHeader>
        <div className={`my-4 text-center font-mono text-[62px] font-bold tracking-[-0.02em] ${running ? 'text-accent' : ''}`}>
          {fmtSeconds(elapsed)}
        </div>
        <div className="mb-3.5 text-center font-mono text-xs text-muted-foreground">
          {best ? (
            <>
              Tu récord: <b className="text-ok">{best}s</b> — ¡a superarlo!
            </>
          ) : (
            'Primer registro de este ejercicio'
          )}
        </div>
        <div className="flex gap-2.5">
          <Button variant="dark" size="lg" className="flex-[2]" onClick={toggle}>
            {running ? 'Detener' : elapsed > 0 ? 'Reanudar' : 'Iniciar'}
          </Button>
          <Button size="lg" className="flex-1" onClick={save}>
            Guardar
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
          o a mano:
          <Input type="number" inputMode="decimal" placeholder="seg" value={manual} onChange={(e) => setManual(e.target.value)} className="w-[74px]" />
          seg
        </div>
        <SheetClose asChild>
          <Button className="mt-3.5 w-full text-muted-foreground">Cerrar</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
