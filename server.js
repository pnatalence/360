
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup File System paths for persistence
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const app = express();
app.use(cors());
app.use(express.json());

// --- Default Data (Used if database.json doesn't exist) ---

const defaultClients = [
  { id: '1', name: 'Kappy Bara', email: 'Pay@Kappybara.ai', tax_id: '501238920', phone: '+1 808-123-4567', address: '95-1249 Meheula Pkwy', city: 'Mililani', state: 'Hawaii', zip: '96789', country: 'USA', createdAt: '2024-01-24T09:30:00Z', avatar: 'https://i.imgur.com/r5L5tA5.png' },
  { id: '2', name: 'Digital Wave Lda', email: 'hello@digitalwave.com', tax_id: '508765432', phone: '+351 22 987 6543', address: 'Avenida da Liberdade, 45', city: 'Porto', state: 'Porto', zip: '4000-002', country: 'Portugal', createdAt: '2023-02-20T14:00:00Z' },
  { id: '3', name: 'Quantum Leap SA', email: 'support@quantum.io', tax_id: '510987654', phone: '+351 21 555 1234', address: 'Praça do Comércio, 78', city: 'Lisboa', state: 'Lisboa', zip: '1100-148', country: 'Portugal', createdAt: '2023-03-10T11:45:00Z' },
  { id: '4', name: 'Inova Tech Unipessoal', email: 'contact@inova.tech', tax_id: '509123456', phone: '+351 21 876 5432', address: 'Rua das Flores, 123', city: 'Lisboa', state: 'Lisboa', zip: '1000-001', country: 'Portugal', createdAt: '2023-01-15T09:30:00Z' },
];

const defaultProducts = [
    { id: 'prod-001', name: 'Serviços de Desenvolvimento Web', code: 'WEB-DEV', description: 'Desenvolvimento de websites à medida', unit_price: 5000, tax_rate: 23, barcode: '1111111111111', active: true },
    { id: 'prod-002', name: 'Consultoria de SEO', code: 'SEO-CON', description: 'Estratégia de Otimização para Motores de Busca', unit_price: 1500, tax_rate: 23, barcode: '2222222222222', active: true },
    { id: 'prod-003', name: 'Alojamento na Cloud', code: 'CLOUD-HST', description: 'Alojamento mensal em servidor na cloud', unit_price: 100, tax_rate: 23, barcode: '3333333333333', active: true },
    { id: 'prod-004', name: 'Pacote de Design UI/UX', code: 'UIUX-PKG', description: 'Design de interface e experiência do utilizador', unit_price: 3500, tax_rate: 23, barcode: '4444444444444', active: true },
];

const defaultInvoices = [
    { 
        id: 'inv-001', 
        number: 'FT 2024/1', 
        client: defaultClients[0], 
        status: 'paid', 
        date: '2024-01-24T00:00:00Z', 
        due_date: '2025-02-07T00:00:00Z', 
        total: 3000, 
        currency: 'EUR', 
        discount: 500, 
        lines: [{ id: 'line-1a', product_id: 'prod-004', description: 'UI Design Work', quantity: 2, unit_price: 1000, tax_rate: 0, line_total: 2000 }, { id: 'line-1b', product_id: 'prod-001', description: 'No-code Development', quantity: 1, unit_price: 1500, tax_rate: 0, line_total: 1500 }],
        atcud: 'CSDT-1',
        hash: 'SimulatedHash1==',
        hash_control: 'O4d2',
        certification_number: '9999/AT'
    },
    { 
        id: 'inv-002', 
        number: 'FT 2024/2', 
        client: defaultClients[1], 
        status: 'issued', 
        date: '2024-05-15T00:00:00Z', 
        due_date: '2024-06-15T00:00:00Z', 
        total: 1845, 
        currency: 'EUR', 
        lines: [{ id: 'line-2', product_id: 'prod-002', description: 'SEO Consulting', quantity: 1, unit_price: 1500, tax_rate: 23, line_total: 1500 }],
        atcud: 'CSDT-2',
        hash: 'SimulatedHash2==',
        hash_control: '9sK1',
        certification_number: '9999/AT'
    },
];

const defaultCompanyPaymentMethods = {
    multicaixa: true,
    bankTransfer: true,
    cash: false,
};

// --- Persistence Logic ---

