import { EQUIPMENT } from '../data/equipment';
import { PRESETS } from '../data/presets';
import { sameSet } from '../lib/routine';
import type { EquipmentId } from '../data/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';

interface EquipmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipSet: EquipmentId[];
  onChange: (next: EquipmentId[]) => void;
}

export function EquipmentSheet({ open, onOpenChange, equipSet, onChange }: EquipmentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>¿Qué tienes hoy?</SheetTitle>
          <SheetDescription>Elige un preset o marca tus implementos. La rutina se adapta sola.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => {
            const active = sameSet(preset.set, equipSet);
            return (
              <button
                key={key}
                onClick={() => onChange([...preset.set])}
                className={`flex-1 rounded-xl border px-1.5 py-2.5 text-center text-[13px] font-semibold ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-surface-2'
                }`}
              >
                {preset.label}
                <small className={`block text-[10px] font-normal ${active ? 'text-[#c9cdd6]' : 'text-muted-foreground'}`}>{preset.hint}</small>
              </button>
            );
          })}
        </div>
        <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Implementos</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.entries(EQUIPMENT) as [EquipmentId, (typeof EQUIPMENT)[EquipmentId]][]).map(([key, equip]) => {
            const on = equipSet.includes(key);
            return (
              <button
                key={key}
                disabled={equip.fixed}
                onClick={() => onChange(on ? equipSet.filter((x) => x !== key) : [...equipSet, key])}
                className={`flex items-center gap-[7px] rounded-[11px] border px-3.5 py-2.5 text-[13px] font-semibold ${
                  on ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-muted-foreground'
                } ${equip.fixed ? 'opacity-65' : ''}`}
              >
                <span className="grid h-4 w-4 place-items-center rounded-[5px] border-[1.5px] border-current text-[11px]">{on ? '✓' : ''}</span>
                {equip.label}
                {equip.fixed ? ' (siempre)' : ''}
              </button>
            );
          })}
        </div>
        <SheetClose asChild>
          <Button variant="dark" size="lg" className="mt-4 w-full">
            Listo
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
