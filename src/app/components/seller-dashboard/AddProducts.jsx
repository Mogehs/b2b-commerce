'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import { toast } from 'sonner';

export default function AddProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);           
  const [actionLoading, setActionLoading] = useState(false); 

  // Fetch products from your backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.products);
      } catch (error) {
        toast.error('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  };

  const handleDeleteProduct = async (idToDelete) => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/seller/products/${idToDelete}`);
      setProducts(products.filter(product => product._id !== idToDelete));
      toast.success('Product deleted successfully!');
    } catch (error) {
            if(error.status === 401) {
              toast.error('Unauthorized Access.');
      } else {
      toast.error('Failed to delete product.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (formData, isEdit) => {
    setActionLoading(true);
    try {
      let res;
      if (isEdit && currentProduct) {
        res = await axios.patch(`/api/seller/products/${currentProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts(products.map(p => (p._id === res.data.product._id ? res.data.product : p)));
        toast.success('Product updated successfully!');
      } else {
        res = await axios.post('/api/seller/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts([...products, res.data.product]);
        toast.success('Product added successfully!');
      }
    } catch (error) {
      if(error.status === 401) {
              toast.error('Unauthorized Access.');
      } else {
        toast.error('Failed to save product.');
      }
    } finally {
      setActionLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-3 md:px-7">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-nowrap disabled:opacity-50"
          disabled={actionLoading}
        >
          Add New Product
        </button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => !actionLoading && setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={currentProduct}
        loading={actionLoading} 
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No products found. Click "Add New Product" to get started.
          </p>
        </div>
      ) : (
        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9AF2F]"></div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={() => handleDeleteProduct(product._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
