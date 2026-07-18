import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimerSheet } from './TimerSheet';

afterEach(() => vi.useRealTimers());

describe('TimerSheet', () => {
  it('counts up while running and saves the rounded elapsed value', () => {
    vi.useFakeTimers();
    const onSave = vi.fn();
    render(<TimerSheet open onOpenChange={() => {}} name="Chest-to-wall hold" target="4x20-40s" best={0} onSave={onSave} />);
    fireEvent.click(screen.getByText('Iniciar'));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('2.0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Detener'));
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(2);
  });

  it('prefers the manual value over the stopwatch when provided', () => {
    const onSave = vi.fn();
    render(<TimerSheet open onOpenChange={() => {}} name="Hold" target="target" best={0} onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('seg'), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(15);
  });
});
