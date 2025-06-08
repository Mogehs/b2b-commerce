import React, { useState } from "react";
import FavProducts from "./favs/FavProducts";
import FavSellers from "./favs/FavSeller";

const Fav = () => {
  const [activeTab, setActiveTab] = useState("Product");

  return (
    <div>
      <div className="bg-white border border-gray-300 rounded-md mb-6">
        <div className="flex justify-center gap-4 text-center px-6 py-4 text-xl font-bold">
          <button
            onClick={() => setActiveTab("Product")}
            className={`transition-colors cursor-pointer ${
              activeTab === "Product" ? "text-[#C9AF2F]" : "text-gray-700"
            }`}
          >
            Product
          </button>
          |
          <button
            onClick={() => setActiveTab("Supplier")}
            className={`transition-colors cursor-pointer ${
              activeTab === "Supplier" ? "text-[#C9AF2F]" : "text-gray-700"
            }`}
          >
            Supplier
          </button>
        </div>
      </div>

      {/* Conditionally render based on selected tab */}
      {activeTab === "Product" && <FavProducts />}
      {activeTab === "Supplier" && <FavSellers />}
    </div>
  );
};

export default Fav;
