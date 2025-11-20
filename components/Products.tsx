import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct, formatCurrency } from '../services/mockApi';
import ProductForm from './ProductForm';
import { TrashIcon, EditIcon, SearchIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

interface ProductsProps {
  initialAction?: string | null;
  clearInitialAction?: () => void;
}

const Products: React.FC<ProductsProps> = ({ initialAction, clearInitialAction }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

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
    } else if (initialAction?.startsWith('search:')) {
        setSearchTerm(initialAction.substring(7));
        clearInitialAction?.();
    }
  }, [initialAction, clearInitialAction]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
      setProductToDelete(productId);
      setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
      if (productToDelete) {
          await deleteProduct(productToDelete);
          fetchProducts();
          setDeleteModalOpen(false);
          setProductToDelete(null);
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

       <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Pesquisar por nome ou código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border-transparent rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
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
              {filteredProducts.map(product => (
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
                        <button onClick={() => handleDeleteClick(product.id)} className="text-red-600 hover:text-red-800 p-1" aria-label={`Apagar ${product.name}`}>
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
      
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Apagar Produto"
        message="Tem a certeza que quer apagar permanentemente este produto? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel="Apagar"
        variant="danger"
      />
    </div>
  );
};

export default Products;
