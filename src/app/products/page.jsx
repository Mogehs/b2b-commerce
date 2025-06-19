'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/products/Sidebar';
import ProductGrid from '../components/products/ProductGrid';

const page = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        const data = res.data.products;
        setProducts(data);

        const uniqueCategories = ['All', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedCategory);

  return (
    <main className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Product Grid */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9AF2F]"></div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </main>
  );
};

export default page;
