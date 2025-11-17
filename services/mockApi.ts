

import type { Client, Product, Invoice, InvoiceStatus, ChatMessage } from '../types';

export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

let clients: Client[] = [
  { id: '1', name: 'Kappy Bara', email: 'Pay@Kappybara.ai', tax_id: '0123892V', phone: '+1 808-123-4567', address: '95-1249 Meheula Pkwy', city: 'Mililani', state: 'Hawaii', zip: '96789', country: 'USA', createdAt: '2024-01-24T09:30:00Z', avatar: 'https://i.imgur.com/r5L5tA5.png' },
  { id: '2', name: 'Digital Wave', email: 'hello@digitalwave.com', tax_id: 'PT508765432', phone: '+351 22 987 6543', address: 'Avenida da Liberdade, 45', city: 'Porto', state: 'Porto', zip: '4000-002', country: 'Portugal', createdAt: '2023-02-20T14:00:00Z' },
  { id: '3', name: 'Quantum Leap', email: 'support@quantum.io', tax_id: 'PT510987654', phone: '+351 21 555 1234', address: 'Praça do Comércio, 78', city: 'Lisboa', state: 'Lisboa', zip: '1100-148', country: 'Portugal', createdAt: '2023-03-10T11:45:00Z' },
  { id: '4', name: 'Inova Tech', email: 'contact@inova.tech', tax_id: 'PT509123456', phone: '+351 21 876 5432', address: 'Rua das Flores, 123', city: 'Lisboa', state: 'Lisboa', zip: '1000-001', country: 'Portugal', createdAt: '2023-01-15T09:30:00Z' },
];

let products: Product[] = [
    { id: 'prod-001', name: 'Serviços de Desenvolvimento Web', code: 'WEB-DEV', description: 'Desenvolvimento de websites à medida', unit_price: 5000, tax_rate: 23, barcode: '1111111111111', active: true },
    { id: 'prod-002', name: 'Consultoria de SEO', code: 'SEO-CON', description: 'Estratégia de Otimização para Motores de Busca', unit_price: 1500, tax_rate: 23, barcode: '2222222222222', active: true },
    { id: 'prod-003', name: 'Alojamento na Cloud', code: 'CLOUD-HST', description: 'Alojamento mensal em servidor na cloud', unit_price: 100, tax_rate: 23, barcode: '3333333333333', active: true },
    { id: 'prod-004', name: 'Pacote de Design UI/UX', code: 'UIUX-PKG', description: 'Design de interface e experiência do utilizador', unit_price: 3500, tax_rate: 23, barcode: '4444444444444', active: true },
];

const invoices: Invoice[] = [
    { 
        id: 'inv-001', 
        number: '000001', 
        client: clients[0], 
        status: 'paid', 
        date: '2024-01-24T00:00:00Z', 
        due_date: '2025-02-07T00:00:00Z', 
        total: 3000, 
        currency: 'USD',
        discount: 500,
        lines: [
            { id: 'line-1a', product_id: 'prod-004', description: 'UI Design Work', quantity: 2, unit_price: 1000, tax_rate: 0, line_total: 2000 },
            { id: 'line-1b', product_id: 'prod-001', description: 'No-code Development', quantity: 1, unit_price: 1500, tax_rate: 0, line_total: 1500 }
        ] 
    },
    { 
        id: 'inv-002', 
        number: '2024-002', 
        client: clients[1], 
        status: 'issued', 
        date: '2024-05-15T00:00:00Z', 
        due_date: '2024-06-15T00:00:00Z', 
        total: 1845, 
        currency: 'AOA',
        lines: [
            { id: 'line-2', product_id: 'prod-002', description: 'SEO Consulting', quantity: 1, unit_price: 1500, tax_rate: 23, line_total: 1500 }
        ] 
    },
    { 
        id: 'inv-003', 
        number: '2024-003', 
        client: clients[2], 
        status: 'draft', 
        date: '2024-06-01T00:00:00Z', 
        due_date: '2024-07-01T00:00:00Z', 
        total: 4305, 
        currency: 'AOA',
        lines: [
            { id: 'line-3', product_id: 'prod-004', description: 'UI/UX Design Package', quantity: 1, unit_price: 3500, tax_rate: 23, line_total: 3500 }
        ] 
    },
    { 
        id: 'inv-004', 
        number: '2024-004', 
        client: clients[3], 
        status: 'cancelled', 
        date: '2024-04-20T00:00:00Z', 
        due_date: '2024-05-20T00:00:00Z', 
        total: 123, 
        currency: 'AOA',
        lines: [
            { id: 'line-4', product_id: 'prod-003', description: 'Cloud Hosting', quantity: 1, unit_price: 100, tax_rate: 23, line_total: 100 }
        ] 
    },
    { 
        id: 'inv-005', 
        number: '2024-005', 
        client: clients[1], 
        status: 'paid', 
        date: '2024-03-10T00:00:00Z', 
        due_date: '2024-04-10T00:00:00Z', 
        total: 6273, 
        currency: 'AOA',
        lines: [
            { id: 'line-5a', product_id: 'prod-001', description: 'Web Development Services', quantity: 1, unit_price: 5000, tax_rate: 23, line_total: 5000 },
            { id: 'line-5b', product_id: 'prod-003', description: 'Cloud Hosting', quantity: 1, unit_price: 100, tax_rate: 23, line_total: 100 }
        ] 
    },
     { 
        id: 'inv-006', 
        number: '2024-006', 
        client: clients[2], 
        status: 'issued', 
        date: '2024-06-05T00:00:00Z', 
        due_date: '2024-07-05T00:00:00Z', 
        total: 1500, 
        currency: 'AOA',
        lines: [
            { id: 'line-6', product_id: 'prod-002', description: 'SEO Consulting', quantity: 1, unit_price: 1500, tax_rate: 0, line_total: 1500 }
        ] 
    },
];

