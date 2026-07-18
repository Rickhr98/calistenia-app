import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EquipmentSheet } from './EquipmentSheet';

describe('EquipmentSheet', () => {
  it('calls onChange with a preset set when a preset is clicked', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Casa'));
    expect(onChange).toHaveBeenCalledWith(['floor', 'wall', 'weights']);
  });

  it('toggles an individual piece of equipment', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Pared'));
    expect(onChange).toHaveBeenCalledWith(['floor', 'wall']);
  });

  it('does not toggle the fixed floor chip', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText(/Suelo/));
    expect(onChange).not.toHaveBeenCalled();
  });
});
