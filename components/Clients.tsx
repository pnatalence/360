import React, { useState, useEffect } from 'react';
import type { Client } from '../types';
import { getClients, addClient, updateClient, deleteClient } from '../services/mockApi';
import { XIcon, TrashIcon, EditIcon } from './icons';

interface ClientFormProps {
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt'>, clientId?: string) => void;
  client?: Client | null;
}

const InputField = ({ label, name, value, onChange, required = false, type = 'text' }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, type?: string }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const ClientForm: React.FC<ClientFormProps> = ({ onClose, onSave, client }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    tax_id: client?.tax_id || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    zip: client?.zip || '',
    country: client?.country || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.tax_id) {
      alert('Por favor, preencha o Nome, Email e NIF.');
      return;
    }
    onSave(formData, client?.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black md:bg-opacity-50 flex items-center justify-center md:p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 shadow-2xl w-full h-full md:w-full md:max-w-2xl md:h-auto md:max-h-[90vh] md:rounded-xl flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{client ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">Fechar</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Preencha os detalhes abaixo para adicionar um novo cliente ao seu sistema.
            </p>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <InputField label="Nome do Cliente ou Empresa" name="name" value={formData.name} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
              <InputField label="Telefone" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
            </div>
            <InputField label="NIF (Número de Identificação Fiscal)" name="tax_id" value={formData.tax_id} onChange={handleChange} required />

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalhes de Faturação (Opcional)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Estes detalhes serão usados para preencher automaticamente as faturas.</p>
            </div>

            <InputField label="Morada" name="address" value={formData.address} onChange={handleChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Cidade" name="city" value={formData.city} onChange={handleChange} />
              <InputField label="Província / Estado" name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Código Postal" name="zip" value={formData.zip} onChange={handleChange} />
              <InputField label="País" name="country" value={formData.country} onChange={handleChange} />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto md:rounded-b-xl flex justify-end space-x-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ClientsProps {
  initialAction?: string | null;
  clearInitialAction?: () => void;
}

const Clients: React.FC<ClientsProps> = ({ initialAction, clearInitialAction }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    const data = await getClients();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);
  
  useEffect(() => {
    if (initialAction === 'create') {
        setEditingClient(null);
        setIsFormOpen(true);
        clearInitialAction?.();
    }
  }, [initialAction, clearInitialAction]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Tem a certeza que quer apagar permanentemente este cliente? Esta ação não pode ser desfeita.')) {
        await deleteClient(clientId);
        fetchClients();
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt'>, clientId?: string) => {
    if (clientId) {
      await updateClient(clientId, clientData);
    } else {
      await addClient(clientData);
    }
    handleCloseForm();
    fetchClients();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
        <button onClick={handleAddClient} className="mt-4 md:mt-0 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors">
          Adicionar Cliente
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center p-8 text-gray-500">A carregar clientes...</div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">NIF</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{client.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{client.tax_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{client.phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClient(client)} className="text-blue-600 hover:text-blue-800 p-1" aria-label={`Editar ${client.name}`}>
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-800 p-1" aria-label={`Apagar ${client.name}`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
      {isFormOpen && <ClientForm onClose={handleCloseForm} onSave={handleSaveClient} client={editingClient} />}
    </div>
  );
};

export default Clients;