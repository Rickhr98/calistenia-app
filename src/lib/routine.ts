import type { Exercise, ResolvedExercise, EquipmentId, LogEntry } from '../data/types';
import { PRESETS } from '../data/presets';
import { EQUIPMENT } from '../data/equipment';

export function hasEquip(equipSet: EquipmentId[], required: EquipmentId[]): boolean {
  return required.every((r) => equipSet.includes(r));
}

export function sameSet(a: EquipmentId[], b: EquipmentId[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export function resolve(ex: Exercise, equipSet: EquipmentId[]): ResolvedExercise | null {
  if (hasEquip(equipSet, ex.equip)) {
    return { id: ex.id, name: ex.name, target: ex.target, type: ex.type, skill: ex.skill ?? null, hw: ex.hw, adapted: false };
  }
  if (ex.alt) {
    for (const alt of ex.alt) {
      if (hasEquip(equipSet, alt.equip)) {
        return {
          id: alt.id,
          name: alt.name,
          target: alt.target,
          type: alt.type ?? ex.type,
          skill: ex.skill ?? null,
          hw: alt.hw ?? ex.hw,
          adapted: true,
          orig: ex.name,
        };
      }
    }
  }
  return null;
}

export function equipLabel(equipSet: EquipmentId[]): string {
  for (const preset of Object.values(PRESETS)) {
    if (sameSet(preset.set, equipSet)) return `Equipo: ${preset.label}`;
  }
  const names = equipSet.filter((x) => x !== 'floor').map((x) => EQUIPMENT[x].label);
  if (!names.length) return 'Equipo: solo suelo';
  const shown = names.slice(0, 2).join(', ');
  return `Equipo: ${shown}${names.length > 2 ? ` +${names.length - 2}` : ''}`;
}

export function fmtSeconds(s: number): string {
  return s.toFixed(1);
}

export function bestFor(logs: LogEntry[], exId: string): number {
  return logs.filter((l) => l.ex_id === exId).reduce((m, l) => Math.max(m, l.value), 0);
}

export function lastFor(logs: LogEntry[], exId: string): LogEntry | null {
  const matches = logs.filter((l) => l.ex_id === exId);
  return matches.length ? matches[matches.length - 1] : null;
}

export function bestSkill(logs: LogEntry[], skill: string): number {
  return logs.filter((l) => l.skill === skill).reduce((m, l) => Math.max(m, l.value), 0);
}
