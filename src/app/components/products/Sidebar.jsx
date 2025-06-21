'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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
        fixed md:static top-0 left-0 z-50 bg-white w-full md:w-[25%] h-full md:h-auto 
        shadow-lg md:shadow-none p-4 md:rounded-lg overflow-y-auto transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}
    >
      {/* Close button on mobile */}
      <div className="flex justify-end mb-4 md:hidden">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          ✕ 
        </button>
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold mb-4 text-center md:text-left text-[#C9AF2F]">
        Categories
      </h2>
      <ul className="space-y-2 mb-6">
        {categories.map((cat, index) => (
          <li key={index}>
            <button
              onClick={() => {
                setSelectedCategory(cat);
                onClose?.();
              }}
              className={`w-full text-left px-4 py-2 rounded transition uppercase hover:cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C9AF2F] text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-[#C9AF2F]">Latest Products</h3>
          <ul className="space-y-3">
            {latestProducts.slice(0, 4).map((product) => (
              <li
                key={product._id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product?.images?.[0]?.url || '/no-image.jpg'}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="text-sm text-gray-800 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-[#C9AF2F] font-semibold">
                    ${product.price?.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
