"use client";
import React from "react";

const RelatedProducts = ({ relatedProducts }) => {
  return (
    <div className="mt-10 bg-gray-50 py-2 px-4 md:px-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        RELATED PRODUCTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {relatedProducts.slice(0, 5).map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt="Product"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {product.title}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {product.price}
              </p>
              <p className="text-sm text-gray-600">{product.minQty}</p>
              <p className="text-sm text-gray-500">{product.seller}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-1 rounded hover:bg-gray-100">
                  Get Bulk Price
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-1 rounded hover:bg-gray-100">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
