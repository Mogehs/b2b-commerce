"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "./components/common/Navbar";
import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import Badge from "./components/home/Badge";
import Categories from "./components/home/Categories";
import BrandingCards from "./components/home/BrandingCards";
import Products from "./components/home/Products";
import Brands from "./components/home/Brands";
import Region from "./components/home/Region";
import Footer from "./components/common/Footer";

const Home = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = () => {
    router.push(`/products`);
  };

  const handleSuppliersClick = () => {
    router.push("/suppliers");
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      <Header onCategorySelect={handleCategorySelect} />
      <Hero />
      <div className="bg-[#F1F1F1] p-4">
        <Badge
          first="Categories to Explore"
          second="View All"
          handleCardClick={handleCardClick}
        />
        <Categories />
        <Badge
          first="Branding Services"
          second="View All"
          handleCardClick={handleCardClick}
        />
        <BrandingCards products={products} loading={loading} />
        <Badge
          first="Products you May Like"
          second="View All"
          handleCardClick={handleCardClick}
        />
        <Products
          selectedCategory={selectedCategory}
          products={products}
          loading={loading}
        />
        <Badge first="Popular Brands" />
        <Brands />
        <Badge
          first="Find Supplier by Region"
          second="View All"
          handleCardClick={handleSuppliersClick}
        />
        <Region />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
