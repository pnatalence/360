import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, FunctionCall } from '@google/genai';
import { addClient } from '../services/mockApi';
import { ArrowRightIcon, BotLogoIcon, XIcon } from './icons';
import type { ChatMessage, View } from '../types';

const tools: FunctionDeclaration[] = [
  {
    name: 'navigate_to',
    description: 'Navega para uma secção específica da aplicação.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        view: {
          type: Type.STRING,
          description: 'A secção para a qual navegar.',
          enum: ['dashboard', 'invoices', 'clients', 'products', 'company', 'settings'],
        },
      },
      required: ['view'],
    },
  },
  {
    name: 'start_creating_invoice',
    description: 'Abre o formulário para começar a criar uma nova fatura.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        clientName: {
          type: Type.STRING,
          description: 'O nome do cliente para quem a fatura está a ser criada.',
        },
      },
      required: [],
    },
  },
  {
    name: 'start_creating_client',
    description: 'Abre o formulário para começar a criar um novo cliente.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: 'start_creating_product',
    description: 'Abre o formulário para começar a criar um novo produto ou serviço.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: 'create_client',
    description: 'Cria um novo cliente com os detalhes fornecidos. Requer nome, email e NIF.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'O nome completo ou nome da empresa do cliente.' },
        email: { type: Type.STRING, description: 'O endereço de e-mail do cliente.' },
        tax_id: { type: Type.STRING, description: 'O número de identificação fiscal (NIF) do cliente.' },
        phone: { type: Type.STRING, description: 'O número de telefone do cliente (opcional).' },
        address: { type: Type.STRING, description: 'A morada do cliente (opcional).' },
        city: { type: Type.STRING, description: 'A cidade do cliente (opcional).' },
        state: { type: Type.STRING, description: 'A província ou estado do cliente (opcional).' },
        zip: { type: Type.STRING, description: 'O código postal do cliente (opcional).' },
        country: { type: Type.STRING, description: 'O país do cliente (opcional).' },
      },
      required: ['name', 'email', 'tax_id'],
    },
  },
];

