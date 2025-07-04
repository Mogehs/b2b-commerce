'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // ⬅️ Only Autoplay
import 'swiper/css';

const categories = [
  { img: "/home-page/furniture.png", title: "Furniture" },
  { img: "/home-page/shirts.png", title: "Man Shirts" },
  { img: "/home-page/beauty.png", title: "Beauty" },
  { img: "/home-page/grocery.png", title: "Groceries" },
  { img: "/home-page/laptop.png", title: "Laptop" },
  { img: "/home-page/clothing.png", title: "Clothing" },
  { img: "/home-page/furniture.png", title: "Furniture" },
  { img: "/home-page/shirts.png", title: "Man Shirts" },
  { img: "/home-page/beauty.png", title: "Beauty" },
  { img: "/home-page/grocery.png", title: "Groceries" },
  { img: "/home-page/laptop.png", title: "Laptop" },
  { img: "/home-page/clothing.png", title: "Clothing" },
];

const Categories = () => {
  return (
    <div className='my-6 px-4 bg-white'>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{ delay: 2500 }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        loop={true} 
        className='pb-4'
      >
        {categories.map((category, i) => (
          <SwiperSlide key={i}>
<div className='flex flex-col items-center gap-2 p-2 hover:scale-105 transition'>
  <div className="h-24 w-32 bg-white flex items-center justify-center overflow-hidden">
    <img
      className='object-contain h-full'
      src={category.img}
      alt={category.title}
    />
  </div>
  <p className='text-center text-sm md:text-base font-medium'>{category.title}</p>
</div>

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;
