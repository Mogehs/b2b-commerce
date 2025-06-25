import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, viewMode = "grid" }) => {
  if (!products.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-600 text-lg">
          No products found in this category.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} viewMode="list" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product._id} className="h-full">
          <ProductCard product={product} viewMode="grid" />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
