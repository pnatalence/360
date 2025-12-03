
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
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-500 mt-0.5">{icon}</div>
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

// Mock QR Code for visual purposes only
const QRCodeMock = () => (
    <div className="w-24 h-24 bg-white border-2 border-black p-1">
        <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=PT_AT_MOCK_DATA')] bg-cover"></div>
    </div>
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
      case 'draft':
        return { text: 'Rascunho', color: 'bg-yellow-500' };
      default:
        return { text: 'Emitida', color: 'bg-blue-500' };
    }
  };
  const currentStatus = getStatusInfo(invoice.status);

  const fromParty = {
      name: "Clique 360 Lda.",
      email: "faturacao@clique360.pt",
      address: "Avenida da Inovação, 123",
      city: "Lisboa",
      state: "Lisboa",
      zip: "1000-001",
      taxId: "509123456" // Example PT NIF
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
                PDF
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="sr-only">Fechar</span>
                <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-10 overflow-y-auto relative" id="invoice-content">
            {/* QR Code (Mandatory PT) - Top Right */}
            {invoice.status !== 'draft' && (
                <div className="absolute top-10 right-10 hidden md:block">
                     <QRCodeMock />
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start pr-32">
                <div>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">Clique 360</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Software Certificado nº {invoice.certification_number || '9999'}/AT</p>
                </div>
                <div className="flex flex-col items-end text-sm">
                    <div className="text-right mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">ATCUD</p>
                        <p className="font-mono text-gray-800 dark:text-gray-200 border border-gray-300 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-700">
                            {invoice.atcud || 'RASCUNHO'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Fatura Nº</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{invoice.number}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm border-b border-gray-200 dark:border-gray-700 pb-6">
                <div>
                     <p className="text-gray-500 dark:text-gray-400">Data Emissão</p>
                     <p className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.date)}</p>
                </div>
                 <div>
                     <p className="text-gray-500 dark:text-gray-400">Vencimento</p>
                     <p className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.due_date)}</p>
                </div>
                 <div>
                     <p className="text-gray-500 dark:text-gray-400">Estado</p>
                     <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${currentStatus.color}`}></span>
                        <span className="font-semibold text-gray-800 dark:text-white">{currentStatus.text}</span>
                    </div>
                </div>
            </div>
            
            {/* From/To */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From Card */}
                <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm mb-3">
                        <ArrowUpIcon className="w-4 h-4"/><span>Prestador de Serviços</span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{fromParty.name}</p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p>{fromParty.address}</p>
                        <p>{fromParty.zip} {fromParty.city}</p>
                        <p className="mt-2"><span className="font-medium text-gray-500 dark:text-gray-400">NIF:</span> {fromParty.taxId}</p>
                    </div>
                </div>

                {/* To Card */}
                 <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm mb-3">
                        <ArrowDownIcon className="w-4 h-4"/><span>Cliente (Adquirente)</span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{invoice.client.name}</p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p>{invoice.client.address}</p>
                        <p>{invoice.client.zip} {invoice.client.city}</p>
                        <p className="mt-2"><span className="font-medium text-gray-500 dark:text-gray-400">NIF:</span> {invoice.client.tax_id}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
             <div className="mt-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 pl-0">Descrição</th>
                        <th className="py-3 text-right">Qtd</th>
                        <th className="py-3 text-right">Preço Un.</th>
                        <th className="py-3 text-right">IVA</th>
                        <th className="py-3 pr-0 text-right">Total Líquido</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {invoice.lines.map((line) => (
                        <tr key={line.id} className="text-sm text-gray-800 dark:text-gray-200">
                            <td className="py-4 pl-0 font-medium">
                                {line.description}
                            </td>
                            <td className="py-4 text-right">{line.quantity}</td>
                            <td className="py-4 text-right">{formatCurrency(line.unit_price, invoice.currency)}</td>
                            <td className="py-4 text-right text-gray-500">{line.tax_rate}%</td>
                            <td className="py-4 pr-0 text-right font-semibold">{formatCurrency(line.line_total, invoice.currency)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
                <div className="w-full md:w-1/2 space-y-3">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Total Líquido</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(subtotal, invoice.currency)}</span>
                    </div>
                     {taxAmount > 0 && (
                         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Total IVA</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(taxAmount, invoice.currency)}</span>
                        </div>
                    )}
                    {invoice.discount && (
                         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Desconto Comercial</span>
                            <span className="font-medium text-red-500">-{formatCurrency(invoice.discount, invoice.currency)}</span>
                        </div>
                    )}
                     <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-300 dark:border-gray-600 mt-2">
                        <span>Total a Pagar</span>
                        <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                    </div>
                </div>
            </div>
            
            {/* Legal Footers & Hash */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                {invoice.status !== 'draft' && (
                    <div className="mb-6 text-xs font-mono text-gray-500 dark:text-gray-500 break-all">
                        <span className="font-bold mr-2">Assinatura:</span>
                        Processado por computador / * {invoice.hash_control || '----'} - {invoice.hash ? `${invoice.hash.substring(0, 20)}...` : ''}
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 dark:text-gray-500">
                     <p>
                        {invoice.certification_number 
                            ? `Processado por programa certificado nº ${invoice.certification_number}` 
                            : 'Documento sem validade fiscal (Modo de Teste)'}
                     </p>
                     <p className="mt-1 md:mt-0">
                        Os bens/serviços foram colocados à disposição do adquirente na data do documento.
                     </p>
                </div>
            </div>
            
            {/* Mobile QR Code (Bottom) */}
             {invoice.status !== 'draft' && (
                <div className="md:hidden mt-8 flex justify-center">
                     <QRCodeMock />
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
