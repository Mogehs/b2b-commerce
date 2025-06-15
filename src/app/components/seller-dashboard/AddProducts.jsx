import { useState } from 'react';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

export default function AddProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (idToDelete) => {
    setProducts(products.filter(product => product.id !== idToDelete));
  };

  const handleSubmit = (productData) => {
    if (currentProduct) {
      // Update existing product
      setProducts(products.map(product =>
        product.id === productData.id ? productData : product
      ));
    } else {
      // Add new product
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl ">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-3 md:px-7">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-nowrap"
        >
          Add New Product
        </button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={currentProduct}
      />

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products added yet. Click "Add New Product" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={() => handleDeleteProduct(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
