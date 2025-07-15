'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="my-6 px-4 bg-white group relative">
      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute z-10 left-0 top-1/2 -translate-y-1/2 text-[#C9AF2F] text-[25px] shadow transition-opacity opacity-0 group-hover:opacity-100"
      >
        &lt;
      </button>
      <button
        ref={nextRef}
        className="absolute z-10 right-0 top-1/2 -translate-y-1/2 text-[#C9AF2F] text-[25px] shadow transition-opacity opacity-0 group-hover:opacity-100"
      >
        &gt;
      </button>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3.2 },
          768: { slidesPerView: 4.2 },
          1024: { slidesPerView: 5.2 },
          1280: { slidesPerView: 6.5 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        loop={false}
        className="pb-4"
      >
        {categories.map((category, i) => (
          <SwiperSlide key={i}>
            <div className='flex flex-col items-center gap-2 py-2 hover:scale-105 transition'>
              <div className="h-24 md:h-28 w-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  className='object-cover h-full rounded w-full space-x-2'
                  src={category.img}
                  alt={category.title}
                />
              </div>
              <p className='text-center text-sm md:text-base font-medium'>
                {category.title}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;
