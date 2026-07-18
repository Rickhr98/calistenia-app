import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseCard } from './ExerciseCard';
import type { ResolvedExercise } from '../data/types';

const holdEx: ResolvedExercise = {
  id: 'ctw',
  name: 'Chest-to-wall hold',
  target: '4 × 20–40 s',
  type: 'hold',
  skill: 'handstand',
  adapted: false,
};

describe('ExerciseCard', () => {
  it('shows the timer action for hold exercises and calls onTrack', () => {
    const onTrack = vi.fn();
    render(<ExerciseCard ex={holdEx} best={30} last={{ value: 25 }} onTrack={onTrack} onHowTo={() => {}} />);
    expect(screen.getByText(/récord 30s/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('⏱ Cronometrar'));
    expect(onTrack).toHaveBeenCalledWith('ctw');
  });

  it('shows the adapted badge with the original exercise name struck through', () => {
    const adapted: ResolvedExercise = { ...holdEx, adapted: true, orig: 'Chest-to-wall hold original' };
    render(<ExerciseCard ex={adapted} best={0} last={null} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getByText('Chest-to-wall hold original')).toBeInTheDocument();
  });
});
