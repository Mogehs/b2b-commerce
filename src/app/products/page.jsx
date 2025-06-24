"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/products/Sidebar";
import ProductGrid from "../components/products/ProductGrid";
import Navbar from "../components/common/Navbar";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const searchParams = useSearchParams();
const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        const data = res.data.products;
        setProducts(data);

        const uniqueCategories = [
          "All",
          ...new Set(data.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        const sortedByDate = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestProducts(sortedByDate.slice(0, 4));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const filteredByCategory =
  selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

const filteredProducts =
  searchQuery && searchQuery !== "all"
    ? filteredByCategory.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      )
    : filteredByCategory;

  return (
    <>
      <Navbar />

      {/* Mobile Sidebar Toggle Button */}
      {!showSidebar && (
        <div className="p-4 md:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-[#C9AF2F] text-white px-4 py-2 rounded shadow"
          >
            ☰ Show Sidebar
          </button>
        </div>
      )}

      <main className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          latestProducts={latestProducts}
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
        />

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9AF2F]"></div>
            </div>
          ) : (
            filteredProducts.length === 0 ? (
<div className="text-center mt-10 text-gray-600 text-xl">
  No products found for <span className="font-semibold">"{searchQuery}"</span>
</div>
) : (
  <ProductGrid products={filteredProducts} />
)

          )}
        </div>
      </main>
    </>
  );
};

export default Page;
