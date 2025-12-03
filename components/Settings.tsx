
import React, { useState, useEffect } from 'react';

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <div className="md:col-span-2">{children}</div>
    </div>
);

const TextInput = ({ id, value, onChange, type = 'text' }: { id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }) => (
    <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
);

const SelectInput: React.FC<{ id: string, defaultValue: string; children: React.ReactNode }> = ({ id, children, defaultValue }) => (
     <select
        id={id}
        defaultValue={defaultValue}
        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-no-repeat [background-position:right_0.5rem_center] [background-size:1.5em_1.5em] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236B7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] dark:bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%239CA3AF%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')]"
     >
        {children}
    </select>
);

const ToggleSwitch = ({ enabled, setEnabled }: {enabled: boolean, setEnabled: (enabled: boolean) => void}) => (
    <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`${enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`}
        role="switch"
        aria-checked={enabled}
    >
        <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const SectionCard: React.FC<{ title: string, footer?: React.ReactNode; children: React.ReactNode }> = ({ title, children, footer }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
        {footer && <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-xl text-right">{footer}</div>}
    </div>
);

interface SettingsProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
    const [profile, setProfile] = useState({
        fullName: 'Ana Silva',
        email: 'ana.silva@clique360.com',
        position: 'Gestora de Contas',
    });

    const [overdueInvoiceEmails, setOverdueInvoiceEmails] = useState(true);
    const [paymentPushNotifications, setPaymentPushNotifications] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({...prev, [e.target.id]: e.target.value}));
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Definições</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Gira as suas informações de perfil, preferências e notificações.</p>
            </div>
            <SectionCard 
                title="Perfil" 
                footer={
                    <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                        Guardar Alterações
                    </button>
                }
            >
                <div className="flex items-center space-x-4">
                    <img className="h-16 w-16 rounded-full object-cover" src="https://i.pravatar.cc/100?u=ana-silva" alt="User Avatar" />
                    <div>
                        <button className="text-sm font-semibold text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">Alterar Foto</button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, GIF ou PNG. 1MB max.</p>
                    </div>
                </div>
                <FormRow label="Nome Completo">
                    <TextInput id="fullName" value={profile.fullName} onChange={handleProfileChange} />
                </FormRow>
                <FormRow label="Email">
                    <TextInput id="email" value={profile.email} onChange={handleProfileChange} type="email" />
                </FormRow>
                <FormRow label="Cargo">
                     <TextInput id="position" value={profile.position} onChange={handleProfileChange} />
                </FormRow>
            </SectionCard>

            <SectionCard title="Preferências da Aplicação">
                <FormRow label="Idioma">
                    <SelectInput id="language" defaultValue="pt-pt">
                        <option value="pt-pt">Português (Portugal)</option>
                        <option value="en-us">Inglês (EUA)</option>
                    </SelectInput>
                </FormRow>
                <FormRow label="Moeda Padrão">
                     <SelectInput id="currency" defaultValue="AOA">
                        <option value="AOA">AOA - Kwanza Angolano</option>
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                    </SelectInput>
                </FormRow>
                 <FormRow label="Tema">
                    <div className="flex space-x-2">
                         <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-md text-sm font-medium border ${theme === 'light' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                            Claro
                        </button>
                        <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-md text-sm font-medium border ${theme === 'dark' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                            Escuro
                        </button>
                    </div>
                </FormRow>
            </SectionCard>

            <SectionCard title="Notificações">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-200">Email sobre faturas vencidas</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba um lembrete por email quando uma fatura ultrapassar a data de vencimento.</p>
                    </div>
                    <ToggleSwitch enabled={overdueInvoiceEmails} setEnabled={setOverdueInvoiceEmails} />
                </div>
                 <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-200">Notificações push para pagamentos</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba uma notificação no seu dispositivo quando um pagamento for recebido.</p>
                    </div>
                    <ToggleSwitch enabled={paymentPushNotifications} setEnabled={setPaymentPushNotifications} />
                </div>
                 <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-200">Resumo semanal por email</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba um resumo da sua atividade de faturação todas as semanas.</p>
                    </div>
                    <ToggleSwitch enabled={weeklySummary} setEnabled={setWeeklySummary} />
                </div>
            </SectionCard>

        </div>
    );
};

export default Settings;
