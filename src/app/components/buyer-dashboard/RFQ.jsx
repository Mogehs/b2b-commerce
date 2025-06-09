"use client";

import React, { useState } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const initialRfqs = [
  {
    id: 1,
    product: "LED TV 55 inch",
    quantity: "100 Units",
    status: "Pending",
    date: "2025-06-01",
  },
  {
    id: 2,
    product: "Bluetooth Headphones",
    quantity: "500 Units",
    status: "Quoted",
    date: "2025-05-28",
  },
  {
    id: 3,
    product: "Smartphone 6.5 inch",
    quantity: "300 Units",
    status: "Closed",
    date: "2025-05-15",
  },
  {
    id: 4,
    product: "Gaming Laptops",
    quantity: "75 Units",
    status: "Pending",
    date: "2025-06-05",
  },
  {
    id: 5,
    product: "Wireless Routers",
    quantity: "200 Units",
    status: "Quoted",
    date: "2025-06-03",
  },
];

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  Quoted: "bg-green-100 text-green-800",
  Closed: "bg-gray-200 text-gray-700",
};

export default function MyRFQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rfqs, setRfqs] = useState(initialRfqs);

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this RFQ?");
    if (confirmDelete) {
      setRfqs((prev) => prev.filter((rfq) => rfq.id !== id));
    }
  };

  const handleView = (rfq) => {
    alert(`Viewing RFQ:\n\nProduct: ${rfq.product}\nQuantity: ${rfq.quantity}\nStatus: ${rfq.status}\nDate: ${rfq.date}`);
  };

  const handleEdit = (rfq) => {
    const newProduct = prompt("Edit product name:", rfq.product);
    if (newProduct !== null && newProduct.trim() !== "") {
      setRfqs((prev) =>
        prev.map((item) =>
          item.id === rfq.id ? { ...item, product: newProduct } : item
        )
      );
    }
  };

  const filteredRfqs = rfqs.filter((rfq) =>
    rfq.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#C9AF2F]">📋 My RFQs</h1>

      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="🔍 Search RFQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-[#C9AF2F] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C9AF2F]"
        />
        <button className="p-2 bg-[#D2B33A] text-white rounded-lg hover:bg-yellow-600 cursor-pointer">
          <FiSearch size={20} />
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#EBEBEB] uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-[#C9AF2F]">Product</th>
              <th className="px-6 py-3 text-[#C9AF2F]">Quantity</th>
              <th className="px-6 py-3 text-[#C9AF2F]">Date</th>
              <th className="px-6 py-3 text-[#C9AF2F]">Status</th>
              <th className="px-6 py-3 text-[#C9AF2F]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRfqs.map((rfq) => (
              <tr key={rfq.id} className="border-t hover:bg-blue-50 transition-all">
                <td className="px-6 py-4 font-semibold text-gray-800">{rfq.product}</td>
                <td className="px-6 py-4 text-gray-700">{rfq.quantity}</td>
                <td className="px-6 py-4 text-gray-600">{rfq.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[rfq.status]}`}>{rfq.status}</span>
                </td>
                <td className="px-6 py-4 flex gap-3 text-lg">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                    onClick={() => handleView(rfq)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700 transition-transform hover:scale-110"
                    onClick={() => handleEdit(rfq)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                    onClick={() => handleDelete(rfq.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRfqs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-6 py-4 text-gray-500">
                  No RFQs found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}