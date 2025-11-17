import React, { useState } from 'react';
import type { Product } from '../types';
import { XIcon } from './icons';

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'code' | 'active'>, productId?: string) => void;
  product?: Product | null;
}

const InputField = ({ label, name, value, onChange, required = false, type = 'text', placeholder = '' }: { label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, type?: string, placeholder?: string }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={type === 'number' ? 0 : undefined}
      step={type === 'number' ? '0.01' : undefined}
      className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    unit_price: product?.unit_price || 0,
    tax_rate: product?.tax_rate || 23,
    barcode: product?.barcode || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.unit_price <= 0) {
      alert('Por favor, preencha o Nome e um Preço Unitário válido.');
      return;
    }
    onSave(formData, product?.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black md:bg-opacity-50 flex items-center justify-center md:p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 shadow-2xl w-full h-full md:w-full md:max-w-lg md:h-auto md:max-h-[90vh] md:rounded-xl flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">Fechar</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Preencha os detalhes abaixo para adicionar um novo item faturável.
            </p>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <InputField label="Nome do Produto/Serviço" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Código de Barras" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Opcional" />
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Preço Unitário (AOA)" name="unit_price" value={formData.unit_price} onChange={handleChange} required type="number" />
              <InputField label="Taxa de Imposto (%)" name="tax_rate" value={formData.tax_rate} onChange={handleChange} required type="number" />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto md:rounded-b-xl flex justify-end space-x-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
              Guardar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;