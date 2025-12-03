
import React, { useState, useEffect, useMemo } from 'react';
import type { Client, Product, InvoiceLine } from '../types';
import { getClients, getProducts, addInvoice, formatCurrency } from '../services/mockApi';
import { TrashIcon } from './icons';
import LoadingModal from './LoadingModal';

interface CreateInvoiceProps {
  onClose: () => void;
}

const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 border-transparent rounded-lg py-2 px-3 text-sm"/>
    </div>
);

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Invoice State
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [billingDetails, setBillingDetails] = useState({ name: '', address: '', city: '', state: '', zip: '', country: '', tax_id: '' });
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);
    const [discount, setDiscount] = useState(0);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [clientsData, productsData] = await Promise.all([getClients(), getProducts()]);
            setClients(clientsData);
            setProducts(productsData);
            setLoading(false);
        };
        fetchData();
    }, []);
    
    const totals = useMemo(() => {
        const subtotal = invoiceLines.reduce((acc, line) => acc + line.line_total, 0);
        const tax = invoiceLines.reduce((acc, line) => acc + (line.line_total * (line.tax_rate / 100)), 0);
        const total = subtotal + tax - discount;
        return { subtotal, tax, total };
    }, [invoiceLines, discount]);
    
    const handleSaveInvoice = async (status: 'draft' | 'issued' | 'paid') => {
        if (!selectedClient) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        setIsSaving(true);
        try {
            await addInvoice({
                client: selectedClient,
                status,
                date: new Date().toISOString(),
                due_date: new Date(dueDate).toISOString(),
                total: totals.total,
                currency: 'AOA',
                lines: invoiceLines,
                discount
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const renderStepContent = () => {
        if (loading) {
            return <div className="text-center p-8 text-gray-500">A carregar...</div>;
        }
        switch (currentStep) {
            case 1: return <Step1SelectClient clients={clients} selectedClient={selectedClient} setSelectedClient={setSelectedClient} billingDetails={billingDetails} setBillingDetails={setBillingDetails} />;
            case 2: return <Step2AddProducts products={products} invoiceLines={invoiceLines} setInvoiceLines={setInvoiceLines} />;
            case 3: return <Step3Review selectedClient={selectedClient} billingDetails={billingDetails} invoiceLines={invoiceLines} discount={discount} setDiscount={setDiscount} dueDate={dueDate} setDueDate={setDueDate} totals={totals} setCurrentStep={setCurrentStep}/>;
            case 4: return <Step4Payment totals={totals} handleSaveInvoice={handleSaveInvoice} />;
            default: return <div>Passo inválido</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-white md:bg-black md:bg-opacity-50 md:p-4 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 w-full h-full p-6 sm:p-8 md:rounded-xl md:w-full md:max-w-4xl md:h-auto md:max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-8 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-900 dark:bg-green-600 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">Criador de Faturas</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">by Clique 360</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-200 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                        Fechar
                    </button>
                </div>
                
                <div className="flex-1 min-h-[450px] overflow-y-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                    {renderStepContent()}
                </div>

                <div className="mt-12 flex justify-between items-center flex-shrink-0">
                    <button 
                        onClick={() => setCurrentStep(currentStep > 1 ? currentStep - 1 : 1)}
                        disabled={currentStep === 1}
                        className="bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Anterior
                    </button>
                    {currentStep < 3 && (
                        <button 
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={(currentStep === 1 && !selectedClient) || (currentStep === 2 && invoiceLines.length === 0)}
                            className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span>Próximo ({currentStep}/3)</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                    {currentStep === 3 && (
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleSaveInvoice('draft')} className="bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                                Guardar Rascunho
                            </button>
                            <button onClick={() => setCurrentStep(4)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                                Pagar Agora
                            </button>
                            <button onClick={() => handleSaveInvoice('issued')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                                Emitir Fatura
                            </button>
                        </div>
                    )}
                    {currentStep === 4 && (
                        <button onClick={() => handleSaveInvoice('paid')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                            Confirmar Pagamento
                        </button>
                    )}
                </div>
            </div>
            <LoadingModal isOpen={isSaving} message="A processar fatura..." />
        </div>
    );
};

const Step1SelectClient = ({ clients, selectedClient, setSelectedClient, billingDetails, setBillingDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.tax_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectClient = (client: Client) => {
        setSelectedClient(client);
        setBillingDetails({
            name: client.name,
            address: client.address || '',
            city: client.city || '',
            state: client.state || '',
            zip: client.zip || '',
            country: client.country || '',
            tax_id: client.tax_id,
        });
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Selecionar Cliente</h2>
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou NIF..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-transparent rounded-lg py-3 px-4 text-sm mb-4"
                />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredClients.map(client => (
                        <div key={client.id} onClick={() => handleSelectClient(client)} className={`p-3 rounded-lg cursor-pointer ${selectedClient?.id === client.id ? 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 border' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{client.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{client.tax_id}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Endereço de Faturação</h2>
                {selectedClient ? (
                    <div className="space-y-4">
                        <InputField label="Nome do Cliente" name="name" value={billingDetails.name} onChange={handleDetailsChange} />
                        <InputField label="NIF" name="tax_id" value={billingDetails.tax_id} onChange={handleDetailsChange} />
                        <InputField label="Morada" name="address" value={billingDetails.address} onChange={handleDetailsChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Cidade" name="city" value={billingDetails.city} onChange={handleDetailsChange} />
                            <InputField label="Província" name="state" value={billingDetails.state} onChange={handleDetailsChange} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <InputField label="Código Postal" name="zip" value={billingDetails.zip} onChange={handleDetailsChange} />
                            <InputField label="País" name="country" value={billingDetails.country} onChange={handleDetailsChange} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Selecione um cliente para ver e editar os seus detalhes de faturação.</p>
                )}
            </div>
        </div>
    );
};

const Step2AddProducts = ({ products, invoiceLines, setInvoiceLines }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addProduct = (product: Product) => {
        if (invoiceLines.find(line => line.product_id === product.id)) return;
        const newLine: InvoiceLine = {
            id: `line-${Date.now()}`,
            product_id: product.id,
            description: product.name,
            quantity: 1,
            unit_price: product.unit_price,
            tax_rate: product.tax_rate,
            line_total: product.unit_price,
        };
        setInvoiceLines(prev => [...prev, newLine]);
    };
    
    const updateQuantity = (productId: string, quantity: number) => {
        setInvoiceLines(prev => prev.map(line => 
            line.product_id === productId ? { ...line, quantity, line_total: line.unit_price * quantity } : line
        ));
    };
    
    const removeProduct = (productId: string) => {
        setInvoiceLines(prev => prev.filter(line => line.product_id !== productId));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Adicionar Produtos/Serviços</h2>
                <input
                    type="text"
                    placeholder="Pesquisar por código ou nome..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-transparent rounded-lg py-3 px-4 text-sm mb-4"
                />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => addProduct(product)} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.code}</p>
                            </div>
                            <span className="text-sm font-semibold dark:text-gray-300">{formatCurrency(product.unit_price, 'AOA')}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Itens da Fatura</h2>
                 <div className="space-y-3 max-h-96 overflow-y-auto">
                     {invoiceLines.length > 0 ? invoiceLines.map(line => (
                         <div key={line.product_id} className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                             <div>
                                 <p className="font-semibold text-gray-800 dark:text-gray-200">{line.description}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(line.unit_price, 'AOA')}</p>
                             </div>
                             <div className="flex items-center space-x-3">
                                <input 
                                    type="number" 
                                    value={line.quantity} 
                                    onChange={e => updateQuantity(line.product_id, parseInt(e.target.value) || 1)}
                                    className="w-16 text-center bg-gray-100 dark:bg-gray-700 dark:text-white border-transparent rounded-md py-1"
                                    min="1"
                                />
                                <p className="font-semibold w-32 text-right dark:text-gray-300">{formatCurrency(line.line_total, 'AOA')}</p>
                                <button onClick={() => removeProduct(line.product_id)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                             </div>
                         </div>
                     )) : <p className="text-sm text-gray-500 dark:text-gray-400">Adicione produtos da lista à esquerda.</p>}
                 </div>
            </div>
        </div>
    );
};

const Step3Review = ({ selectedClient, billingDetails, invoiceLines, discount, setDiscount, dueDate, setDueDate, totals, setCurrentStep }) => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Resumo da Fatura</h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Cliente</h3>
                        <p className="dark:text-gray-300">{billingDetails.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{billingDetails.address}, {billingDetails.city}</p>
                    </div>
                    <button onClick={() => setCurrentStep(1)} className="text-sm font-semibold text-green-600 hover:underline">Editar</button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Itens</h3>
                        <button onClick={() => setCurrentStep(2)} className="text-sm font-semibold text-green-600 hover:underline">Editar</button>
                    </div>
                    <div className="space-y-2">
                        {invoiceLines.map(line => (
                            <div key={line.id} className="flex justify-between text-sm dark:text-gray-300">
                                <span>{line.description} x {line.quantity}</span>
                                <span>{formatCurrency(line.line_total, 'AOA')}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                     <div className="flex items-center space-x-4">
                        <label htmlFor="discount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Desconto (AOA)</label>
                        <input type="number" id="discount" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-32 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 text-sm text-right"/>
                    </div>
                     <div className="flex items-center space-x-4">
                        <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Vencimento</label>
                        <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-40 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 text-sm"/>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-right">
                    <div className="flex justify-end space-x-4"><span className="text-gray-500 dark:text-gray-400">Subtotal:</span> <span className="w-36 font-medium dark:text-gray-200">{formatCurrency(totals.subtotal, 'AOA')}</span></div>
                    <div className="flex justify-end space-x-4"><span className="text-gray-500 dark:text-gray-400">Imposto:</span> <span className="w-36 font-medium dark:text-gray-200">{formatCurrency(totals.tax, 'AOA')}</span></div>
                    {discount > 0 && <div className="flex justify-end space-x-4"><span className="text-red-500">Desconto:</span> <span className="w-36 font-medium text-red-500">-{formatCurrency(discount, 'AOA')}</span></div>}
                    <div className="flex justify-end space-x-4 text-lg font-bold"><span className="text-gray-800 dark:text-white">Total:</span> <span className="w-36 dark:text-white">{formatCurrency(totals.total, 'AOA')}</span></div>
                </div>
            </div>
        </div>
    );
};

const Step4Payment = ({ totals, handleSaveInvoice }) => {
    const [paymentMethods, setPaymentMethods] = useState([{ method: 'multicaixa', amount: totals.total }]);
    const availableMethods = ['Multicaixa', 'Transferência Bancária', 'Dinheiro'];

    const handleAddPaymentMethod = () => {
        setPaymentMethods(prev => [...prev, { method: 'bank_transfer', amount: 0 }]);
    };

    const handlePaymentChange = (index, field, value) => {
        const newMethods = [...paymentMethods];
        newMethods[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
        setPaymentMethods(newMethods);
    };

    const remainingAmount = totals.total - paymentMethods.reduce((acc, p) => acc + p.amount, 0);

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pagamento</h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                <div className="text-right mb-6">
                    <p className="text-gray-500 dark:text-gray-400">Total a Pagar</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totals.total, 'AOA')}</p>
                </div>
                <div className="space-y-4">
                    {paymentMethods.map((payment, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forma de Pagamento {index + 1}</label>
                                <select value={payment.method} onChange={(e) => handlePaymentChange(index, 'method', e.target.value)} className="w-full bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm">
                                    {availableMethods.map(m => <option key={m} value={m.toLowerCase().replace(' ', '_')}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                                <input type="number" value={payment.amount} onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)} className="w-full bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm"/>
                            </div>
                        </div>
                    ))}
                </div>
                {paymentMethods.length < 2 && (
                    <button onClick={handleAddPaymentMethod} className="text-sm font-semibold text-green-600 hover:underline mt-4">
                        + Adicionar outra forma de pagamento
                    </button>
                )}
                {remainingAmount !== 0 && (
                    <p className={`text-sm mt-4 ${remainingAmount > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {remainingAmount > 0 ? `Faltam ${formatCurrency(remainingAmount, 'AOA')}.` : `Excede ${formatCurrency(-remainingAmount, 'AOA')}.`}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreateInvoice;
