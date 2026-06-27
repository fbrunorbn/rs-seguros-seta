import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../services/authService';

const schema = z.object({
  email: z.string().email('Informe um email válido.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

type LoginData = z.infer<typeof schema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: LoginData) {
    setError('');

    try {
      await login(data.email, data.senha);
      navigate('/admin/leads');
    } catch {
      setError('Email ou senha inválidos.');
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-icon"><ShieldCheck size={32} /></div>
        <h1>Entrar no admin</h1>
        <label>
          <span><Mail size={16} /> Email</span>
          <input {...register('email')} type="email" placeholder="admin@exemplo.com" />
        </label>
        {errors.email && <small>{errors.email.message}</small>}
        <label>
          <span><LockKeyhole size={16} /> Senha</span>
          <input {...register('senha')} type="password" placeholder="Sua senha" />
        </label>
        {errors.senha && <small>{errors.senha.message}</small>}
        <button className="primary-button full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </main>
  );
}