let db = {
    clients: [],
    products: [],
    invoices: [],
    companyPaymentMethods: {}
};

// Load Database
const loadDatabase = () => {
    if (fs.existsSync(DB_FILE)) {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            db = JSON.parse(data);
            console.log('Database loaded successfully.');
        } catch (error) {
            console.error('Error loading database, initializing with defaults:', error);
            initializeDefaults();
        }
    } else {
        console.log('No database file found, initializing with defaults.');
        initializeDefaults();
    }
};

const initializeDefaults = () => {
    db = {
        clients: defaultClients,
        products: defaultProducts,
        invoices: defaultInvoices,
        companyPaymentMethods: defaultCompanyPaymentMethods
    };
    saveDatabase();
};

// Save Database
const saveDatabase = () => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('Error saving database:', error);
    }
};

// Initialize on start
loadDatabase();

// --- Helper Functions ---
const generateFakeHash = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < 172; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '==';
};

const generateATCUD = (seq) => `CSDT-${seq}`;


// --- API Endpoints ---

// Root
app.get('/', (req, res) => {
    res.send('Backend Online 🟢');
});

// Clients
app.get('/api/clients', (req, res) => {
    res.json(db.clients);
});

app.post('/api/clients', (req, res) => {
    const clientData = req.body;
    const newClient = {
        id: `client-${Date.now()}`,
        ...clientData,
        createdAt: new Date().toISOString(),
    };
    db.clients.unshift(newClient);
    saveDatabase();
    res.status(201).json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const clientData = req.body;
    const clientIndex = db.clients.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
        db.clients[clientIndex] = { ...db.clients[clientIndex], ...clientData };
        saveDatabase();
        res.json(db.clients[clientIndex]);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
});

app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const clientIndex = db.clients.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
        db.clients.splice(clientIndex, 1);
        saveDatabase();
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
});

// Products
app.get('/api/products', (req, res) => {
    res.json(db.products);
});

