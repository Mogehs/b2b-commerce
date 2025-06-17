'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const cards = [
  { title1: "Low MOQ", title2: "Minimum Order Quality" },
  { title1: "OEM Services", title2: "Original Equipment Manufacture" },
  { title1: "Private Labeling", title2: "Private Label Manufactures" },
  { title1: "Ready to Ship", title2: "Deliver on time, every day" },
];

const BrandingCards = ({products, loading}) => {
      const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
  };

  return (
    <div className='my-8'>
      <div className='px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {cards.map((card, i) => (
            <div key={i} className='bg-white space-y-4 py-6 text-center'>
              <p className='text-nowrap md:text-[20px] font-bold'>{card.title1}</p>
              <p className='text-nowrap'>{card.title2}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-8 my-6'>
          {products.map((product) => (
            <div key={product._id} className='flex flex-col gap-2 hover:cursor-pointer' onClick={() => handleCardClick(product._id)} >
              <img
                className='bg-white w-full h-32 object-contain'
                src={product.images[0].url || '/home-page/dslr.png'}
                alt={product.name}
              />
              <p className='bg-white text-center font-semibold'>  {product.name.length > 12 ? product.name.slice(0, 12) + '...' : product.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandingCards;
