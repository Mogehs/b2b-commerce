'use client';

import React from 'react';

const Products = ({ selectedCategory, products, loading }) => {


  // Optional: Filter by category if your backend doesn't support it
  const filteredProducts = selectedCategory && selectedCategory !== 'All Products'
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="my-8">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8">
          {filteredProducts.map((product, index) => (
            <div key={product._id || index} className="flex overflow-hidden flex-col w-full gap-4">
              <div className="w-full">
                <img
                  className="rounded-t-xl object-cover w-full h-[180px]"
                  src={product.images[0].url || '/home-page/product.jpg'}
                  alt={product.name}
                />
                <div className="bg-white p-2 flex flex-col gap-2 rounded-b-xl w-full">
                  <p className="font-semibold">{product.name}</p>
                  <p className="font-semibold">{product.description}</p>
                  <p className="font-bold">PKR: {product.price}</p>
                  <p className="font-semibold">Min Qty: {product.minOrderQuantity || 'N/A'}</p>
                  {/* <p className="font-semibold">{product.seller || 'Unknown Seller'}</p> */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="bg-white text-nowrap text-[14px] font-semibold py-2 px-2 rounded hover:cursor-pointer">
                  View Number
                </button>
                <button className="bg-white text-nowrap text-[14px] font-semibold py-2 px-2 rounded hover:cursor-pointer">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
