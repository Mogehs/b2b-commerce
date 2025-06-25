"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Tag, Clock, TrendingUp, Star } from "lucide-react";

const Sidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  latestProducts = [],
  showSidebar,
  onClose,
}) => {
  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product-details/${id}`);
    onClose?.();
  };

  return (
    <div
      className={`
        fixed md:sticky md:top-[84px] md:h-[calc(100vh-84px)] top-0 left-0 z-40 bg-white w-full md:w-[300px] h-full
        shadow-xl md:shadow-lg rounded-none md:rounded-none overflow-hidden transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        border-r border-gray-200
      `}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 md:hidden bg-gradient-to-r from-[#C9AF2F] to-[#d2b33a] text-white flex-shrink-0">
        <h2 className="text-lg font-bold">Filter Products</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="h-full md:h-[calc(100vh-84px)] overflow-y-auto sidebar-scrollable">
        <div className="p-4 md:p-6">
          {/* Categories Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-[#C9AF2F]" size={20} />
              <h2 className="text-xl font-bold text-[#C9AF2F]">Categories</h2>
            </div>

            <div className="space-y-2">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(cat);
                    onClose?.();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory === cat
                      ? "bg-[#C9AF2F] text-white shadow-md transform scale-[1.02]"
                      : "hover:bg-gray-100 text-gray-700 hover:translate-x-1"
                  }`}
                >
                  <span className="font-medium">{cat}</span>
                  {selectedCategory === cat && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Latest Products Section */}
          {latestProducts.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-[#C9AF2F]" size={20} />
                <h3 className="text-lg font-semibold text-[#C9AF2F]">
                  Latest Products
                </h3>
              </div>

              <div className="space-y-3">
                {latestProducts.slice(0, 4).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all duration-200 border border-gray-100 hover:border-[#C9AF2F]/30 hover:shadow-sm"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div className="relative">
                      <img
                        src={product?.images?.[0]?.url || "/no-image.jpg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#C9AF2F]">
                          PKR {product.price?.toLocaleString()}
                        </p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} />
                          New
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-[#C9AF2F]/10 to-[#d2b33a]/10 rounded-lg border border-[#C9AF2F]/20">
                <p className="text-xs text-gray-600 text-center">
                  ✨ Fresh arrivals updated daily
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
