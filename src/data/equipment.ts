import type { Equipment, EquipmentId } from './types';

export const EQUIPMENT: Record<EquipmentId, Equipment> = {
  floor: { label: 'Suelo', fixed: true },
  wall: { label: 'Pared' },
  pullbar: { label: 'Barra de dominadas' },
  dipbar: { label: 'Barras paralelas' },
  lowbar: { label: 'Barra baja / rail' },
  rings: { label: 'Anillas' },
  weights: { label: 'Pesas' },
};
