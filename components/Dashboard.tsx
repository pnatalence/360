
import React, { useState, useEffect, useCallback } from 'react';
import type { Invoice, InvoiceStatus, View, Client, Product } from '../types';
import { getInvoices, getClients, getProducts, formatCurrency } from '../services/mockApi';
import { ExportIcon, SidebarIcon } from './icons';
import InvoiceDetail from './InvoiceDetail';

type ChartView = 'monthly' | 'annual';

interface MonthlyChartData {
  name: string;
  invoiced: number;
  received: number;
}

interface AnnualChartData {
  name: string;
  currentYear: number;
  previousYear: number;
}

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
    const statusConfig: Record<InvoiceStatus, { classes: string; dot: string; label: string }> = {
        paid: {
            classes: 'bg-green-100 text-green-700',
            dot: 'bg-green-500',
            label: 'Paga',
        },
        issued: {
            classes: 'bg-blue-100 text-blue-700',
            dot: 'bg-blue-500',
            label: 'Emitida',
        },
        draft: {
            classes: 'bg-yellow-100 text-yellow-700',
            dot: 'bg-yellow-500',
            label: 'Rascunho',
        },
        cancelled: {
            classes: 'bg-red-100 text-red-700',
            dot: 'bg-red-500',
            label: 'Anulada',
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


const Dashboard: React.FC<{setView: (view: View, action?: string) => void;}> = ({setView}) => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientCount, setClientCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [chartView, setChartView] = useState<ChartView>('monthly');
  const [chartData, setChartData] = useState<(MonthlyChartData | AnnualChartData)[]>([]);
  const [chartStats, setChartStats] = useState({ total: 0, percentageChange: 0 });

  const processChartData = useCallback(() => {
    const MOCK_CURRENT_YEAR = 2024;
    const previousYear = MOCK_CURRENT_YEAR - 1;
    
    const invoicesCurrentYear = allInvoices.filter(inv => new Date(inv.date).getFullYear() === MOCK_CURRENT_YEAR);
    const invoicesPreviousYear = allInvoices.filter(inv => new Date(inv.date).getFullYear() === previousYear);

    const totalCurrentYear = invoicesCurrentYear
        .filter(inv => inv.status !== 'cancelled')
        .reduce((sum, inv) => sum + inv.total, 0);

    const totalPreviousYear = invoicesPreviousYear
        .filter(inv => inv.status !== 'cancelled')
        .reduce((sum, inv) => sum + inv.total, 0);

    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let dataForChart;

    if (chartView === 'monthly') {
        dataForChart = monthLabels.map((name, monthIndex) => {
            const invoiced = invoicesCurrentYear
                .filter(inv => new Date(inv.date).getMonth() === monthIndex && inv.status !== 'cancelled')
                .reduce((sum, inv) => sum + inv.total, 0);
            
            const received = invoicesCurrentYear
                .filter(inv => new Date(inv.date).getMonth() === monthIndex && inv.status === 'paid')
                .reduce((sum, inv) => sum + inv.total, 0);

            return { name, invoiced, received };
        });
    } else { // annual view
        dataForChart = monthLabels.map((name, monthIndex) => {
            const currentYearAmount = invoicesCurrentYear
                .filter(inv => new Date(inv.date).getMonth() === monthIndex && inv.status !== 'cancelled')
                .reduce((sum, inv) => sum + inv.total, 0);

            const previousYearAmount = invoicesPreviousYear
                .filter(inv => new Date(inv.date).getMonth() === monthIndex && inv.status !== 'cancelled')
                .reduce((sum, inv) => sum + inv.total, 0);
            
            return { name, currentYear: currentYearAmount, previousYear: previousYearAmount };
        });
    }

    const percentageChange = totalPreviousYear > 0 
        ? ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100 
        : (totalCurrentYear > 0 ? 100 : 0);

    setChartData(dataForChart);
    setChartStats({ total: totalCurrentYear, percentageChange });
  }, [allInvoices, chartView]);

  useEffect(() => {
    const fetchData = async () => {
      const allInvoicesData = await getInvoices();
      const allClients = await getClients();
      const allProducts = await getProducts();
      
      setAllInvoices(allInvoicesData);
      setRecentInvoices(allInvoicesData.slice(0, 5));
      setClientCount(allClients.length);
      setProductCount(allProducts.length);

      const invoicedClients = new Map<string, Client>();
      for (const invoice of allInvoicesData) {
        if (!invoicedClients.has(invoice.client.id)) {
          invoicedClients.set(invoice.client.id, invoice.client);
        }
        if (invoicedClients.size >= 4) break;
      }
      setRecentClients(Array.from(invoicedClients.values()));

      const productsMap = new Map(allProducts.map(p => [p.id, p]));
      const usedProducts = new Map<string, Product>();
      for (const invoice of allInvoicesData) {
        for (const line of invoice.lines) {
          if (!usedProducts.has(line.product_id) && productsMap.has(line.product_id)) {
            usedProducts.set(line.product_id, productsMap.get(line.product_id)!);
          }
          if (usedProducts.size >= 4) break;
        }
        if (usedProducts.size >= 4) break;
      }
      setRecentProducts(Array.from(usedProducts.values()));
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if (allInvoices.length > 0) {
      processChartData();
    }
  }, [allInvoices, processChartData]);

  const greeting = `Bom Dia, Ana ✨`;
  
  const getMaxValue = () => {
    if (chartData.length === 0) return 1;
    let max = 0;
    if (chartView === 'monthly') {
      max = Math.max(...chartData.map(d => Math.max((d as MonthlyChartData).invoiced, (d as MonthlyChartData).received)));
    } else {
      max = Math.max(...chartData.map(d => Math.max((d as AnnualChartData).currentYear, (d as AnnualChartData).previousYear)));
    }
    return max === 0 ? 1 : max;
  };

  const maxValue = getMaxValue();

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{greeting}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui está uma visão geral da sua saúde financeira e atividade recente.</p>
            </div>
            <div className="flex items-center space-x-2">
                 <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">
                    Este Mês
                </button>
                 <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm inline-flex items-center">
                    <ExportIcon className="w-5 h-5 mr-2" />
                    Exportar SAF-T (PT)
                </button>
            </div>
        </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Saldo Total" value={formatCurrency(1250000, 'EUR')} icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 6h12l3-6H3zM5.5 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>} color="bg-purple-100" />
        <StatCard title="Rendimento Mensal" value={formatCurrency(320000, 'EUR')} icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="bg-orange-100" />
        <StatCard title="Clientes" value={clientCount.toString()} icon={<SidebarIcon.Clients className="w-6 h-6 text-pink-600" />} color="bg-pink-100" />
        <StatCard title="Produtos/Serviços" value={productCount.toString()} icon={<SidebarIcon.Products className="w-6 h-6 text-blue-600" />} color="bg-blue-100" />
      </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Visão Geral de Faturas</h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {formatCurrency(chartStats.total, 'EUR')}
                        <span className={`text-sm font-medium ${chartStats.percentageChange >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} align-text-bottom ml-2`}>
                            {chartStats.percentageChange >= 0 ? '+' : ''}{chartStats.percentageChange.toFixed(1)}%
                        </span>
                    </p>
                </div>
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button onClick={() => setChartView('monthly')} className={`text-xs font-semibold py-1 px-3 rounded-md transition-colors ${chartView === 'monthly' ? 'bg-white text-gray-800 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}>Mensal</button>
                    <button onClick={() => setChartView('annual')} className={`text-xs font-semibold py-1 px-3 rounded-md transition-colors ${chartView === 'annual' ? 'bg-white text-gray-800 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}>Anual</button>
                </div>
            </div>
            <div className="h-64">
                <div className="w-full h-full flex items-end justify-between space-x-2">
                    {chartData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                             <div className="w-full h-full flex items-end justify-center gap-1">
                                {chartView === 'monthly' ? (
                                    <>
                                        <div className="w-1/2 bg-green-500 rounded-t-md transition-all duration-300 group-hover:opacity-75" style={{height: `${((data as MonthlyChartData).invoiced / maxValue) * 100}%`}}></div>
                                        <div className="w-1/2 bg-green-300 rounded-t-md transition-all duration-300 group-hover:opacity-75" style={{height: `${((data as MonthlyChartData).received / maxValue) * 100}%`}}></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-1/2 bg-green-500 rounded-t-md transition-all duration-300 group-hover:opacity-75" style={{height: `${((data as AnnualChartData).currentYear / maxValue) * 100}%`}}></div>
                                        <div className="w-1/2 bg-gray-300 dark:bg-gray-600 rounded-t-md transition-all duration-300 group-hover:opacity-75" style={{height: `${((data as AnnualChartData).previousYear / maxValue) * 100}%`}}></div>
                                    </>
                                )}
                            </div>
                           <span className="text-xs text-gray-400 mt-2">{data.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center space-x-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
                {chartView === 'monthly' ? (
                    <>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Faturado</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-300 mr-2"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Recebido</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Ano Atual</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Ano Anterior</span>
                        </div>
                    </>
                )}
            </div>
        </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Clientes Recentes</h2>
             <div className="space-y-3">
                {recentClients.map(client => (
                    <button key={client.id} onClick={() => setView('invoices')} className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-4 rounded-lg transition-colors">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{client.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                    </button>
                ))}
             </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Produtos Recentes</h2>
             <div className="space-y-3">
                {recentProducts.map(product => (
                    <button key={product.id} onClick={() => setView('invoices')} className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-4 rounded-lg transition-colors">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(product.unit_price, 'EUR')}</p>
                    </button>
                ))}
             </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
             <div className="space-y-3">
                <button onClick={() => setView('invoices', 'create')} className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-4 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Criar Nova Fatura</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fature a um cliente por serviços ou produtos.</p>
                </button>
                <button onClick={() => setView('clients', 'create')} className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-4 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Adicionar Novo Cliente</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Registe um novo cliente no seu negócio.</p>
                </button>
                <button onClick={() => setView('products', 'create')} className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-4 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Adicionar Novo Produto</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adicione um novo item ou serviço faturável.</p>
                </button>
             </div>
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white p-6">Faturas Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Fatura Nº</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(invoice => (
                <tr key={invoice.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => setSelectedInvoice(invoice)}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{invoice.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{invoice.client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(invoice.total, invoice.currency)}</td>
                  <td className="px-4 py-3 text-sm"><InvoiceStatusBadge status={invoice.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       {selectedInvoice && <InvoiceDetail invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
};

export default Dashboard;
