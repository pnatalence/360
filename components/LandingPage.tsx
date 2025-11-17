import React from 'react';
import { SidebarIcon, SparklesIcon, BarChartIcon } from './icons';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

// FIX: Refactored FeatureCard to use a separate props interface and React.FC to properly handle children props.
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
        <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 min-h-screen">
      <header className="p-4 md:px-8 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
            <SidebarIcon.Logo className="h-8 w-8 text-green-700 dark:text-green-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Clique 360</span>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={onLogin} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Iniciar Sessão
            </button>
            <button onClick={onSignup} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                Criar Conta
            </button>
        </div>
      </header>

      <main>
        <section className="text-center py-20 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Faturação Inteligente,
                <br />
                <span className="text-green-600 dark:text-green-500">Potenciada por IA.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Deixe o nosso assistente Gemini tratar da complexidade. Crie faturas, gira clientes e produtos com a simplicidade da linguagem natural.
            </p>
            <button onClick={onSignup} className="mt-8 bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                Comece Grátis
            </button>
        </section>
        
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tudo o que precisa, num só lugar</h2>
                     <p className="mt-4 text-gray-600 dark:text-gray-400">Funcionalidades poderosas concebidas para simplificar o seu fluxo de trabalho.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Assistente IA Gemini">
                        Converse com a sua aplicação. Peça para criar uma fatura ou adicionar um cliente, e veja a magia acontecer.
                    </FeatureCard>
                    <FeatureCard icon={<SidebarIcon.Dashboard className="w-6 h-6" />} title="Gestão Simplificada">
                        Mantenha o controlo total sobre as suas faturas, clientes e produtos com uma interface intuitiva e elegante.
                    </FeatureCard>
                    <FeatureCard icon={<BarChartIcon className="w-6 h-6" />} title="Relatórios e Análises">
                        Obtenha insights valiosos sobre a saúde do seu negócio com dashboards e relatórios fáceis de entender.
                    </FeatureCard>
                </div>
            </div>
        </section>
        
        <section className="text-center py-20 px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pronto para simplificar a sua faturação?</h2>
            <p className="mt-4 max-w-xl mx-auto text-gray-600 dark:text-gray-400">
                Junte-se a centenas de empresas que confiam no Clique 360 para gerir as suas finanças sem esforço.
            </p>
             <button onClick={onSignup} className="mt-8 bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                Crie a sua conta agora
            </button>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2024 Clique 360. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;