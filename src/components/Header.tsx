import { equipLabel } from '../lib/routine';
import type { EquipmentId } from '../data/types';
import { Button } from './ui/button';

interface HeaderProps {
  equipSet: EquipmentId[];
  quickMode: boolean;
  onOpenEquip: () => void;
  onToggleQuick: () => void;
  onSignOut: () => void;
}

export function Header({ equipSet, quickMode, onOpenEquip, onToggleQuick, onSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[5] bg-gradient-to-b from-bg to-transparent px-[18px] pb-[10px] pt-[22px]">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Sala de Skills</div>
        <button onClick={onSignOut} className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground underline">
          Salir
        </button>
      </div>
      <h1 className="mt-1.5 font-display text-[27px] font-bold tracking-[-0.02em]">Handstand · L-sit · Front lever</h1>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onOpenEquip}
          className="flex min-w-0 flex-1 items-center gap-[7px] rounded-full border border-line bg-surface py-2 pl-[11px] pr-[13px] text-[13px] font-semibold"
        >
          <span className="h-2 w-2 flex-none rounded-full bg-lime" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{equipLabel(equipSet)}</span>
          <span className="ml-auto flex-none text-muted-foreground">▾</span>
        </button>
        <Button onClick={onToggleQuick} className={quickMode ? 'flex-none border-lime bg-lime text-[#2c3a00]' : 'flex-none'}>
          ⚡ Rápida
        </Button>
      </div>
    </header>
  );
}
