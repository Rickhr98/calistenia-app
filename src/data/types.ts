export type EquipmentId = 'floor' | 'wall' | 'pullbar' | 'dipbar' | 'lowbar' | 'rings' | 'weights';

export interface Equipment {
  label: string;
  fixed?: boolean;
}

export interface Preset {
  label: string;
  hint: string;
  set: EquipmentId[];
}

export interface HowTo {
  c: string[];
  y: string;
}

export type ExerciseType = 'hold' | 'reps';

export interface ExerciseAlt {
  id: string;
  name: string;
  target: string;
  type?: ExerciseType;
  hw?: HowTo;
  equip: EquipmentId[];
}

export interface Exercise {
  id: string;
  name: string;
  target: string;
  type: ExerciseType;
  equip: EquipmentId[];
  skill?: string;
  hw?: HowTo;
  alt?: ExerciseAlt[];
}

export interface MobilityBlock {
  t: string;
  d: string;
  s: string;
}

export interface Day {
  id: string;
  label: string;
  focus: string;
  ex?: Exercise[];
  mobility?: MobilityBlock[];
}

export interface Skill {
  name: string;
  goal: number;
  milestones: number[];
}

export interface ResolvedExercise {
  id: string;
  name: string;
  target: string;
  type: ExerciseType;
  skill: string | null;
  hw?: HowTo;
  adapted: boolean;
  orig?: string;
}

export interface LogEntry {
  id?: number;
  user_id?: string;
  ex_id: string;
  skill: string | null;
  type: ExerciseType;
  value: number;
  created_at?: string;
}
