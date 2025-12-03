
import React, { useState, useEffect, useMemo } from 'react';
import type { Invoice, InvoiceStatus } from '../types';
import { getInvoices, formatCurrency } from '../services/mockApi';
import InvoiceDetail from './InvoiceDetail';
import CreateInvoice from './CreateInvoice';
import { ExportIcon } from './icons';

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
    const statusConfig: Record<InvoiceStatus, { classes: string; dot: string; label: string }> = {
        paid: {
            classes: 'bg-green-100 text-green-700',
            dot: 'bg-green-500',
            label: 'Paga'
        },
        issued: {
            classes: 'bg-blue-100 text-blue-700',
            dot: 'bg-blue-500',
            label: 'Emitida'
        },
        draft: {
            classes: 'bg-yellow-100 text-yellow-700',
            dot: 'bg-yellow-500',
            label: 'Rascunho'
        },
        cancelled: {
            classes: 'bg-red-100 text-red-700',
            dot: 'bg-red-500',
            label: 'Anulada'
        },
    };
    
    const config = statusConfig[status];

    return (
        <span className={`${baseClasses} ${config.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

interface InvoicesProps {
  initialAction?: string | null;
  clearInitialAction?: () => void;
}

const Invoices: React.FC<InvoicesProps> = ({ initialAction, clearInitialAction }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (initialAction === 'create') {
        setIsCreating(true);
        clearInitialAction?.();
    }
  }, [initialAction, clearInitialAction]);

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        if (statusFilter === 'all') return true;
        return invoice.status === statusFilter;
      })
      .filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        // Adjust start date to the beginning of the day and end date to the end of the day for inclusive filtering
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        if (startDate) startDate.setHours(0, 0, 0, 0);
        
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);

        if (startDate && startDate > invoiceDate) {
            return false;
        }
        if (endDate && endDate < invoiceDate) {
            return false;
        }
        return true;
      });
  }, [invoices, statusFilter, dateRange]);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
        alert("Não existem dados para exportar com os filtros atuais.");
        return;
    }

    // Define CSV Headers
    const headers = [
        "Número Fatura",
        "Estado",
        "Data Emissão",
        "Data Vencimento",
        "Nome Cliente",
        "NIF Cliente",
        "Total Líquido",
        "Total Imposto",
        "Total Fatura",
        "Moeda",
        "ATCUD"
    ];

    // Map data to CSV rows
    const csvRows = filteredInvoices.map(inv => {
        const subtotal = inv.lines.reduce((acc, line) => acc + line.line_total, 0);
        const taxes = inv.lines.reduce((acc, line) => acc + (line.line_total * (line.tax_rate / 100)), 0);
        
        // Helper to escape quotes and wrap in quotes
        const escape = (val: string | number | undefined) => `"${String(val || '').replace(/"/g, '""')}"`;

        return [
            escape(inv.number),
            escape(inv.status),
            escape(new Date(inv.date).toLocaleDateString('pt-PT')),
            escape(new Date(inv.due_date).toLocaleDateString('pt-PT')),
            escape(inv.client.name),
            escape(inv.client.tax_id),
            subtotal.toFixed(2),
            taxes.toFixed(2),
            inv.total.toFixed(2),
            escape(inv.currency),
            escape(inv.atcud)
        ].join(',');
    });

    // Combine headers and rows with BOM for Excel UTF-8 compatibility
    const csvContent = ['\uFEFF' + headers.join(','), ...csvRows].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exportacao_faturas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (isCreating) {
    return <CreateInvoice onClose={() => setIsCreating(false)} />;
  }
  
  const statuses: Array<InvoiceStatus | 'all'> = ['all', 'draft', 'issued', 'paid', 'cancelled'];
  const statusLabels: Record<InvoiceStatus | 'all', string> = {
    all: 'Todas',
    draft: 'Rascunho',
    issued: 'Emitida',
    paid: 'Paga',
    cancelled: 'Anulada'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faturas</h1>
        <div className="flex items-center space-x-3 w-full md:w-auto">
            <button 
                onClick={handleExportCSV}
                disabled={loading || filteredInvoices.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ExportIcon className="w-5 h-5 mr-2" />
                Exportar CSV
            </button>
            <button onClick={() => setIsCreating(true)} className="flex-1 md:flex-none bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors">
            Criar Fatura
            </button>
        </div>
      </div>

       <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 md:pb-0">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="date"
            name="start"
            aria-label="Start date"
            value={dateRange.start}
            onChange={handleDateChange}
            className="bg-gray-100 dark:bg-gray-700 dark:text-white border-transparent rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            name="end"
            aria-label="End date"
            value={dateRange.end}
            onChange={handleDateChange}
            className="bg-gray-100 dark:bg-gray-700 dark:text-white border-transparent rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={resetFilters}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ml-2"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center p-8 text-gray-500">A carregar faturas...</div>
          ) : filteredInvoices.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Fatura Nº</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Data de Vencimento</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400 cursor-pointer hover:underline" onClick={() => setSelectedInvoice(invoice)}>{invoice.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{invoice.client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(invoice.total, invoice.currency)}</td>
                  <td className="px-4 py-3 text-sm"><InvoiceStatusBadge status={invoice.status} /></td>
                  <td className="px-4 py-3 text-sm text-right">
                     <div className="flex justify-end space-x-2">
                         <button onClick={() => setSelectedInvoice(invoice)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs font-medium">
                             Ver
                         </button>
                         {/* Compliance: Can only delete drafts */}
                         {invoice.status === 'draft' && (
                            <button className="text-red-500 hover:text-red-700 dark:text-red-400 text-xs font-medium">
                                Apagar
                            </button>
                         )}
                         {/* Compliance: Can only void (cancel) issued invoices, not delete */}
                         {invoice.status !== 'draft' && invoice.status !== 'cancelled' && (
                             <button className="text-red-500 hover:text-red-700 dark:text-red-400 text-xs font-medium">
                                 Anular
                             </button>
                         )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
             <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Nenhuma fatura encontrada</h3>
                <p className="mt-1">Tente ajustar os seus filtros para encontrar o que procura.</p>
            </div>
          )}
        </div>
      </div>
      {selectedInvoice && <InvoiceDetail invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
};

export default Invoices;