export const getClients = (): Promise<Client[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...clients]), 500);
  });
};

export const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    return new Promise(resolve => {
        const newClient: Client = {
            id: `client-${Date.now()}`,
            ...clientData,
            createdAt: new Date().toISOString(),
        };
        clients.unshift(newClient);
        setTimeout(() => resolve(newClient), 500);
    });
};

export const updateClient = (clientId: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> => {
    return new Promise((resolve, reject) => {
        const clientIndex = clients.findIndex(c => c.id === clientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = { ...clients[clientIndex], ...clientData };
            setTimeout(() => resolve(clients[clientIndex]), 500);
        } else {
            reject(new Error('Client not found'));
        }
    });
};

export const deleteClient = (clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const clientIndex = clients.findIndex(c => c.id === clientId);
        if (clientIndex !== -1) {
            clients.splice(clientIndex, 1);
            setTimeout(() => resolve(), 500);
        } else {
            reject(new Error('Client not found'));
        }
    });
};

export const getProducts = (): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...products]), 500);
  });
};

export const addProduct = (productData: Omit<Product, 'id' | 'code' | 'active'>): Promise<Product> => {
    return new Promise(resolve => {
        const highestCode = products.reduce((max, p) => {
            const currentCode = parseInt(p.code);
            return currentCode > max ? currentCode : max;
        }, 1000);

        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            code: `${highestCode + 1}`,
            ...productData,
            active: true,
        };
        products.unshift(newProduct);
        setTimeout(() => resolve(newProduct), 500);
    });
};

export const updateProduct = (productId: string, productData: Partial<Omit<Product, 'id' | 'code'>>): Promise<Product> => {
    return new Promise((resolve, reject) => {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...productData };
            setTimeout(() => resolve(products[productIndex]), 500);
        } else {
            reject(new Error('Product not found'));
        }
    });
};

export const deleteProduct = (productId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            setTimeout(() => resolve(), 500);
        } else {
            reject(new Error('Product not found'));
        }
    });
};


export const getInvoices = (): Promise<Invoice[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500);
  });
};

export const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'number'>): Promise<Invoice> => {
    return new Promise(resolve => {
        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            number: `2024-00${invoices.length + 1}`,
            ...invoiceData,
        };
        invoices.unshift(newInvoice);
        setTimeout(() => resolve(newInvoice), 500);
    });
};

const companyPaymentMethods = {
    multicaixa: true,
    bankTransfer: true,
    cash: false,
};

export const getCompanyPaymentMethods = (): Promise<typeof companyPaymentMethods> => {
    return new Promise(resolve => {
        setTimeout(() => resolve({ ...companyPaymentMethods }), 100);
    });
};

export const saveCompanyPaymentMethods = (methods: typeof companyPaymentMethods): Promise<void> => {
    return new Promise(resolve => {
        Object.assign(companyPaymentMethods, methods);
        setTimeout(() => resolve(), 100);
    });
};
