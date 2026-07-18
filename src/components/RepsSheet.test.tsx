import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepsSheet } from './RepsSheet';

describe('RepsSheet', () => {
  it('saves the entered rep count', () => {
    const onSave = vi.fn();
    render(<RepsSheet open onOpenChange={() => {}} name="Dominadas" target="4 × máx" onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '8' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(8);
  });

  it('does not save when the input is empty or invalid', () => {
    const onSave = vi.fn();
    render(<RepsSheet open onOpenChange={() => {}} name="Dominadas" target="4 × máx" onSave={onSave} />);
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).not.toHaveBeenCalled();
  });
});
