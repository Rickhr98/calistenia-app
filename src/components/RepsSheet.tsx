import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface RepsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  target: string;
  onSave: (value: number) => void;
}

export function RepsSheet({ open, onOpenChange, name, target, onSave }: RepsSheetProps) {
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (!open) setReps('');
  }, [open]);

  const save = () => {
    const value = parseInt(reps, 10);
    if (!value || value < 0) return;
    onSave(value);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Meta: {target}</SheetDescription>
        </SheetHeader>
        <div className="mt-5 flex items-center justify-center gap-2 text-[15px] text-muted-foreground">
          Reps logradas:
          <Input type="number" inputMode="numeric" placeholder="0" value={reps} onChange={(e) => setReps(e.target.value)} className="w-[88px] text-lg" />
        </div>
        <div className="mt-5 flex gap-2.5">
          <Button variant="primary" size="lg" className="flex-1" onClick={save}>
            Guardar
          </Button>
          <SheetClose asChild>
            <Button size="lg" className="flex-1 text-muted-foreground">
              Cerrar
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
