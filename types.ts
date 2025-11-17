export type View = 'dashboard' | 'invoices' | 'clients' | 'products' | 'company' | 'settings';

export interface Client {
  id: string;
  name: string;
  email: string;
  tax_id: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  unit_price: number;
  tax_rate: number;
  barcode?: string;
  active: boolean;
}

export interface InvoiceLine {
  id: string;
  product_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  number: string;
  client: Client;
  status: InvoiceStatus;
  date: string;
  due_date: string;
  total: number;
  currency: string;
  lines: InvoiceLine[];
  discount?: number;
}

export interface BotAction {
  type: string;
  confidence: number;
  payload: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actions?: BotAction[];
  requires_confirmation?: boolean;
  timestamp: string;
}