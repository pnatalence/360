import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// --- In-Memory Database (from mockApi.ts) ---
let clients = [
  { id: '1', name: 'Kappy Bara', email: 'Pay@Kappybara.ai', tax_id: '0123892V', phone: '+1 808-123-4567', address: '95-1249 Meheula Pkwy', city: 'Mililani', state: 'Hawaii', zip: '96789', country: 'USA', createdAt: '2024-01-24T09:30:00Z', avatar: 'https://i.imgur.com/r5L5tA5.png' },
  { id: '2', name: 'Digital Wave', email: 'hello@digitalwave.com', tax_id: 'PT508765432', phone: '+351 22 987 6543', address: 'Avenida da Liberdade, 45', city: 'Porto', state: 'Porto', zip: '4000-002', country: 'Portugal', createdAt: '2023-02-20T14:00:00Z' },
  { id: '3', name: 'Quantum Leap', email: 'support@quantum.io', tax_id: 'PT510987654', phone: '+351 21 555 1234', address: 'Praça do Comércio, 78', city: 'Lisboa', state: 'Lisboa', zip: '1100-148', country: 'Portugal', createdAt: '2023-03-10T11:45:00Z' },
  { id: '4', name: 'Inova Tech', email: 'contact@inova.tech', tax_id: 'PT509123456', phone: '+351 21 876 5432', address: 'Rua das Flores, 123', city: 'Lisboa', state: 'Lisboa', zip: '1000-001', country: 'Portugal', createdAt: '2023-01-15T09:30:00Z' },
];

let products = [
    { id: 'prod-001', name: 'Serviços de Desenvolvimento Web', code: 'WEB-DEV', description: 'Desenvolvimento de websites à medida', unit_price: 5000, tax_rate: 23, barcode: '1111111111111', active: true },
    { id: 'prod-002', name: 'Consultoria de SEO', code: 'SEO-CON', description: 'Estratégia de Otimização para Motores de Busca', unit_price: 1500, tax_rate: 23, barcode: '2222222222222', active: true },
    { id: 'prod-003', name: 'Alojamento na Cloud', code: 'CLOUD-HST', description: 'Alojamento mensal em servidor na cloud', unit_price: 100, tax_rate: 23, barcode: '3333333333333', active: true },
    { id: 'prod-004', name: 'Pacote de Design UI/UX', code: 'UIUX-PKG', description: 'Design de interface e experiência do utilizador', unit_price: 3500, tax_rate: 23, barcode: '4444444444444', active: true },
];

let invoices = [
    { id: 'inv-001', number: '000001', client: clients[0], status: 'paid', date: '2024-01-24T00:00:00Z', due_date: '2025-02-07T00:00:00Z', total: 3000, currency: 'USD', discount: 500, lines: [{ id: 'line-1a', product_id: 'prod-004', description: 'UI Design Work', quantity: 2, unit_price: 1000, tax_rate: 0, line_total: 2000 }, { id: 'line-1b', product_id: 'prod-001', description: 'No-code Development', quantity: 1, unit_price: 1500, tax_rate: 0, line_total: 1500 }] },
    { id: 'inv-002', number: '2024-002', client: clients[1], status: 'issued', date: '2024-05-15T00:00:00Z', due_date: '2024-06-15T00:00:00Z', total: 1845, currency: 'AOA', lines: [{ id: 'line-2', product_id: 'prod-002', description: 'SEO Consulting', quantity: 1, unit_price: 1500, tax_rate: 23, line_total: 1500 }] },
    { id: 'inv-003', number: '2024-003', client: clients[2], status: 'draft', date: '2024-06-01T00:00:00Z', due_date: '2024-07-01T00:00:00Z', total: 4305, currency: 'AOA', lines: [{ id: 'line-3', product_id: 'prod-004', description: 'UI/UX Design Package', quantity: 1, unit_price: 3500, tax_rate: 23, line_total: 3500 }] },
    { id: 'inv-004', number: '2024-004', client: clients[3], status: 'cancelled', date: '2024-04-20T00:00:00Z', due_date: '2024-05-20T00:00:00Z', total: 123, currency: 'AOA', lines: [{ id: 'line-4', product_id: 'prod-003', description: 'Cloud Hosting', quantity: 1, unit_price: 100, tax_rate: 23, line_total: 100 }] },
    { id: 'inv-005', number: '2024-005', client: clients[1], status: 'paid', date: '2024-03-10T00:00:00Z', due_date: '2024-04-10T00:00:00Z', total: 6273, currency: 'AOA', lines: [{ id: 'line-5a', product_id: 'prod-001', description: 'Web Development Services', quantity: 1, unit_price: 5000, tax_rate: 23, line_total: 5000 }, { id: 'line-5b', product_id: 'prod-003', description: 'Cloud Hosting', quantity: 1, unit_price: 100, tax_rate: 23, line_total: 100 }] },
    { id: 'inv-006', number: '2024-006', client: clients[2], status: 'issued', date: '2024-06-05T00:00:00Z', due_date: '2024-07-05T00:00:00Z', total: 1500, currency: 'AOA', lines: [{ id: 'line-6', product_id: 'prod-002', description: 'SEO Consulting', quantity: 1, unit_price: 1500, tax_rate: 0, line_total: 1500 }] },
];

