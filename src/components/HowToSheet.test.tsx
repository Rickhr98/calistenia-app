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
});
