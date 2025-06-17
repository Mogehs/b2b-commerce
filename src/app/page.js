"use client";

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from "./components/common/Navbar";
import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import Badge from "./components/home/Badge";
import Categories from "./components/home/Categories";
import BrandingCards from "./components/home/BrandingCards";
import Products from "./components/home/Products";
import Brands from "./components/home/Brands";
import Region from "./components/home/Region";

const Home = () => {
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from backend
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

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      {/* Pass the handler function to Header */}
      <Header onCategorySelect={handleCategorySelect} />
      <Hero />
      <div className="bg-[#F1F1F1] p-4">
        <Badge first='Categories to Explore' second='View All' />
        <Categories />
        <Badge first='Branding Services' second='View All' />
        <BrandingCards products={products} loading={loading} />
        <Badge first='Products you May Like' second='View All' />
        {/* Pass selectedCategory to Products */}
        <Products selectedCategory={selectedCategory} products={products} loading={loading} />
        <Badge first='Popular Brands' second='View All' />
        <Brands />
        <Badge first='Find Supplier by Region' second='View All' />
        <Region />
      </div>
    </div>
  );
};

export default Home;
