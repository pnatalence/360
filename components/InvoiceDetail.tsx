
import React, { useState, useEffect } from 'react';
import type { Invoice, InvoiceStatus } from '../types';
import { 
    XIcon, PrinterIcon, DownloadIcon, AceStudioLogo, ArrowUpIcon, ArrowDownIcon,
    AddressIcon, GlobeIcon, TaxIdIcon, WalletIcon, CreditCardIcon, BankIcon
} from './icons';
import { getCompanyPaymentMethods, formatCurrency } from '../services/mockApi';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
}

const InfoChip: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 font-medium">
        {children}
    </div>
);

const DetailItem: React.FC<{icon: React.ReactNode; label: string; children: React.ReactNode;}> = ({ icon, label, children }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-gray-400 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            {children}
        </div>
    </div>
);

const SignatureSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="150" height="50" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 56.5C15.5 56.5 28.5 42 42.5 43C56.5 44 53 60 62.5 57C72 54 82 35.5 95 35.5C108 35.5 111.5 54.5 123.5 54.5C135.5 54.5 139.5 46 148 46C156.5 46 161 54.5 170 54.5C179 54.5 190.5 29.5 208.5 29.5C226.5 29.5 231.5 59 242 59C252.5 59 259.5 49 266.5 49C273.5 49 277.5 56 282 56" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);


