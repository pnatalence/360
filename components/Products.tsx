import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct, formatCurrency } from '../services/mockApi';
import ProductForm from './ProductForm';
import { TrashIcon, EditIcon } from './icons';

interface ProductsProps {
  initialAction?: string | null;
  clearInitialAction?: () => void;
}

const Products: React.FC<ProductsProps> = ({ initialAction, clearInitialAction }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialAction === 'create') {
        setEditingProduct(null);
        setIsFormOpen(true);
        clearInitialAction?.();
    }
  }, [initialAction, clearInitialAction]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem a certeza que quer apagar permanentemente este produto? Esta ação não pode ser desfeita.')) {
        await deleteProduct(productId);
        fetchProducts();
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'code' | 'active'>, productId?: string) => {
    if (productId) {
      await updateProduct(productId, productData);
    } else {
      await addProduct(productData);
    }
    handleCloseForm();
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Produtos e Serviços</h1>
        <button onClick={handleAddProduct} className="mt-4 md:mt-0 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors">
          Adicionar Produto
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center p-8 text-gray-500">A carregar produtos...</div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Preço Unitário</th>
                <th className="px-4 py-3">Taxa de Imposto</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(product.unit_price, 'AOA')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{product.tax_rate.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 p-1" aria-label={`Editar ${product.name}`}>
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 p-1" aria-label={`Apagar ${product.name}`}>
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
      {isFormOpen && <ProductForm onClose={handleCloseForm} onSave={handleSaveProduct} product={editingProduct} />}
    </div>
  );
};

export default Products;