"use client";

import React from "react";
import Image from "next/image";

// Product card used inside SellerCard
const ProductCard = () => {
  return (
    <div className="p-4 flex-1 min-w-[150px] flex flex-col items-center">
      <Image
        src="/dashboardsupplier/p1.png"
        alt="DSLR Camera Product Image"
        width={100}
        height={100}
        className="w-28 h-28 object-cover mb-2"
      />
      <p className="text-sm font-semibold">DSLR Camera</p>
      <p className="text-sm font-semibold mt-2">Get Bulk Price</p>
    </div>
  );
};

// Card used in Group Name 2
const GroupTwoCard = () => (
  <div className="bg-white border rounded-md p-4 shadow-sm w-full">
    <div className="text-md font-bold text-black">Madina Traders</div>
    <div className="text-sm text-gray-600">Lahore, Punjab</div>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <div className="text-orange-400 text-xl mt-3">★★★★☆</div>
      <span className="ml-2 mt-3">(994)</span>
    </div>
    <div className="text-sm font-medium text-black mt-2">
      Manufacturer, Online Seller , Exporter
    </div>
    <div className="text-sm font-medium text-black mt-2">
      Garments, Industrial Machinery
    </div>
    <div className="text-sm font-medium text-black mt-2">
      OEM, Customization, Private labeling
    </div>

    <div className="flex justify-start items-center flex-wrap gap-2 mb-3 mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-xs text-gray-700"
        >
          <Image
            src="/dashboardsupplier/p1.png"
            alt="item"
            width={90}
            height={135}
            className="rounded-md"
          />
          <span className="text-center font-medium text-black text-xs mt-1">
            Get Bulk Price
          </span>
        </div>
      ))}

      <div className="flex flex-col items-end gap-2 mt-2 w-full md:w-auto md:ml-24">
        <button
          type="button"
          className="w-full md:w-[90px] h-[38px] bg-[#C9AF2F] text-black text-xs font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
        >
          Visit Store
        </button>
        <button
          type="button"
          className="w-full md:w-[90px] h-[38px] bg-[#C9AF2F] text-black text-xs font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
        >
          Contact
        </button>
      </div>
    </div>
  </div>
);

// SellerCard for Group 1
const SellerCard = () => {
  return (
    <div className="bg-white shadow rounded-md p-3 space-y-4 border">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="text-left mb-4 md:mb-0 md:max-w-md">
          <p className="text-md font-bold">Madina Traders</p>
          <p className="text-sm text-gray-600">Lahore, Punjab</p>
          <div className="flex items-center text-md text-yellow-500 mt-2">
            ★★★★☆ <span className="text-gray-500 text-xs ml-1">(994)</span>
          </div>
          <p className="text-sm mt-4 ">Manufacturer, Online Seller, Exporter</p>
          <p className="text-sm mt-4">Garments, Industrial Machinery</p>
          <p className="text-sm mt-4">OEM, Customization, Private labeling</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <ProductCard key={idx} />
            ))}
        </div>

        <div className="flex flex-col items-end gap-2 mt-2 md:mt-14 w-full md:w-auto">
          <button
            type="button"
            className="w-full md:w-[150px] h-[38px] bg-[#C9AF2F] text-black text-sm font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
          >
            Visit Store
          </button>
          <button
            type="button"
            className="w-full md:w-[150px] h-[38px] bg-[#C9AF2F] text-black text-sm font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

// Final merged component
const SellerGroups = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      {/* Group 1 Section */}
      <div className="bg-gray-100 p-6 space-y-6 w-full ">
        <h2 className="text-xl font-bold mb-4">Group Name 1</h2>
        {[1, 2, 3].map((group) => (
          <SellerCard key={group} />
        ))}
      </div>

      {/* Group 2 Section (merged below Group 1) */}
      <div className="bg-gray-100 p-6 space-y-6 w-full">
        <h2 className="text-xl font-bold mb-4">Group Name 2</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GroupTwoCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerGroups;