const systemInstruction = `É um assistente de faturação inteligente para a aplicação Clique 360. O seu objetivo é ajudar os utilizadores a gerir as suas faturas, clientes e produtos através da conversação. Pode:
1. Começar a criar novas faturas. Vai precisar do nome do cliente.
2. Começar a criar novos clientes (abrindo o formulário).
3. Criar um novo cliente diretamente se forem fornecidos o nome, email e NIF.
4. Começar a criar novos produtos ou serviços.
5. Navegar o utilizador para diferentes secções da aplicação (Início, Faturas, Clientes, Produtos, Empresa, Definições).
Quando um utilizador pedir para realizar uma ação, use as ferramentas disponíveis. Peça sempre esclarecimentos se faltar informação. Se o utilizador pedir algo que não se enquadre nestas capacidades, como responder a perguntas de conhecimento geral ou realizar tarefas não relacionadas com a faturação, recuse educadamente e lembre-o das suas funções principais.`;

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setView: (view: View, action?: string) => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - date.getTime()) / 1000));
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    if (seconds < 60) {
        return "agora mesmo";
    } else if (minutes < 60) {
        return `há ${minutes} min`;
    } else if (hours < 24) {
        return `há ${hours} hora(s)`;
    } else {
        return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
    }
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, setView }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: tools }],
        });
    }
  }, [isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
     setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Olá 👋 Sou o Assistente de IA. Como posso ajudar hoje?',
        timestamp: new Date().toISOString(),
      },
    ]);
    chatRef.current = null; // Reset chat session
  };
  
  useEffect(() => {
    handleNewChat();
  }, []);

  const handleFunctionCall = async (call: FunctionCall): Promise<{ success: boolean, message: string }> => {
    const { name, args } = call;
    try {
      console.log(`Function call: ${name}`, args);
      switch (name) {
        case 'navigate_to':
          setView(args.view as View);
          return { success: true, message: `Navegado para a secção ${args.view}.` };
        case 'start_creating_invoice':
          setView('invoices', 'create');
          return { success: true, message: args.clientName ? `Formulário de nova fatura aberto. O utilizador deve selecionar ${args.clientName} como cliente.` : 'Formulário de nova fatura aberto.' };
        case 'start_creating_client':
          setView('clients', 'create');
          return { success: true, message: 'Formulário de novo cliente aberto.' };
        case 'start_creating_product':
          setView('products', 'create');
          return { success: true, message: 'Formulário de novo produto aberto.' };
        case 'create_client': {
            const clientData = {
                name: args.name as string,
                email: args.email as string,
                tax_id: args.tax_id as string,
                phone: args.phone as string | undefined,
                address: args.address as string | undefined,
                city: args.city as string | undefined,
                state: args.state as string | undefined,
                zip: args.zip as string | undefined,
                country: args.country as string | undefined,
            };
            const newClient = await addClient(clientData);
            return { success: true, message: `Cliente "${newClient.name}" criado com sucesso.` };
        }
        default:
          return { success: false, message: `Função ${name} não encontrada.` };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: `Erro ao executar a função ${name}.` };
    }
  };

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        if (!chatRef.current) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', systemInstruction: systemInstruction, tools: [{ functionDeclarations: tools }] });
        }
        
        const stream = await chatRef.current.sendMessageStream({ message: currentInput });

        let botMessageText = '';
        const functionCalls: FunctionCall[] = [];
        const botMessageId = Date.now().toString() + '-bot';

        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '', timestamp: new Date().toISOString() }]);
        
        for await (const chunk of stream) {
            if (chunk.text) {
                botMessageText += chunk.text;
                setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: botMessageText} : m));
            }
            if (chunk.functionCalls) {
                functionCalls.push(...chunk.functionCalls);
            }
        }

        if (functionCalls.length > 0) {
            const functionResponseParts = await Promise.all(functionCalls.map(async (call) => {
                const result = await handleFunctionCall(call);
                return {
                    functionResponse: {
                        name: call.name,
                        response: { result: result.message },
                    },
                };
            }));

            const responseStream2 = await chatRef.current.sendMessageStream({ message: functionResponseParts });
            
            let finalBotResponseText = botMessageText ? botMessageText + '\n' : '';
            for await (const chunk of responseStream2) {
                if (chunk.text) {
                    finalBotResponseText += chunk.text;
                    setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: finalBotResponseText } : m));
                }
            }
        }
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 md:bottom-28 md:right-6 md:inset-auto" aria-live="polite">
      <div className="w-full h-full bg-[#9278e2] md:w-[370px] md:h-[70vh] md:max-h-[620px] md:rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
        <div className="p-5 text-white flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Converse com a nossa IA</h2>
              <p className="text-sm opacity-90 mt-1">Faça qualquer pergunta e a nossa IA responderá!</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-1 -mr-2 text-white/80 hover:text-white">
              <XIcon className="h-6 w-6"/>
            </button>
          </div>
          <button 
              onClick={handleNewChat}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
              Nova conversa
          </button>
        </div>

        <div className="flex-1 bg-white md:rounded-t-3xl md:rounded-b-[22px] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                    <BotLogoIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className={`max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'order-2' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                      msg.sender === 'bot'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-violet-500 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>{timeAgo(msg.timestamp)}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                <div className="flex items-start gap-3">
                     <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                        <BotLogoIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                        <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva a sua mensagem aqui..."
                rows={1}
                className="w-full pl-4 pr-12 py-3 text-sm bg-gray-100 border-transparent rounded-2xl md:rounded-full h-16 md:h-11 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-800 transition resize-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || input.trim() === ''}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-800 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center hover:bg-gray-900 transition-colors"
                aria-label="Enviar mensagem"
              >
                <ArrowRightIcon className="w-5 h-5 -mr-px" />
              </button>
            </form>
          </div>
          <div className="text-center text-xs text-gray-400 pb-2.5 bg-white md:rounded-b-[22px] flex-shrink-0">
            Powered by <span className="font-semibold text-gray-500">Gemini</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;