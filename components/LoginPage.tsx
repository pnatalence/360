import React, { useState } from 'react';
import { SidebarIcon, GoogleIcon } from './icons';

interface LoginPageProps {
  onLogin: () => void;
  onGoToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui normalmente lidaria com a lógica de autenticação
    // Para este exemplo, apenas chamaremos o callback onLogin
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <SidebarIcon.Logo className="h-12 w-12 mx-auto text-green-700 dark:text-green-500" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Inicie sessão para continuar a gerir as suas faturas.
            </p>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="********"
                    />
                </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Lembrar-me
                </label>
                </div>

                <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                    Esqueceu a sua senha?
                </a>
                </div>
            </div>

            <div>
                <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                Iniciar Sessão
                </button>
            </div>
            </form>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">OU</span>
                </div>
            </div>

            <div>
                <button
                    onClick={onLogin}
                    type="button"
                    className="group relative flex w-full justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    <GoogleIcon className="h-5 w-5 mr-3" />
                    Entrar com Google
                </button>
            </div>
        </div>
         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Ainda não tem uma conta?{' '}
            <button onClick={onGoToSignup} className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                Crie uma agora
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;