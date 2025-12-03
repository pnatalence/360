
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-left transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
);

const IndustryCard: React.FC<{ title: string; image: string; icon: React.ReactNode }> = ({ title, image, icon }) => (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/5] cursor-pointer">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10"></div>
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col items-center text-center">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ name: string; role: string; quote: string; image: string }> = ({ name, role, quote, image }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-4">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-green-100 dark:border-green-900" />
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
        </div>
        <div className="flex-1">
             <svg className="w-8 h-8 text-green-200 dark:text-green-900/50 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.062 14.929 15.498C15.537 14.934 16.501 14.494 17.821 14.178V10.368C16.541 10.368 15.537 9.874 14.809 8.886C14.081 7.898 13.717 6.498 13.717 4.686V2H21.941V10.584C21.941 13.104 21.325 15.012 20.093 16.308C18.861 17.604 17.241 18.252 15.233 18.252V21H14.017ZM3.017 21L3.017 18C3.017 16.896 3.321 16.062 3.929 15.498C4.537 14.934 5.501 14.494 6.821 14.178V10.368C5.541 10.368 4.537 9.874 3.809 8.886C3.081 7.898 2.717 6.498 2.717 4.686V2H10.941V10.584C10.941 13.104 10.325 15.012 9.093 16.308C7.861 17.604 6.241 18.252 4.233 18.252V21H3.017Z" /></svg>
            <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{quote}"</p>
        </div>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 min-h-screen font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 transition-all">
        <div className="flex items-center space-x-2">
            <div className="bg-green-600 rounded-lg p-1">
                <SidebarIcon.Logo className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Clique 360</span>
        </div>
        <div className="flex items-center space-x-3 md:space-x-6">
            <button onClick={onLogin} className="hidden md:block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Iniciar Sessão
            </button>
            <button onClick={onSignup} className="bg-gray-900 dark:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-green-700 transition-all hover:shadow-green-500/20 text-sm">
                Começar Grátis
            </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 opacity-30 dark:opacity-10 translate-x-1/3 -translate-y-1/4">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] text-green-200 fill-current">
                    <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.2C93.5,8.9,82,22.1,70.8,33.6C59.6,45.1,48.8,54.9,36.7,62.8C24.6,70.7,11.2,76.7,-1.6,79.5C-14.4,82.3,-27.4,81.9,-39.6,75.5C-51.8,69.1,-63.2,56.7,-71.6,42.6C-80,28.5,-85.4,12.7,-83.6,-2.4C-81.9,-17.5,-72.9,-31.9,-62.1,-43.3C-51.3,-54.7,-38.7,-63.1,-25.8,-71.1C-12.9,-79.1,0.3,-86.7,14.3,-86.4C28.3,-86.1,43,-77.9,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="text-center lg:text-left">
                     <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold mb-8 border border-green-200 dark:border-green-800 shadow-sm">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        <span>A sua oficina de bolso, agora com IA</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                        Fature na obra, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">receba no ato.</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        A app nº1 para Eletricistas, Canalizadores e Técnicos em Portugal. Acabe com a papelada à noite. Dite para o telemóvel e a IA faz a fatura.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <button onClick={onSignup} className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:bg-green-700 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center">
                            Criar Conta Grátis
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </button>
                        <button onClick={onLogin} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 px-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-lg">
                            Ver Demonstração
                        </button>
                    </div>
                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                         <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                         <span>Sem cartão de crédito • Certificado AT</span>
                    </p>
                </div>
                
                <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                    {/* Main Hero Image */}
                    <div className="relative w-full max-w-md lg:max-w-full aspect-[4/5] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                        <img 
                            src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop" 
                            alt="Profissional a usar telemóvel na obra" 
                            className="w-full h-full object-cover"
                        />
                         {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Floating Element 1: Invoice Sent */}
                        <div className="absolute bottom-8 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 dark:bg-green-900/50 p-2.5 rounded-full text-green-600 dark:text-green-400">
                                    <CheckBadgeIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Fatura FT 2024/128</p>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Enviada com sucesso!</p>
                                </div>
                                <div className="ml-auto text-right">
                                     <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                                     <p className="font-bold text-gray-900 dark:text-white">150,00 €</p>
                                </div>
                            </div>
                        </div>

                         {/* Floating Element 2: Voice Command */}
                        <div className="absolute top-8 right-[-20px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md py-2 px-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2 animate-bounce [animation-duration:3s]">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">"Criar fatura para Sr. João..."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Industry Section */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-20 border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Feito para a sua profissão</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Personalizado para quem trabalha no terreno. Esqueça o software de escritório complicado.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <IndustryCard 
                        title="Eletricistas" 
                        image="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
                        icon={<BoltIcon className="w-6 h-6" />}
                    />
                    <IndustryCard 
                        title="Canalizadores" 
                        image="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000&auto=format&fit=crop"
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                    />
                    <IndustryCard 
                        title="Climatização" 
                        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1000&auto=format&fit=crop"
                        icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
                    />
                    <IndustryCard 
                        title="Limpezas" 
                        image="https://images.unsplash.com/photo-1686178827149-6d55c72d81df?q=80&w=1740&auto=format&fit=crop"
                        icon={<HomeModernIcon className="w-6 h-6" />}
                    />
                </div>
            </div>
        </section>
        
        {/* Problem/Solution Section */}
        <section className="py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                         <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop" 
                                alt="Pai a brincar com filho, tempo livre" 
                                className="relative rounded-3xl shadow-2xl w-full object-cover"
                            />
                            <div className="absolute -bottom-6 -left-6 md:bottom-10 md:left-10 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-xl max-w-xs">
                                <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">Recupere o seu tempo</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Os nossos clientes poupam em média <span className="text-green-600 font-bold">4 horas/semana</span> em burocracia.</p>
                            </div>
                         </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Odeia chegar a casa e ter <span className="text-green-600">faturas para fazer?</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Sabemos como é. Passa o dia a trabalhar no duro e à noite ainda tem de ser contabilista. Com o Clique 360, esse problema acabou.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <FeatureCard icon={<SparklesIcon className="w-5 h-5" />} title="Mãos sujas? Use a voz">
                                Assistente IA para criar faturas enquanto conduz ou arruma a ferramenta.
                            </FeatureCard>
                            <FeatureCard icon={<BanknotesIcon className="w-5 h-5" />} title="Controlo de Caixa">
                                Saiba quem pagou e quem deve sem abrir o Excel.
                            </FeatureCard>
                            <FeatureCard icon={<SidebarIcon.Dashboard className="w-5 h-5" />} title="Clientes Organizados">
                                Histórico completo e navegação GPS até à morada.
                            </FeatureCard>
                            <FeatureCard icon={<BoltIcon className="w-5 h-5" />} title="Orçamentos Rápidos">
                                Converta orçamentos em faturas num clique.
                            </FeatureCard>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section (New) */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
             <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Quem usa, recomenda</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard 
                        name="Carlos Mendes"
                        role="Eletricista Certificado"
                        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                        quote="Antes perdia os sábados de manhã a passar faturas no computador. Agora faço tudo no telemóvel mal acabo o serviço. Mudou a minha vida."
                    />
                    <TestimonialCard 
                        name="Sandra Ferreira"
                        role="Empresa de Limpezas"
                        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                        quote="A melhor parte é saber quem me deve dinheiro. O assistente lembra-me das faturas em atraso e eu envio o aviso num clique."
                    />
                    <TestimonialCard 
                        name="Miguel Torres"
                        role="Técnico de Reparações"
                        image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
                        quote="Simples, rápido e cumpre a lei. O meu contabilista recebe tudo automaticamente no fim do mês. Recomendo a todos os colegas."
                    />
                </div>
             </div>
        </section>
        
        {/* CTA Bottom */}
        <section className="relative py-24 px-4 overflow-hidden">
             <div className="absolute inset-0 bg-green-600">
                 <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="" className="opacity-10 absolute inset-0 w-full h-full" />
                 <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-90"></div>
             </div>
             <div className="relative max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">A ferramenta que faltava na sua caixa.</h2>
                <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto">
                    Junte-se a milhares de prestadores de serviços que recuperaram as suas noites e fins-de-semana.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={onSignup} className="bg-white text-green-700 font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-gray-50 transition-transform transform hover:scale-105 text-lg">
                        Começar Agora (Grátis)
                    </button>
                </div>
                <p className="mt-6 text-sm text-green-200 opacity-80">Plano grátis para sempre disponível. Não pedimos cartão.</p>
            </div>
        </section>
      </main>

      <footer className="py-12 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                 <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg">
                    <SidebarIcon.Logo className="h-6 w-6 text-green-700 dark:text-green-500" />
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white text-lg">Clique 360</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Privacidade</a>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Termos</a>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Suporte</a>
            </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-400">
            &copy; 2024 Clique 360. Feito com ❤️ para quem trabalha.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
