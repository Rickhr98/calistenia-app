import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayView } from './DayView';
import { DAYS } from '../data/days';

describe('DayView', () => {
  it('shows an empty-day message when required equipment is missing', () => {
    const day = DAYS.find((d) => d.id === 'd2')!;
    // Note: equipSet is [] (not ['floor'] as in the plan brief) because d2 includes
    // two floor-only exercises (hollow, arch) with no equipment requirement beyond
    // floor; ['floor'] can never yield an empty day for d2 against the real data.
    render(<DayView day={day} equipSet={[]} quickMode={false} logs={[]} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getByText('Nada disponible con este equipo')).toBeInTheDocument();
  });

  it('renders resolved exercises for the given equipment', () => {
    const day = DAYS.find((d) => d.id === 'd1')!;
    render(
      <DayView day={day} equipSet={['floor', 'wall', 'dipbar', 'weights']} quickMode={false} logs={[]} onTrack={() => {}} onHowTo={() => {}} />
    );
    expect(screen.getByText('Kick-ups a pared')).toBeInTheDocument();
  });

  it('renders mobility blocks for a mobility-only day, trimmed in quick mode', () => {
    const day = DAYS.find((d) => d.id === 'd3')!;
    render(<DayView day={day} equipSet={['floor']} quickMode logs={[]} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getAllByText(/min/).length).toBe(3);
  });
});
