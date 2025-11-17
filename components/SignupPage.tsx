import React, { useState } from 'react';
import { SidebarIcon } from './icons';

interface SignupPageProps {
  onSignup: () => void;
  onGoToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    // Simular registo bem-sucedido
    onSignup();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <SidebarIcon.Logo className="h-12 w-12 mx-auto text-green-700 dark:text-green-500" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Crie a sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Comece a sua jornada para uma faturação mais inteligente.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ana Silva"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereço de email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="voce@empresa.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Pelo menos 8 caracteres"
                />
              </div>
            </div>
             <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar senha
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repita a sua senha"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                Eu concordo com os <a href="#" className="text-green-600 hover:text-green-500">Termos de Serviço</a> e <a href="#" className="text-green-600 hover:text-green-500">Política de Privacidade</a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Criar Conta
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <button onClick={onGoToLogin} className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                Inicie sessão
            </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
