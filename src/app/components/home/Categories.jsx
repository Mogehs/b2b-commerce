"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

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
  const router = useRouter();

  const handleCategoryClick = (category) => {
    // Navigate to products page with category filter
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="my-6 px-4 bg-white group relative">
      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute z-20 left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full p-2 sm:p-1.5 lg:p-2 text-[#C9AF2F] hover:bg-[#C9AF2F] hover:text-white shadow-lg transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={18} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
      </button>
      <button
        ref={nextRef}
        className="absolute z-20 right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full p-2 sm:p-1.5 lg:p-2 text-[#C9AF2F] hover:bg-[#C9AF2F] hover:text-white shadow-lg transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronRight size={18} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
      </button>

      {/* Swiper Carousel */}
      <div className="px-8 sm:px-6 lg:px-0">
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
            if (typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          loop={false}
          className="pb-4"
        >
          {categories.map((category, i) => (
            <SwiperSlide key={i}>
              <div
                className="flex flex-col items-center gap-2 py-2 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleCategoryClick(category.title)}
              >
                <div className="h-24 md:h-28 w-full bg-white flex items-center justify-center overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    className="object-cover h-full rounded-lg w-full"
                    src={category.img}
                    alt={category.title}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-medium text-gray-700 hover:text-[#C9AF2F] transition-colors">
                  {category.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Categories;
