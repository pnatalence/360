import type { Client, Product, Invoice } from '../types';

const API_BASE_URL = '/api'; // Use relative URL

export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// --- Client API ---
export const getClients = (): Promise<Client[]> => {
    return fetch(`${API_BASE_URL}/clients`).then(res => res.json());
};

export const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    return fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    }).then(res => res.json());
};

export const updateClient = (clientId: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> => {
    return fetch(`${API_BASE_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    }).then(res => res.json());
};

export const deleteClient = (clientId: string): Promise<void> => {
    return fetch(`${API_BASE_URL}/clients/${clientId}`, { method: 'DELETE' }).then(() => {});
};

// --- Product API ---
export const getProducts = (): Promise<Product[]> => {
    return fetch(`${API_BASE_URL}/products`).then(res => res.json());
};

export const addProduct = (productData: Omit<Product, 'id' | 'code' | 'active'>): Promise<Product> => {
    return fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    }).then(res => res.json());
};

export const updateProduct = (productId: string, productData: Partial<Omit<Product, 'id' | 'code'>>): Promise<Product> => {
    return fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    }).then(res => res.json());
};

export const deleteProduct = (productId: string): Promise<void> => {
    return fetch(`${API_BASE_URL}/products/${productId}`, { method: 'DELETE' }).then(() => {});
};

// --- Invoice API ---
export const getInvoices = (): Promise<Invoice[]> => {
    return fetch(`${API_BASE_URL}/invoices`).then(res => res.json());
};

export const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'number'>): Promise<Invoice> => {
    return fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
    }).then(res => res.json());
};

// --- Company API ---
const companyPaymentMethods = {
    multicaixa: true,
    bankTransfer: true,
    cash: false,
};

export const getCompanyPaymentMethods = (): Promise<typeof companyPaymentMethods> => {
    return fetch(`${API_BASE_URL}/company/payment-methods`).then(res => res.json());
};

export const saveCompanyPaymentMethods = (methods: typeof companyPaymentMethods): Promise<void> => {
    return fetch(`${API_BASE_URL}/company/payment-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(methods),
    }).then(() => {});
};
