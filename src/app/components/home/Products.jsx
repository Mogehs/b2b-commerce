'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


const Products = ({ selectedCategory, products, loading }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
  };


  const filteredProducts = selectedCategory && selectedCategory !== 'All Products'
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <>
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
            {filteredProducts.slice(0, 20).map((product, index) => (
              <div key={product._id || index} className="flex overflow-hidden flex-col w-full gap-4">
                <div className="w-full">
                  <img
                    className="rounded-t-[10px] object-cover w-full h-[200px]"
                    src={product.images[0].url || '/home-page/product.jpg'}
                    alt={product.name}
                  />
                  <div className="bg-white px-2 py-6 pt-0 flex flex-col gap-2 rounded-b-[10px] w-full">
                    <div>
                      {/* <p className="font-bold text-lg">{product.name}</p> */}
                      <p className="font-semibold text-[14px] line-clamp-2">{product.description}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[16px]">PKR: {product.price}</p>
                      <p className="text-[12px]">Min Qty: {product.minOrderQuantity || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='italic text-[12px]'>Madina Traders - Lahore</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button className="bg-white text-nowrap text-[12px] font-bold py-2.5 px-2 rounded hover:cursor-pointer" onClick={() => handleCardClick(product._id)}>
                    View Product
                  </button>
                  <button className="bg-white text-nowrap text-[12px] font-bold py-2.5 px-2 rounded hover:cursor-pointer">
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
