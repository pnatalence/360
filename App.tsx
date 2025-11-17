import React, { useState, useCallback, useEffect } from 'react';
import { SidebarIcon, MenuIcon, XIcon, SparklesIcon, SearchIcon, ErrorIcon, WarningIcon, AnnouncementIcon } from './components/icons';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Clients from './components/Clients';
import Products from './components/Products';
import Settings from './components/Settings';
import Company from './components/Company';
import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import type { View } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [view, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialAction, setInitialAction] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSetView = (targetView: View, action: string | null = null) => {
    setView(targetView);
    setInitialAction(action);
    setIsChatOpen(false); // Close chat on navigation
  };

  const clearInitialAction = () => setInitialAction(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderView = useCallback(() => {
    switch (view) {
      case 'dashboard':
        return <Dashboard setView={handleSetView}/>;
      case 'invoices':
        return <Invoices initialAction={initialAction} clearInitialAction={clearInitialAction} />;
      case 'clients':
        return <Clients initialAction={initialAction} clearInitialAction={clearInitialAction} />;
      case 'products':
        return <Products initialAction={initialAction} clearInitialAction={clearInitialAction} />;
      case 'company':
        return <Company />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      default:
        return <Dashboard setView={handleSetView} />;
    }
  }, [view, initialAction, theme]);

  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onLogin={() => setIsAuthenticated(true)} onGoToSignup={() => setAuthView('signup')} />;
    }
    if (authView === 'signup') {
      return <SignupPage onSignup={() => setIsAuthenticated(true)} onGoToLogin={() => setAuthView('login')} />;
    }
    return <LandingPage onLogin={() => setAuthView('login')} onSignup={() => setAuthView('signup')} />;
  }

  return (
    <>
      <div className="flex h-screen bg-white dark:bg-gray-900 font-sans">
        <Sidebar
          view={view}
          setView={handleSetView}
          isOpen={isSidebarOpen}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header 
            toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} setView={handleSetView} />
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 bg-[#7C3AED] text-white p-4 rounded-full shadow-lg hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 z-50 transition-all transform hover:scale-110 ${isChatOpen ? 'hidden md:block' : 'block'}`}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? <XIcon className="h-6 w-6" /> : <SparklesIcon className="h-6 w-6" />}
      </button>
    </>
  );
};

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  isOpen: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, isOpen, isMobileOpen, setIsMobileOpen }) => {
  const NavItem = ({ icon, label, id }: { icon: React.ReactNode, label: string, id: View }) => (
    <button
      onClick={() => { setView(id); setIsMobileOpen(false); }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group ${
        view === id ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {icon}
      <span className={`${isOpen || isMobileOpen ? 'ml-3' : 'hidden'}`}>{label}</span>
    </button>
  );

  const notifications = [
    {
      type: 'error',
      title: 'Falha na Fatura',
      message: 'A fatura #2024-002 não foi enviada.',
    },
    {
      type: 'warning',
      title: 'Pagamento em Atraso',
      message: 'O cliente Digital Wave tem um pagamento pendente.',
    },
    {
      type: 'announcement',
      title: 'Nova Funcionalidade',
      message: 'Agora pode exportar relatórios anuais.',
    },
  ];

  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'error':
            return <ErrorIcon className="h-5 w-5 text-red-500 dark:text-red-400" />;
        case 'warning':
            return <WarningIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
        case 'announcement':
            return <AnnouncementIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
        default:
            return null;
    }
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden ${isMobile ? '' : 'border border-gray-200 dark:border-gray-700 rounded-xl'}`}>
      <div className={`flex items-center h-16 px-4 flex-shrink-0 ${isOpen || isMobileOpen ? 'justify-between' : 'justify-center'}`}>
        <div className={`flex items-center ${(isOpen || isMobileOpen) ? '' : 'hidden'}`}>
          <SidebarIcon.Logo className="h-8 w-8 text-green-700 dark:text-green-500" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Clique 360</span>
        </div>
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <XIcon className="h-6 w-6"/>
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
        <p className={`text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 pb-2 ${isOpen || isMobileOpen ? '' : 'text-center'}`}>Menu</p>
        <NavItem icon={<SidebarIcon.Dashboard className="h-5 w-5" />} label="Início" id="dashboard" />
        <NavItem icon={<SidebarIcon.Invoices className="h-5 w-5" />} label="Faturas" id="invoices" />
        <NavItem icon={<SidebarIcon.Clients className="h-5 w-5" />} label="Clientes" id="clients" />
        <NavItem icon={<SidebarIcon.Products className="h-5 w-5" />} label="Produtos" id="products" />
        <NavItem icon={<SidebarIcon.Company className="h-5 w-5" />} label="Empresa" id="company" />
        <NavItem icon={<SidebarIcon.Settings className="h-5 w-5" />} label="Definições" id="settings" />
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className={`text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 pb-2 ${isOpen || isMobileOpen ? '' : 'text-center'}`}>Notificações</p>
        <div className={`space-y-1 ${(isOpen || isMobileOpen) ? '' : 'hidden'}`}>
            {notifications.map((notification, index) => (
                <div key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex-shrink-0 mt-0.5">
                        <NotificationIcon type={notification.type} />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <>
        <aside className={`transition-all duration-300 ease-in-out hidden md:block ${isOpen ? 'w-64' : 'w-20'} my-4 ml-4`}>
            {sidebarContent(false)}
        </aside>
        {isMobileOpen && (
             <div className="fixed inset-0 z-40 md:hidden">
                <aside className="w-full h-full">
                    {sidebarContent(true)}
                </aside>
            </div>
        )}
    </>
  );
};

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
    return (
        <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-900 px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center">
                <button onClick={toggleMobileMenu} className="md:hidden mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <MenuIcon className="h-6 w-6"/>
                </button>
            </div>
            <div className="flex items-center justify-end w-full">
              <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex items-center ml-6">
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors overflow-hidden">
                  <img className="h-9 w-9 object-cover" src="https://i.pravatar.cc/100?u=ana-silva" alt="User Avatar" />
                  <div className="hidden sm:block ml-3 pr-6">
                      <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">Ana Silva</p>
                  </div>
              </div>
            </div>
        </header>
    );
};

export default App;