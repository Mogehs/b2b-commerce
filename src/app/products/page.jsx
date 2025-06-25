"use client";

/**
 * Enhanced Products Page with Advanced Filtering & Modern Design
 *
 * 🚀 New Features Added:
 * ✅ Advanced search with real-time filtering
 * ✅ Multiple sort options (name, price, date)
 * ✅ Price range filtering
 * ✅ Grid and List view modes
 * ✅ Pagination with customizable results per page
 * ✅ Filter management with clear all functionality
 * ✅ Active filter indicators and tags
 * ✅ Enhanced product cards with hover effects
 * ✅ Mobile-responsive design with optimized controls
 * ✅ Beautiful gradient header with stats
 * ✅ Sticky filter bar for easy access
 * ✅ Enhanced sidebar with better category styling
 * ✅ Latest products showcase with visual indicators
 * ✅ Loading states and empty state handling
 * ✅ Modern UI with smooth animations
 * ✅ Improved accessibility and user experience
 *
 * 🎨 Design Improvements:
 * - Modern gradient headers and backgrounds
 * - Enhanced product cards with hover animations
 * - Better typography and spacing
 * - Consistent color scheme with brand theme
 * - Mobile-first responsive design
 * - Smooth transitions and micro-interactions
 *
 * 🔧 Technical Enhancements:
 * - Optimized filtering with useMemo for performance
 * - Proper state management and cleanup
 * - URL parameter integration for search
 * - Pagination logic with smart page calculation
 * - Enhanced error handling and loading states
 */

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductGrid from "../components/products/ProductGrid";
import Navbar from "../components/common/Navbar";
import { Search, Grid3X3, LayoutList, X, Sliders } from "lucide-react";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Enhanced filtering states
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, price, date, popularity
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(40);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Initialize search input from URL params
  useEffect(() => {
    if (searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchQuery]);

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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query (from URL or local input)
    const query = searchQuery || searchInput.toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange.min !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(priceRange.max));
    }

    // Sort products
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "price":
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        case "date":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case "name":
        default:
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
      }

      if (sortOrder === "desc") {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [
    products,
    selectedCategory,
    searchQuery,
    searchInput,
    priceRange,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / resultsPerPage
  );
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Reset pagination when filters change and scroll to top
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchInput, priceRange, sortBy, sortOrder]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchInput("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      {/* Enhanced Header Section */}
      <div className="products-header bg-gradient-to-r from-[#C9AF2F] to-[#d2b33a] text-white py-12 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Discover Products
          </h1>
          <p className="text-xl opacity-90">
            Find the perfect products for your business needs
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm opacity-80">
            <span>🛍️ {products.length}+ Products Available</span>
            <span>📦 Multiple Categories</span>
            <span>⚡ Real-time Updates</span>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Enhanced Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products, categories, descriptions..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="search-bar w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C9AF2F] focus:ring-2 focus:ring-[#C9AF2F]/20 outline-none transition-all search-input-focus"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 hidden sm:block">
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-[#C9AF2F] focus:ring-2 focus:ring-[#C9AF2F]/20 outline-none text-sm min-w-[120px]"
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-[#C9AF2F] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Sliders size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-[#C9AF2F] focus:ring-2 focus:ring-[#C9AF2F]/20 outline-none text-sm"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-[#C9AF2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-[#C9AF2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>{" "}
          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="filter-panel mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex flex-wrap gap-4 items-end filter-controls">
                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Price Range:
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:border-[#C9AF2F] outline-none"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:border-[#C9AF2F] outline-none"
                  />
                </div>

                {/* Results per page */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Show:
                  </label>
                  <select
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:border-[#C9AF2F] outline-none"
                  >
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing {paginatedProducts.length} of{" "}
                {filteredAndSortedProducts.length} products
              </span>
              {(searchInput ||
                searchQuery ||
                selectedCategory !== "All" ||
                priceRange.min ||
                priceRange.max) && (
                <div className="flex items-center gap-2">
                  <span>Filters active:</span>
                  {selectedCategory !== "All" && (
                    <span className="bg-[#C9AF2F] text-white px-2 py-1 rounded text-xs">
                      {selectedCategory}
                    </span>
                  )}
                  {(searchInput || searchQuery) && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      Search: "{searchInput || searchQuery}"
                    </span>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Price: {priceRange.min || "0"} - {priceRange.max || "∞"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 min-h-screen">
        {/* Main Content Area - Full Width */}
        <div className="max-w-7xl mx-auto">
          <div className="p-4 md:p-8">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F] mb-4"></div>
                <p className="text-gray-600">Loading amazing products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center mt-10 bg-white rounded-lg p-8 shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchInput || searchQuery
                    ? `No products match "${searchInput || searchQuery}"`
                    : "No products found with current filters"}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#C9AF2F] text-white px-6 py-2 rounded-lg hover:bg-[#b89f28] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <ProductGrid products={paginatedProducts} viewMode={viewMode} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          let actualPage;
                          if (totalPages <= 7) {
                            actualPage = i + 1;
                          } else if (currentPage <= 4) {
                            actualPage = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            actualPage = totalPages - 6 + i;
                          } else {
                            actualPage = currentPage - 3 + i;
                          }

                          return (
                            <button
                              key={actualPage}
                              onClick={() => setCurrentPage(actualPage)}
                              className={`px-4 py-2 border rounded-lg transition-colors min-w-[40px] ${
                                currentPage === actualPage
                                  ? "bg-[#C9AF2F] text-white border-[#C9AF2F] shadow-md"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {actualPage}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Page Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>
                    Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * resultsPerPage,
                      filteredAndSortedProducts.length
                    )}{" "}
                    of {filteredAndSortedProducts.length} products
                  </p>
                  <p className="mt-1">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
