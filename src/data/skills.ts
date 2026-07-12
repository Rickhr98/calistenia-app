import type { Skill } from './types';

export const SKILLS: Record<string, Skill> = {
  handstand: { name: 'Handstand (chest-to-wall)', goal: 60, milestones: [0, 15, 30, 45, 60] },
  lsit: { name: 'L-sit', goal: 30, milestones: [0, 8, 15, 22, 30] },
  frontlever: { name: 'Front lever (tuck)', goal: 20, milestones: [0, 5, 10, 15, 20] },
};
