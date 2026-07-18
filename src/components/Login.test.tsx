import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const signInWithEmailMock = vi.fn();
vi.mock('../hooks/useAuth', () => ({ useAuth: () => ({ signInWithEmail: signInWithEmailMock }) }));

import { Login } from './Login';

describe('Login', () => {
  beforeEach(() => signInWithEmailMock.mockReset());

  it('shows a confirmation after a successful magic link request', async () => {
    signInWithEmailMock.mockResolvedValue({ error: null });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByText('Enviar link'));
    await waitFor(() => expect(screen.getByText(/Revisa tu correo/)).toBeInTheDocument());
    expect(signInWithEmailMock).toHaveBeenCalledWith('me@example.com');
  });

  it('shows the error message when the request fails', async () => {
    signInWithEmailMock.mockResolvedValue({ error: 'algo salió mal' });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByText('Enviar link'));
    await waitFor(() => expect(screen.getByText('algo salió mal')).toBeInTheDocument());
  });
});
