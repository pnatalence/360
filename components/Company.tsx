import React, { useState, useEffect } from 'react';
import { getCompanyPaymentMethods, saveCompanyPaymentMethods } from '../services/mockApi';

const FormRow: React.FC<{ label: string }> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-start md:items-center gap-2 md:gap-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <div className="md:col-span-2">{children}</div>
    </div>
);

const TextInput = ({ id, value, onChange, type = 'text', placeholder = '' }: { id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }) => (
    <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
);

const ToggleSwitch = ({ enabled, setEnabled }: {enabled: boolean, setEnabled: (enabled: boolean) => void}) => (
    <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`${enabled ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`}
        role="switch"
        aria-checked={enabled}
    >
        <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const SectionCard: React.FC<{ title: string, footer?: React.ReactNode }> = ({ title, children, footer }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
        {footer && <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-xl text-right">{footer}</div>}
    </div>
);

const Company: React.FC = () => {
    // State for company information
    const [companyInfo, setCompanyInfo] = useState({
        name: 'Clique 360 Lda.',
        taxId: 'PT509123456',
        email: 'geral@clique360.com',
        phone: '+351 912 345 678',
        address: 'Avenida da Inovação, 123',
        city: 'Lisboa',
        state: 'Lisboa',
        zip: '1000-001',
        country: 'Portugal',
        defaultTaxRate: '23',
    });

    // State for payment methods
    const [paymentMethods, setPaymentMethods] = useState({
        multicaixa: true,
        bankTransfer: true,
        cash: false,
    });
    
    // State for logo
    const [logo, setLogo] = useState<string | null>('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDU5NjZCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIgLz48L3N2Zz4='); // Default logo as base64

    useEffect(() => {
        getCompanyPaymentMethods().then(methods => {
            setPaymentMethods(methods);
        });
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSavePayments = () => {
        saveCompanyPaymentMethods(paymentMethods).then(() => {
            alert('Métodos de pagamento guardados com sucesso!');
        });
    };

    const SaveButton = ({ onClick }: { onClick?: () => void }) => (
        <button onClick={onClick} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
            Guardar Alterações
        </button>
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Empresa</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Gira as informações da sua empresa que aparecerão nas faturas.</p>
            </div>

            <SectionCard 
                title="Informações da Empresa" 
                footer={<SaveButton />}
            >
                <FormRow label="Logo">
                     <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                           {logo ? <img className="h-full w-full object-contain" src={logo} alt="Company Logo" /> : <span className="text-xs text-gray-500">Logo</span>}
                        </div>
                        <div>
                            <input type="file" id="logo-upload" className="hidden" accept="image/png, image/jpeg, image/gif, image/svg+xml" onChange={handleLogoChange} />
                            <label htmlFor="logo-upload" className="cursor-pointer text-sm font-semibold text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                                Carregar Logo
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, SVG. 2MB max.</p>
                        </div>
                    </div>
                </FormRow>
                <FormRow label="Nome da Empresa">
                    <TextInput id="name" value={companyInfo.name} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="NIF">
                    <TextInput id="taxId" value={companyInfo.taxId} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="Email de Contacto">
                    <TextInput id="email" value={companyInfo.email} onChange={handleInfoChange} type="email" />
                </FormRow>
                 <FormRow label="Telefone">
                    <TextInput id="phone" value={companyInfo.phone} onChange={handleInfoChange} type="tel" />
                </FormRow>
            </SectionCard>

             <SectionCard 
                title="Endereço"
                footer={<SaveButton />}
            >
                <FormRow label="Morada">
                    <TextInput id="address" value={companyInfo.address} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="Cidade">
                    <TextInput id="city" value={companyInfo.city} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="Província / Estado">
                    <TextInput id="state" value={companyInfo.state} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="Código Postal">
                    <TextInput id="zip" value={companyInfo.zip} onChange={handleInfoChange} />
                </FormRow>
                <FormRow label="País">
                    <TextInput id="country" value={companyInfo.country} onChange={handleInfoChange} />
                </FormRow>
            </SectionCard>
            
            <SectionCard 
                title="Faturação e Pagamentos"
                footer={<SaveButton onClick={handleSavePayments} />}
            >
                <FormRow label="Taxa de Imposto Padrão (%)">
                    <TextInput id="defaultTaxRate" value={companyInfo.defaultTaxRate} onChange={handleInfoChange} type="number" />
                </FormRow>
                <FormRow label="Formas de Pagamento Aceites">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">Multicaixa</p>
                            <ToggleSwitch enabled={paymentMethods.multicaixa} setEnabled={(val) => setPaymentMethods(p => ({...p, multicaixa: val}))} />
                        </div>
                         <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">Transferência Bancária</p>
                            <ToggleSwitch enabled={paymentMethods.bankTransfer} setEnabled={(val) => setPaymentMethods(p => ({...p, bankTransfer: val}))} />
                        </div>
                         <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">Dinheiro</p>
                            <ToggleSwitch enabled={paymentMethods.cash} setEnabled={(val) => setPaymentMethods(p => ({...p, cash: val}))} />
                        </div>
                    </div>
                </FormRow>
            </SectionCard>
        </div>
    );
};

export default Company;