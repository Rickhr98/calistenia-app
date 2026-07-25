import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowToSheet } from './HowToSheet';

describe('HowToSheet', () => {
  it('lists numbered cues and a youtube search link', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Kick-ups a pared"
        hw={{ c: ['Manos a un palmo de la pared', 'Mira entre tus manos'], y: 'kick up to handstand wall tutorial' }}
      />
    );
    expect(screen.getByText('Manos a un palmo de la pared')).toBeInTheDocument();
    expect(screen.getByText('Ver tutorial en YouTube').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('kick%20up%20to%20handstand%20wall%20tutorial')
    );
  });

  it('renders animation when exerciseId is in EXERCISE_ANIMATIONS map', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Pull-ups"
        hw={{ c: ['Keep arms straight'], y: 'pull up tutorial' }}
        exerciseId="pull"
      />
    );
    expect(screen.getByTestId('stick-figure')).toBeInTheDocument();
  });

  it('does not render animation when exerciseId is not in map', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Unknown Exercise"
        hw={{ c: ['Some cue'], y: 'tutorial' }}
        exerciseId="unknown_exercise"
      />
    );
    expect(screen.queryByTestId('stick-figure')).not.toBeInTheDocument();
  });

  it('does not render animation when exerciseId is null', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Exercise Without Animation"
        hw={{ c: ['Some cue'], y: 'tutorial' }}
        exerciseId={null}
      />
    );
    expect(screen.queryByTestId('stick-figure')).not.toBeInTheDocument();
  });
});
