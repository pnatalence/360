
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { addClient } from '../services/mockApi';
import { ArrowRightIcon, BotLogoIcon, XIcon } from './icons';
import type { ChatMessage, View } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setView: (view: View, action?: string) => void;
}

// Define local interface for FunctionCall to avoid import issues
interface FunctionCall {
  name: string;
  args: Record<string, any>;
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
        case 'find_client_to_edit':
          setView('clients', `search:${args.client_name}`);
          return { success: true, message: `A procurar pelo cliente "${args.client_name}" para que o possa editar.` };
        case 'find_product_to_edit':
          setView('products', `search:${args.product_name_or_code}`);
          return { success: true, message: `A procurar pelo produto "${args.product_name_or_code}" para que o possa editar.` };
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
    
    // Pass previous messages (excluding the initial one) for context
    const history = messages.slice(1);
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Determine API URL based on environment
    // Use optional chaining to prevent crashes if env is undefined
    const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentInput, history }),
        });

        if (!response.ok || !response.body) {
            throw new Error('Network response was not ok.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let botMessageText = '';
        const functionCalls: FunctionCall[] = [];
        const botMessageId = Date.now().toString() + '-bot';
        
        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '...', timestamp: new Date().toISOString() }]);

        let buffer = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || ''; // Keep the last, possibly incomplete, part

            for (const part of parts) {
                if (part.startsWith('data: ')) {
                    try {
                        const jsonStr = part.substring(6).trim();
                        if (!jsonStr) continue;
                        const data = JSON.parse(jsonStr);
                        
                        if (data.text) {
                            botMessageText += data.text;
                            setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: botMessageText} : m));
                        }
                        if (data.functionCalls) {
                            functionCalls.push(...data.functionCalls);
                        }
                    } catch (parseError) {
                        console.error("Erro ao analisar o pedaço de dados do stream: ", part.substring(6), parseError);
                    }
                }
            }
        }
        
        // Handle any remaining text in buffer (though less likely with SSE)
        if (botMessageText === '...') {
             setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: ''} : m));
        }

        if (functionCalls.length > 0) {
            let finalBotResponseText = botMessageText ? botMessageText + '\n' : '';
            for(const call of functionCalls) {
                const result = await handleFunctionCall(call);
                // For simplicity, we're assuming the model doesn't need the function result back
                // A more complex implementation would send the result back to the chat
                finalBotResponseText += result.message;
            }
             setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: finalBotResponseText } : m));
        }
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Desculpe, ocorreu um erro de comunicação com o servidor. Por favor, tente novamente.',
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

        <div className="flex-1 bg-white dark:bg-gray-800 md:rounded-t-3xl md:rounded-b-[22px] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
                    <BotLogoIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className={`max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'order-2' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                      msg.sender === 'bot'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
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
                     <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
                        <BotLogoIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-800">
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
          
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva a sua mensagem aqui..."
                rows={1}
                className="w-full pl-4 pr-12 py-3 text-sm bg-gray-100 dark:bg-gray-700 border-transparent rounded-2xl md:rounded-full h-16 md:h-11 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-800 dark:text-gray-200 transition resize-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || input.trim() === ''}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                aria-label="Enviar mensagem"
              >
                <ArrowRightIcon className="w-5 h-5 -mr-px" />
              </button>
            </form>
          </div>
          <div className="text-center text-xs text-gray-400 pb-2.5 bg-white dark:bg-gray-800 md:rounded-b-[22px] flex-shrink-0">
            Powered by <span className="font-semibold text-gray-500 dark:text-gray-400">Gemini</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
