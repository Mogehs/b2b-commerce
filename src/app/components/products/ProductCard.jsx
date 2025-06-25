"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Eye,
  MessageCircle,
  Calendar,
  Package,
} from "lucide-react";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-48 h-48 md:h-32 flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={product.images[0]?.url || "/home-page/product.jpg"}
              alt={product.name}
            />
          </div>

          {/* Product Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-xs bg-[#C9AF2F]/10 text-[#C9AF2F] px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  Min Qty: {product.minOrderQuantity || "N/A"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(product.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-bold text-[#C9AF2F] text-xl">
                PKR {product.price?.toLocaleString()}
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  onClick={() => handleCardClick(product._id)}
                >
                  <Eye size={14} />
                  View
                </button>
                <button className="bg-[#C9AF2F] hover:bg-[#b89f28] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                  <MessageCircle size={14} />
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="flex flex-col justify-between bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full border border-gray-100 group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
          src={product.images[0]?.url || "/home-page/product.jpg"}
          alt={product.name}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 text-[#C9AF2F] text-xs font-medium px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-2 group-hover:text-[#C9AF2F] transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Package size={14} />
            Min: {product.minOrderQuantity || "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(product.createdAt)}
          </div>
        </div>

        <div className="font-bold text-[#C9AF2F] text-xl">
          PKR {product.price?.toLocaleString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-3">
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          onClick={() => handleCardClick(product._id)}
        >
          <Eye size={14} />
          View Details
        </button>
        <button className="bg-[#C9AF2F] hover:bg-[#b89f28] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
          <MessageCircle size={14} />
          Contact
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
