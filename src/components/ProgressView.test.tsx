import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressView } from './ProgressView';
import type { LogEntry } from '../data/types';

describe('ProgressView', () => {
  it('shows aggregate stats and per-skill best values', () => {
    // Note: 3 logs across 2 distinct days so "Días activos" (2) and "Registros" (3)
    // render distinct text and don't collide in the DOM.
    const logs: LogEntry[] = [
      { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 35, created_at: '2026-01-01T00:00:00Z' },
      { ex_id: 'lsit', skill: 'lsit', type: 'hold', value: 10, created_at: '2026-01-01T00:00:00Z' },
      { ex_id: 'lsit', skill: 'lsit', type: 'hold', value: 20, created_at: '2026-01-02T00:00:00Z' },
    ];
    render(<ProgressView logs={logs} onWipe={() => {}} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('35s')).toBeInTheDocument();
  });

  it('calls onWipe when the reset link is clicked', () => {
    const onWipe = vi.fn();
    render(<ProgressView logs={[]} onWipe={onWipe} />);
    fireEvent.click(screen.getByText('Borrar todos los registros'));
    expect(onWipe).toHaveBeenCalledOnce();
  });
});
