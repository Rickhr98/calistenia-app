import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('shows the current equipment label and calls onOpenEquip', () => {
    const onOpenEquip = vi.fn();
    render(
      <Header equipSet={['floor', 'wall']} quickMode={false} onOpenEquip={onOpenEquip} onToggleQuick={() => {}} onSignOut={() => {}} />
    );
    expect(screen.getByText(/Pared/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Pared/));
    expect(onOpenEquip).toHaveBeenCalledOnce();
  });

  it('calls onToggleQuick when the quick button is clicked', () => {
    const onToggleQuick = vi.fn();
    render(
      <Header equipSet={['floor']} quickMode={false} onOpenEquip={() => {}} onToggleQuick={onToggleQuick} onSignOut={() => {}} />
    );
    fireEvent.click(screen.getByText('⚡ Rápida'));
    expect(onToggleQuick).toHaveBeenCalledOnce();
  });

  it('calls onSignOut when Salir is clicked', () => {
    const onSignOut = vi.fn();
    render(<Header equipSet={['floor']} quickMode={false} onOpenEquip={() => {}} onToggleQuick={() => {}} onSignOut={onSignOut} />);
    fireEvent.click(screen.getByText('Salir'));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
