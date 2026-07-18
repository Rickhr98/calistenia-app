import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Login() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await signInWithEmail(email);
    if (error) {
      setErrorMsg(error);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return (
      <div className="p-6 text-center">
        <p className="font-display text-lg font-semibold">Revisa tu correo</p>
        <p className="mt-2 text-sm text-muted-foreground">Te enviamos un link de acceso a {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6">
      <p className="font-display text-lg font-semibold">Sala de Skills</p>
      <p className="text-sm text-muted-foreground">Escribe tu email para entrar, sin contraseña.</p>
      <Input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full text-left font-body text-base font-normal"
      />
      {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar link'}
      </Button>
    </form>
  );
}
