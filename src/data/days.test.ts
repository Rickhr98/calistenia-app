import { describe, it, expect } from 'vitest';
import { DAYS } from './days';
import { EQUIPMENT } from './equipment';
import type { EquipmentId } from './types';

const validEquip = new Set(Object.keys(EQUIPMENT));

describe('DAYS data integrity', () => {
  it('has exactly 5 days in order d1..d5', () => {
    expect(DAYS.map((d) => d.id)).toEqual(['d1', 'd2', 'd3', 'd4', 'd5']);
  });

  it('every exercise and alt only references known equipment ids', () => {
    const badRefs: string[] = [];
    for (const day of DAYS) {
      for (const ex of day.ex ?? []) {
        for (const id of ex.equip) if (!validEquip.has(id)) badRefs.push(`${day.id}/${ex.id}: ${id}`);
        for (const alt of ex.alt ?? []) {
          for (const id of alt.equip) if (!validEquip.has(id as EquipmentId)) badRefs.push(`${day.id}/${alt.id}: ${id}`);
        }
      }
    }
    expect(badRefs).toEqual([]);
  });

  it('day 3 is mobility-only with no exercises', () => {
    const d3 = DAYS.find((d) => d.id === 'd3')!;
    expect(d3.mobility?.length).toBeGreaterThan(0);
    expect(d3.ex).toBeUndefined();
  });
});
