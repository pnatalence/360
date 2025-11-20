
import React from 'react';
import { SidebarIcon, SparklesIcon, WrenchScrewdriverIcon, HomeModernIcon, BoltIcon, CheckBadgeIcon, BanknotesIcon } from './icons';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-left transition-transform hover:scale-105">
        <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 min-h-screen font-sans">
      {/* Header */}
      <header className="p-4 md:px-8 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
            <SidebarIcon.Logo className="h-8 w-8 text-green-700 dark:text-green-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Clique 360</span>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={onLogin} className="hidden md:block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Iniciar Sessão
            </button>
            <button onClick={onSignup} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                Começar Grátis
            </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 px-4 max-w-5xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6 border border-green-200 dark:border-green-800">
                <SparklesIcon className="w-4 h-4 mr-2" />
                A sua oficina de bolso, agora com IA
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                Acabe com a papelada <br className="hidden md:block" />
                <span className="text-green-600 dark:text-green-500">sem sair da obra.</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                Faturas, orçamentos e gestão de clientes para <strong>Eletricistas, Canalizadores, Limpezas e Técnicos</strong>. Dite para o telemóvel e a IA faz o resto.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={onSignup} className="bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1 text-lg">
                    Criar Conta Grátis
                </button>
                <button onClick={onLogin} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3.5 px-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-lg">
                    Ver Demonstração
                </button>
            </div>
        </section>

        {/* Audience Banner */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-10 border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                    Ideal para Profissionais de:
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Reparações</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                            <BoltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Eletricidade</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                         <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <HomeModernIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Limpeza Pós-Obra</span>
                    </div>
                     <div className="flex flex-col items-center space-y-2">
                         <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
                            <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Canalização</span>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Pain Points vs Solution */}
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Odeia chegar a casa e ter faturas para fazer?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Sabemos como é. Passa o dia a trabalhar no duro e à noite ainda tem de ser contabilista. Com o Clique 360, esse problema acabou.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Fature no momento, assim que termina o serviço.</span>
                            </li>
                             <li className="flex items-start">
                                <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Envie por email ou WhatsApp antes de virar costas.</span>
                            </li>
                             <li className="flex items-start">
                                <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Pareça mais profissional e seja pago mais rápido.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Mãos sujas? Use a voz">
                            Diga ao assistente: "Fatura de 150€ para o Sr. João por reparação elétrica". Feito.
                        </FeatureCard>
                        <FeatureCard icon={<BanknotesIcon className="w-6 h-6" />} title="Controlo de Caixa">
                            Saiba exatamente quem lhe pagou e quem está a dever, sem abrir folhas de Excel.
                        </FeatureCard>
                        <FeatureCard icon={<SidebarIcon.Dashboard className="w-6 h-6" />} title="Clientes Organizados">
                            Histórico completo de cada cliente e morada na ponta dos dedos.
                        </FeatureCard>
                        <FeatureCard icon={<BoltIcon className="w-6 h-6" />} title="Orçamentos Rápidos">
                            Converta orçamentos em faturas num clique quando o cliente aprovar a obra.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </section>
        
        {/* CTA Bottom */}
        <section className="bg-green-600 py-20 px-4 text-center">
             <div className="max-w-3xl mx-auto text-white">
                <h2 className="text-3xl font-bold mb-6">A ferramenta que faltava na sua caixa.</h2>
                <p className="text-green-100 text-lg mb-8">
                    Junte-se a milhares de prestadores de serviços que recuperaram as suas noites e fins-de-semana.
                </p>
                 <button onClick={onSignup} className="bg-white text-green-700 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-50 transition-transform transform hover:scale-105">
                    Começar Agora (Grátis)
                </button>
                <p className="mt-4 text-sm text-green-200 opacity-80">Não é necessário cartão de crédito.</p>
            </div>
        </section>
      </main>

      <footer className="py-8 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
             <SidebarIcon.Logo className="h-6 w-6 text-green-700 dark:text-green-500" />
             <span className="font-bold text-gray-900 dark:text-white">Clique 360</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2024 Clique 360. Feito para quem trabalha.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
