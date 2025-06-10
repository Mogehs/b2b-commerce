"use client";
import React, { useState } from "react";

const allProducts = [
  {
    id: 1,
    title: "Kids Custom Name T Shirt",
    price: 1500,
    qty: 100,
    company: "Madina Traders",
    location: "Lahore",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 2,
    title: "Customized Printed Hoodie",
    price: 2500,
    qty: 50,
    company: "Madina Traders",
    location: "Lahore",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 3,
    title: "Cotton Polo Shirt",
    price: 1800,
    qty: 80,
    company: "Madina Traders",
    location: "Lahore",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 4,
    title: "Organic Fertilizer Pack",
    price: 1200,
    qty: 200,
    company: "ABC Agri",
    location: "Multan",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 5,
    title: "Hybrid Seeds Packet",
    price: 900,
    qty: 150,
    company: "ABC Agri",
    location: "Multan",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 6,
    title: "Electric Drill Machine",
    price: 3200,
    qty: 30,
    company: "Climax Electric",
    location: "Karachi",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 7,
    title: "Ceiling Fan 56\"",
    price: 2800,
    qty: 60,
    company: "Climax Electric",
    location: "Karachi",
    image: "/dashboardproduct/p1.jpg",
  },
  {
    id: 8,
    title: "LED Tube Light",
    price: 600,
    qty: 100,
    company: "Climax Electric",
    location: "Karachi",
    image: "/dashboardproduct/p1.jpg",
  },
];

export default function FavProducts() {
  const [selectedCompany, setSelectedCompany] = useState("All");

  const filteredProducts =
    selectedCompany === "All"
      ? allProducts
      : allProducts.filter((p) => p.company === selectedCompany);

  const companies = ["All", "Madina Traders", "ABC Agri", "Climax Electric"];

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded shadow-sm flex flex-col items-start">
      <img
        src={product.image}
        alt={product.title}
        className="mb-2 rounded w-full h-[230px] md:w-[250px] md:h-[255px]"
      />
      <div className="text-sm text-left px-2 mb-2 text-black">{product.title}</div>
      <div className="text-sm font-bold text-left px-2 text-black">
        PKR - {product.price}
      </div>
      <div className="text-xs text-gray-600 text-left px-2">
        Min Qty - {product.qty} Pcs
      </div>
      <div className="text-xs italic text-gray-500 mt-2 mb-3 text-left px-2">
        {product.company} - {product.location}
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
        <div className="w-full md:max-w-[250px] border border-[#ACAAAA] space-y-2 flex-shrink-0 bg-white overflow-y-auto rounded">
          {companies.map((company, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCompany(company)}
              className={`${
                selectedCompany === company
                  ? "bg-[#ACAAAA]"
                  : "bg-white hover:bg-gray-100"
              } border-b text-center px-4 py-4 text-sm font-medium text-black cursor-pointer`}
            >
              {company}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col bg-white px-2 py-4 mt-4 md:mt-0 md:ml-4 rounded">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCompany === "All" ? "All Products" : selectedCompany}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
