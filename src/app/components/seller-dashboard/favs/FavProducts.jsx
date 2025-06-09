"use client";
import React from "react";

export default function FavProducts() {
  const products = Array(4).fill(0);

  const ProductCard = () => (
    <div className="bg-white rounded shadow-sm flex flex-col items-start">
      <img
        src="/dashboardproduct/p1.jpg"
        alt="Kids Custom T-Shirt"
        className="mb-2 rounded w-full h-[230px] md:w-[250px] md:h-[255px]"
      />
      <div className="text-sm text-left px-2 mb-2 text-black">
        Kids Custom Name T Shirt Is Free Delivery All Across Pakistan...
      </div>
      <div className="text-sm font-bold text-left px-2 text-black">
        PKR - 1500
      </div>
      <div className="text-xs text-gray-600 text-left px-2">
        Min Qty - 100 Pcs
      </div>
      <div className="text-xs italic text-gray-500 mt-2 mb-3 text-left px-2">
        Madina Traders - Lahore
      </div>
      <div className="flex px-2 pb-3 gap-2 w-full">
        <button className="flex-1 text-xs bg-white border border-gray-300 px-5 py-2 rounded shadow hover:bg-gray-50 font-medium text-black">
          View Number
        </button>
        <button className="flex-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 text-black px-3 py-2 rounded font-medium">
          Get Bulk Price
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="flex flex-col md:flex-row rounded">
        {/* Sidebar */}
        <div className="w-full md:max-w-[250px] border border-[#ACAAAA] space-y-2 flex-shrink-0  bg-white overflow-y-auto rounded">
          {/* Company Buttons */}
          {["Madina Traders", "ABC Agri", "Climax Electric Company"].map(
            (company, idx) => (
              <div
                key={idx}
                className={`${
                  idx === 0 ? "bg-[#ACAAAA]" : "bg-white hover:bg-gray-100"
                } border-b text-center px-4 py-4 text-sm font-medium text-black cursor-pointer`}
              >
                {company}
              </div>
            )
          )}
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col bg-white px-2 py-4 mt-4 md:mt-0 md:ml-4 rounded">
          {/* Group 1 */}
          <section className="mb-10 w-full">
            <h2 className="text-2xl font-bold mb-4">Group Name 1</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((_, idx) => (
                <ProductCard key={`g1-${idx}`} />
              ))}
            </div>
          </section>

          {/* Group 2 */}
          <section className="w-full">
            <h2 className="text-2xl font-bold mb-4">Group Name 2</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((_, idx) => (
                <ProductCard key={`g2-${idx}`} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
