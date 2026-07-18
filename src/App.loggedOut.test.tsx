import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ session: null, loading: false, signInWithEmail: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('./hooks/useSettings', () => ({
  useSettings: () => ({ equipSet: ['floor'], quickMode: false, loading: false, setEquipSet: vi.fn(), setQuickMode: vi.fn() }),
}));
vi.mock('./hooks/useLogs', () => ({
  useLogs: () => ({ logs: [], loading: false, addLog: vi.fn(), wipe: vi.fn() }),
}));

import App from './App';

describe('App (logged out)', () => {
  it('shows the login screen when there is no session', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
  });
});
