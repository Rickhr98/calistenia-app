import type { Preset } from './types';

export const PRESETS: Record<string, Preset> = {
  parque: { label: 'Parque', hint: 'barras', set: ['floor', 'pullbar', 'dipbar', 'lowbar'] },
  casa: { label: 'Casa', hint: 'pared + pesas', set: ['floor', 'wall', 'weights'] },
  todo: {
    label: 'Todo',
    hint: 'gym completo',
    set: ['floor', 'wall', 'pullbar', 'dipbar', 'lowbar', 'rings', 'weights'],
  },
};
