import React, { useState } from 'react';
import { Car, Lock, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (usuario: string, senha: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const success = onLogin(usuario, senha);
    if (!success) {
      setError('Credenciais invalidas. Use o formato carroXX e a senha informada.');
      return;
    }

    setError(null);
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-[var(--color-brand-dark)] p-5 text-white">
          <div className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/c5XQ7TW.jpeg"
              alt="Logo EAC"
              className="h-11 w-11 rounded-md object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs opacity-80">Sistema</p>
              <h1 className="text-sm font-semibold leading-tight">Confirmacao Visitacao Novos adolescentes</h1>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 text-sm flex items-center gap-2">
            <Car size={16} />
            Login por carro (carroXX)
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Usuario</span>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="carro01"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-dark)]/20"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Senha</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="car123456"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-dark)]/20"
                />
              </div>
            </label>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-[var(--color-brand-accent)] text-sm font-semibold text-slate-900 hover:brightness-95"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
