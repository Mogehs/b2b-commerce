"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";
import { toast } from "sonner";
import { Plus, Package, Search, Filter } from "lucide-react";

export default function AddProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch products from your backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products);
      } catch (error) {
        toast.error("Failed to fetch products.");
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
      setProducts(products.filter((product) => product._id !== idToDelete));
      toast.success("Product deleted successfully!");
    } catch (error) {
      if (error.status === 401) {
        toast.error("Unauthorized Access.");
      } else {
        toast.error("Failed to delete product.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (productData, isEdit) => {
    setActionLoading(true);
    try {
      let res;
      if (isEdit && currentProduct) {
        res = await axios.patch(
          `/api/seller/products/${currentProduct._id}`,
          productData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setProducts(
          products.map((p) =>
            p._id === res.data.product._id ? res.data.product : p
          )
        );
        toast.success("Product updated successfully!");
      } else {
        res = await axios.post("/api/seller/products", productData, {
          headers: { "Content-Type": "application/json" },
        });
        setProducts([...products, res.data.product]);
        toast.success("Product added successfully!");
      }
    } catch (error) {
      if (error.status === 401) {
        toast.error("Unauthorized Access.");
      } else {
        toast.error(error.response?.data?.message || "Failed to save product.");
      }
    } finally {
      setActionLoading(false);
      setIsModalOpen(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[#C9AF2F] to-[#b79e29] rounded-xl">
                <Package className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Product Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your product catalog with ease
                </p>
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C9AF2F] to-[#b79e29] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:transform-none"
              disabled={actionLoading}
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products by name, brand, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all min-w-[200px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9AF2F]">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9AF2F]">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9AF2F]">
                {filteredProducts.length}
              </div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
          </div>
        </div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => !actionLoading && setIsModalOpen(false)}
          onSubmit={handleSubmit}
          product={currentProduct}
          loading={actionLoading}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C9AF2F] border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <Package className="mx-auto text-gray-400 mb-6" size={64} />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {searchTerm || categoryFilter
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter
                  ? "Try adjusting your search or filter criteria."
                  : "Start building your product catalog by adding your first product."}
              </p>
              {!searchTerm && !categoryFilter && (
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-[#C9AF2F] to-[#b79e29] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  disabled={actionLoading}
                >
                  <Plus size={20} />
                  Add Your First Product
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            {actionLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C9AF2F] border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing...</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
    </div>
  );
}
