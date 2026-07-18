import { describe, it, expect } from 'vitest';
import { resolve, hasEquip, sameSet, equipLabel, fmtSeconds, bestFor, lastFor, bestSkill } from './routine';
import type { Exercise, LogEntry } from '../data/types';

describe('hasEquip', () => {
  it('returns true when all required equipment is present', () => {
    expect(hasEquip(['floor', 'wall'], ['wall'])).toBe(true);
  });
  it('returns false when required equipment is missing', () => {
    expect(hasEquip(['floor'], ['wall'])).toBe(false);
  });
});

describe('sameSet', () => {
  it('is true for equal sets regardless of order', () => {
    expect(sameSet(['floor', 'wall'], ['wall', 'floor'])).toBe(true);
  });
  it('is false for different lengths', () => {
    expect(sameSet(['floor'], ['floor', 'wall'])).toBe(false);
  });
});

describe('resolve', () => {
  const ex: Exercise = {
    id: 'dip',
    name: 'Fondos',
    target: '4x8',
    type: 'reps',
    equip: ['dipbar'],
    alt: [{ id: 'dip_low', name: 'Fondos banco', target: '4x8', equip: ['lowbar'] }],
  };

  it('returns the primary exercise when equipment matches', () => {
    const r = resolve(ex, ['floor', 'dipbar']);
    expect(r?.id).toBe('dip');
    expect(r?.adapted).toBe(false);
  });

  it('falls back to an alt when primary equipment is missing', () => {
    const r = resolve(ex, ['floor', 'lowbar']);
    expect(r?.id).toBe('dip_low');
    expect(r?.adapted).toBe(true);
    expect(r?.orig).toBe('Fondos');
  });

  it('returns null when neither primary nor alt equipment is available', () => {
    expect(resolve(ex, ['floor'])).toBeNull();
  });
});

describe('equipLabel', () => {
  it('matches a known preset', () => {
    expect(equipLabel(['floor', 'pullbar', 'dipbar', 'lowbar'])).toBe('Equipo: Parque');
  });
  it('falls back to a manual list beyond two items', () => {
    expect(equipLabel(['floor', 'wall', 'pullbar', 'rings'])).toBe('Equipo: Pared, Barra de dominadas +1');
  });
  it('reports solo suelo when nothing else is selected', () => {
    expect(equipLabel(['floor'])).toBe('Equipo: solo suelo');
  });
});

describe('fmtSeconds', () => {
  it('formats to one decimal place', () => {
    expect(fmtSeconds(12.345)).toBe('12.3');
  });
});

describe('log aggregations', () => {
  const logs: LogEntry[] = [
    { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 20 },
    { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 35 },
    { ex_id: 'dip', skill: null, type: 'reps', value: 10 },
  ];

  it('bestFor returns the max value for an exercise', () => {
    expect(bestFor(logs, 'ctw')).toBe(35);
  });
  it('lastFor returns the most recently pushed entry', () => {
    expect(lastFor(logs, 'ctw')?.value).toBe(35);
  });
  it('bestSkill returns the max value across a skill', () => {
    expect(bestSkill(logs, 'handstand')).toBe(35);
  });
  it('returns 0/null for exercises with no logs', () => {
    expect(bestFor(logs, 'unknown')).toBe(0);
    expect(lastFor(logs, 'unknown')).toBeNull();
  });
});