let companyPaymentMethods = {
    multicaixa: true,
    bankTransfer: true,
    cash: false,
};

// --- API Endpoints ---

// Clients
app.get('/api/clients', (req, res) => {
    res.json(clients);
});

app.post('/api/clients', (req, res) => {
    const clientData = req.body;
    const newClient = {
        id: `client-${Date.now()}`,
        ...clientData,
        createdAt: new Date().toISOString(),
    };
    clients.unshift(newClient);
    res.status(201).json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const clientData = req.body;
    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
        clients[clientIndex] = { ...clients[clientIndex], ...clientData };
        res.json(clients[clientIndex]);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
});

app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
        clients.splice(clientIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
});

// Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const productData = req.body;
    const newProduct = {
        id: `prod-${Date.now()}`,
        code: `PROD-${Math.floor(Math.random() * 9000) + 1000}`,
        ...productData,
        active: true,
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...productData };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Invoices
app.get('/api/invoices', (req, res) => {
    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sortedInvoices);
});

app.post('/api/invoices', (req, res) => {
    const invoiceData = req.body;
    const newInvoice = {
        id: `inv-${Date.now()}`,
        number: `2024-00${invoices.length + 1}`,
        ...invoiceData,
    };
    invoices.unshift(newInvoice);
    res.status(201).json(newInvoice);
});


// Company
app.get('/api/company/payment-methods', (req, res) => {
    res.json(companyPaymentMethods);
});

app.post('/api/company/payment-methods', (req, res) => {
    const newMethods = req.body;
    companyPaymentMethods = { ...companyPaymentMethods, ...newMethods };
    res.json(companyPaymentMethods);
});


// --- Gemini Chat Proxy ---

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = ai.models['gemini-2.5-flash'];

const tools = [
  { name: 'navigate_to', description: 'Navega para uma secção específica da aplicação.', parameters: { type: Type.OBJECT, properties: { view: { type: Type.STRING, description: 'A secção para a qual navegar.', enum: ['dashboard', 'invoices', 'clients', 'products', 'company', 'settings'] } }, required: ['view'] } },
  { name: 'start_creating_invoice', description: 'Abre o formulário para começar a criar uma nova fatura.', parameters: { type: Type.OBJECT, properties: { clientName: { type: Type.STRING, description: 'O nome do cliente para quem a fatura está a ser criada.' } }, required: [] } },
  { name: 'start_creating_client', description: 'Abre o formulário para começar a criar um novo cliente.' },
  { name: 'start_creating_product', description: 'Abre o formulário para começar a criar um novo produto ou serviço.' },
  { name: 'create_client', description: 'Cria um novo cliente com os detalhes fornecidos. Requer nome, email e NIF.', parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, email: { type: Type.STRING }, tax_id: { type: Type.STRING }, phone: { type: Type.STRING }, address: { type: Type.STRING }, city: { type: Type.STRING }, state: { type: Type.STRING }, zip: { type: Type.STRING }, country: { type: Type.STRING } }, required: ['name', 'email', 'tax_id'] } },
];

const systemInstruction = `É um assistente de faturação inteligente para a aplicação Clique 360. O seu objetivo é ajudar os utilizadores a gerir as suas faturas, clientes e produtos através da conversação. Pode:
1. Começar a criar novas faturas. Vai precisar do nome do cliente.
2. Começar a criar novos clientes (abrindo o formulário).
3. Criar um novo cliente diretamente se forem fornecidos o nome, email e NIF.
4. Começar a criar novos produtos ou serviços.
5. Navegar o utilizador para diferentes secções da aplicação (Início, Faturas, Clientes, Produtos, Empresa, Definições).
Quando um utilizador pedir para realizar uma ação, use as ferramentas disponíveis. Peça sempre esclarecimentos se faltar informação. Se o utilizador pedir algo que não se enquadre nestas capacidades, como responder a perguntas de conhecimento geral ou realizar tarefas não relacionadas com a faturação, recuse educadamente e lembre-o das suas funções principais.`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            tools: [{ functionDeclarations: tools }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
        });

        const result = await chat.sendMessageStream(message);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of result.stream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        res.end();
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ error: 'Failed to communicate with the AI model.' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});