const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  const [paymentMethods, setPaymentMethods] = useState({
    multicaixa: true,
    bankTransfer: true,
    cash: false,
  });

  useEffect(() => {
    getCompanyPaymentMethods().then(methods => {
        setPaymentMethods(methods);
    });
  }, []);
    
  const subtotal = invoice.lines.reduce((acc, line) => acc + line.line_total, 0);
  const taxAmount = invoice.lines.reduce((acc, line) => acc + (line.line_total * (line.tax_rate / 100)), 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };
  
  const invoiceYear = new Date(invoice.date).getFullYear();

  const getStatusInfo = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return { text: 'Paga', color: 'bg-green-500' };
      case 'cancelled':
        return { text: 'Anulada', color: 'bg-red-500' };
      default:
        return { text: 'Não Paga', color: 'bg-yellow-500' };
    }
  };
  const currentStatus = getStatusInfo(invoice.status);

  const fromParty = {
      name: "Ace Studio",
      email: "Pay@Acestudio.pro",
      address: "Atatürk Mh.",
      city: "Karesi",
      state: "Balikesir",
      zip: "10010",
      taxId: "93401RS"
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 rounded-t-xl flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fatura {invoice.number}</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-1.5 px-3 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                <PrinterIcon className="w-4 h-4 mr-2" />
                Imprimir
            </button>
             <button className="flex items-center bg-green-600 text-white font-semibold py-1.5 px-3 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Descarregar
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="sr-only">Fechar</span>
                <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-10 overflow-y-auto" id="invoice-content">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">Ace Studio</span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                    <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Número da Fatura</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{invoice.number}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Emitida</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{formatDate(invoice.date)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Data de Vencimento</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{formatDate(invoice.due_date)}</p>
                    </div>
                </div>
            </div>
            
            {/* From/To */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From Card */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                        <ArrowUpIcon className="w-4 h-4"/><span>De</span>
                    </div>
                    <div className="mt-4">
                        <p className="font-bold text-gray-900 dark:text-white">{fromParty.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{fromParty.email}</p>
                    </div>
                    <div className="mt-5 space-y-4">
                        <DetailItem icon={<AddressIcon className="w-5 h-5"/>} label="Morada"><InfoChip>{fromParty.address}</InfoChip></DetailItem>
                        <DetailItem icon={<GlobeIcon className="w-5 h-5"/>} label="Cidade, Província, C. Postal"><InfoChip>{fromParty.city}, {fromParty.state}, {fromParty.zip}</InfoChip></DetailItem>
                        <DetailItem icon={<TaxIdIcon className="w-5 h-5"/>} label="NIF"><InfoChip>{fromParty.taxId}</InfoChip></DetailItem>
                    </div>
                </div>

                {/* To Card */}
                 <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                        <ArrowDownIcon className="w-4 h-4"/><span>Para</span>
                    </div>
                    <div className="mt-4">
                        <p className="font-bold text-gray-900 dark:text-white">{invoice.client.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.email}</p>
                    </div>
                    <div className="mt-5 space-y-4">
                        <DetailItem icon={<AddressIcon className="w-5 h-5"/>} label="Morada"><InfoChip>{invoice.client.address}</InfoChip></DetailItem>
                        <DetailItem icon={<GlobeIcon className="w-5 h-5"/>} label="Cidade, Província, C. Postal"><InfoChip>{invoice.client.city}, {invoice.client.state}, {invoice.client.zip}</InfoChip></DetailItem>
                        <DetailItem icon={<TaxIdIcon className="w-5 h-5"/>} label="NIF"><InfoChip>{invoice.client.tax_id}</InfoChip></DetailItem>
                    </div>
                </div>
            </div>

            {/* Items Table */}
             <div className="mt-10">
                <table className="w-full text-left">
                    <thead>
                    <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <th className="p-4 pl-0">Descrição</th>
                        <th className="p-4 text-right">Qtd</th>
                        <th className="p-4 text-right">Preço</th>
                        <th className="p-4 pr-0 text-right">Valor</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {invoice.lines.map((line) => (
                        <tr key={line.id} className="text-sm text-gray-800 dark:text-gray-200">
                            <td className="p-4 pl-0 font-semibold">
                                {line.description}
                            </td>
                            <td className="p-4 text-right">{line.quantity}</td>
                            <td className="p-4 text-right">{formatCurrency(line.unit_price, invoice.currency)}</td>
                            <td className="p-4 pr-0 text-right font-semibold">{formatCurrency(line.line_total, invoice.currency)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Signature */}
            <div className="mt-4 grid grid-cols-2 items-end">
                <div className="pt-8">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Assinatura</p>
                    <SignatureSVG className="mt-2"/>
                </div>
                <div className="text-right space-y-3">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(subtotal, invoice.currency)}</span>
                    </div>
                     {taxAmount > 0 && (
                         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Imposto</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(taxAmount, invoice.currency)}</span>
                        </div>
                    )}
                    {invoice.discount && (
                         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Desconto</span>
                            <span className="font-medium text-red-500">-{formatCurrency(invoice.discount, invoice.currency)}</span>
                        </div>
                    )}
                     <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span>Total</span>
                        <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                    </div>
                </div>
            </div>
            
            {/* Payment Info */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Estado</p>
                    <div className="mt-3 flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentStatus.color}`}></span>
                        <span className="font-semibold text-gray-800 dark:text-white">{currentStatus.text}</span>
                    </div>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Forma de pagamento disponível</p>
                     <div className="mt-3 space-y-3">
                        <div className="flex items-center space-x-2">
                           <CreditCardIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                           <span className="text-sm text-gray-500 dark:text-gray-400">Multicaixa</span>
                           <span className="font-semibold text-gray-800 dark:text-white text-sm">{paymentMethods.multicaixa ? 'Sim' : 'Não'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <BankIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                           <span className="text-sm text-gray-500 dark:text-gray-400">Transferência</span>
                           <span className="font-semibold text-gray-800 dark:text-white text-sm">{paymentMethods.bankTransfer ? 'Sim' : 'Não'}</span>
                        </div>
                         <div className="flex items-center space-x-2">
                           <WalletIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                           <span className="text-sm text-gray-500 dark:text-gray-400">Dinheiro</span>
                           <span className="font-semibold text-gray-800 dark:text-white text-sm">{paymentMethods.cash ? 'Sim' : 'Não'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Feito com <strong>Clique 360</strong> - {invoiceYear}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;