'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
  };

  return (
    <div
      className="flex flex-col justify-between bg-white rounded-xl overflow-hidden shadow-sm transition hover:shadow-md h-full"
    >
      {/* Product Image */}
      <div>
        <img
          className="w-full h-[180px] object-cover"
          src={product.images[0]?.url || '/home-page/product.jpg'}
          alt={product.name}
        />

        {/* Product Content */}
        <div className="p-3 flex flex-col gap-2 h-[170px]">
          <p className="font-semibold text-[16px] line-clamp-1">{product.name}</p>
          <p className="font-semibold text-[14px] text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <p className="font-bold text-[#C9AF2F] text-[15px]">PKR: {product.price}</p>
          <p className="font-semibold text-sm text-gray-700">
            Min Qty: {product.minOrderQuantity || 'N/A'}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-3 border-t mt-auto">
        <button
          className="bg-white text-nowrap text-[13px] font-semibold py-2 px-2 rounded hover:bg-gray-100 border border-gray-200 transition"
          onClick={() => handleCardClick(product._id)}
        >
          View Product
        </button>
        <button
          className="bg-white text-nowrap text-[13px] font-semibold py-2 px-2 rounded hover:bg-gray-100 border border-gray-200 transition"
        >
          Contact Seller
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