app.post('/api/products', (req, res) => {
    const productData = req.body;
    const newProduct = {
        id: `prod-${Date.now()}`,
        code: `PROD-${Math.floor(Math.random() * 9000) + 1000}`,
        ...productData,
        active: true,
    };
    db.products.unshift(newProduct);
    saveDatabase();
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    const productIndex = db.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        db.products[productIndex] = { ...db.products[productIndex], ...productData };
        saveDatabase();
        res.json(db.products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = db.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        db.products.splice(productIndex, 1);
        saveDatabase();
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Invoices
app.get('/api/invoices', (req, res) => {
    const sortedInvoices = [...db.invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sortedInvoices);
});

app.post('/api/invoices', (req, res) => {
    const invoiceData = req.body;
    const isDraft = invoiceData.status === 'draft';
    
    const issuedCount = db.invoices.filter(i => i.status !== 'draft').length;

    const newInvoice = {
        id: `inv-${Date.now()}`,
        number: isDraft ? 'RASCUNHO' : `FT 2024/${issuedCount + 1}`,
        ...invoiceData,
        // PT Compliance Fields
        atcud: isDraft ? undefined : generateATCUD(issuedCount + 1),
        hash: isDraft ? undefined : generateFakeHash(),
        hash_control: isDraft ? undefined : 'Az91', // Simulated
        certification_number: isDraft ? undefined : '9999/AT'
    };
    db.invoices.unshift(newInvoice);
    saveDatabase();
    res.status(201).json(newInvoice);
});

// Company
app.get('/api/company/payment-methods', (req, res) => {
    res.json(db.companyPaymentMethods || defaultCompanyPaymentMethods);
});

app.post('/api/company/payment-methods', (req, res) => {
    const newMethods = req.body;
    db.companyPaymentMethods = { ...(db.companyPaymentMethods || defaultCompanyPaymentMethods), ...newMethods };
    saveDatabase();
    res.json(db.companyPaymentMethods);
});


// --- Gemini Chat Proxy ---

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const tools = [
  { name: 'navigate_to', description: 'Navega para uma secção específica da aplicação.', parameters: { type: Type.OBJECT, properties: { view: { type: Type.STRING, description: 'A secção para a qual navegar.', enum: ['dashboard', 'invoices', 'clients', 'products', 'company', 'settings'] } }, required: ['view'] } },
  { name: 'start_creating_invoice', description: 'Abre o formulário para começar a criar uma nova fatura.', parameters: { type: Type.OBJECT, properties: { clientName: { type: Type.STRING, description: 'O nome do cliente para quem a fatura está a ser criada.' } }, required: [] } },
  { name: 'start_creating_client', description: 'Abre o formulário para começar a criar um novo cliente.', parameters: { type: Type.OBJECT, properties: {}, required: [] } },
  { name: 'start_creating_product', description: 'Abre o formulário para começar a criar um novo produto ou serviço.', parameters: { type: Type.OBJECT, properties: {}, required: [] } },
  { name: 'create_client', description: 'Cria um novo cliente com os detalhes fornecidos. Requer nome, email e NIF.', parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, email: { type: Type.STRING }, tax_id: { type: Type.STRING }, phone: { type: Type.STRING }, address: { type: Type.STRING }, city: { type: Type.STRING }, state: { type: Type.STRING }, zip: { type: Type.STRING }, country: { type: Type.STRING } }, required: ['name', 'email', 'tax_id'] } },
  { name: 'find_client_to_edit', description: 'Encontra um cliente para editar. Leva o utilizador para a página de clientes com um filtro de pesquisa aplicado.', parameters: { type: Type.OBJECT, properties: { client_name: { type: Type.STRING, description: 'O nome do cliente a ser procurado para edição.' } }, required: ['client_name'] } },
  { name: 'find_product_to_edit', description: 'Encontra um produto para editar. Leva o utilizador para a página de produtos com um filtro de pesquisa aplicado.', parameters: { type: Type.OBJECT, properties: { product_name_or_code: { type: Type.STRING, description: 'O nome ou código do produto a ser procurado para edição.' } }, required: ['product_name_or_code'] } },
];

const systemInstruction = `É um assistente de faturação inteligente para a aplicação Clique 360. O seu objetivo é ajudar os utilizadores a gerir as suas faturas, clientes e produtos através da conversação. Pode:
1. Começar a criar novas faturas. Vai precisar do nome do cliente.
2. Começar a criar novos clientes (abrindo o formulário).
3. Criar um novo cliente diretamente se forem fornecidos o nome, email e NIF.
4. Começar a criar novos produtos ou serviços.
5. Encontrar clientes ou produtos existentes para que o utilizador os possa editar.
6. Navegar o utilizador para diferentes secções da aplicação (Início, Faturas, Clientes, Produtos, Empresa, Definições).
Quando um utilizador pedir para realizar uma ação, use as ferramentas disponíveis. Peça sempre esclarecimentos se faltar informação. Se o utilizador pedir algo que não se enquadre nestas capacidades, como responder a perguntas de conhecimento geral ou realizar tarefas não relacionadas com a faturação, recuse educadamente e lembre-o das suas funções principais.`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const formattedHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: formattedHistory,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ functionDeclarations: tools }],
            }
        });

        const result = await chat.sendMessageStream({ message: message });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of result) {
            // Check if response is closed to prevent write errors
            if (res.writableEnded) break;

            const chunkData = {};
            
            // Safely extract text (handle getter or potential missing property)
            let text = '';
            if (typeof chunk.text === 'function') {
                text = chunk.text();
            } else if (typeof chunk.text === 'string') {
                text = chunk.text;
            }

            if (text) {
                chunkData.text = text;
            }
            
            if (chunk.functionCalls) {
                chunkData.functionCalls = chunk.functionCalls;
            }

            if (Object.keys(chunkData).length > 0) {
                const jsonString = JSON.stringify(chunkData);
                try {
                    res.write(`data: ${jsonString}\n\n`);
                } catch (writeError) {
                    console.error('Error writing to stream (client likely disconnected):', writeError);
                    break;
                }
            }
        }
        res.end();
    } catch (error) {
        console.error('Chat API error:', error);
        if (!res.headersSent) {
             res.status(500).json({ error: 'Failed to communicate with the AI model.' });
        } else {
            const errorPayload = JSON.stringify({ text: "\n[Erro no servidor: Interrupção da resposta. Por favor tente novamente.]" });
            try {
                if (!res.writableEnded) {
                    res.write(`data: ${errorPayload}\n\n`);
                    res.end();
                }
            } catch (e) {
                // Ignore errors here
            }
        }
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
