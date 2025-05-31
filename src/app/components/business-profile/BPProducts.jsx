"use client";

import React, { useState } from "react";
import clsx from "clsx";
import InfoCertificates from "../common/information-certificates/InfoCertificates";

const categories = [
  "All Products",
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Toys",
  "Beauty",
];

const BPProducts = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <>
      <div className="flex flex-col bg-white rounded  mt-6 p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Our Products</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div
            className={clsx(
              "bg-white border-gray-200 flex",
              "flex-col md:w-60 md:border-r w-full md:h-screen h-auto",
              "sticky md:top-10 top-0 z-10"
            )}
          >
            <nav
              className={clsx(
                "flex overflow-x-auto md:flex-col flex-row md:space-y-2 space-x-2 md:space-x-0 md:px-4 px-2 py-2"
              )}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={clsx(
                    "text-sm px-4 py-2 rounded-md whitespace-nowrap",
                    selectedCategory === category
                      ? "bg-[#C9AF2F] text-white font-semibold"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
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
                ))
              ) : (
                <p className="text-gray-500 col-span-full">
                  No products found in this category.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <InfoCertificates />
    </>
  );
};

export default BPProducts;
