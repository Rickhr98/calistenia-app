import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } }, loading: false, signInWithEmail: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('./hooks/useSettings', () => ({
  useSettings: () => ({
    equipSet: ['floor', 'wall', 'dipbar', 'weights'],
    quickMode: false,
    loading: false,
    setEquipSet: vi.fn(),
    setQuickMode: vi.fn(),
  }),
}));
vi.mock('./hooks/useLogs', () => ({
  useLogs: () => ({ logs: [], loading: false, addLog: vi.fn(), wipe: vi.fn() }),
}));

import App from './App';

describe('App (logged in)', () => {
  it('renders day 1 exercises by default and switches to progress', async () => {
    render(<App />);
    expect(screen.getByText('Kick-ups a pared')).toBeInTheDocument();
    await userEvent.click(screen.getByText('📈 Progreso'));
    await waitFor(() => {
      expect(screen.getByText('PROGRESO')).toBeInTheDocument();
    });
  });
});
