"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

const initialRfqs = [
  {
    id: 1,
    product: "LED TV 55 inch",
    quantity: "100 Units",
    status: "No Quote",
    date: "2025-06-01",
  },
  {
    id: 2,
    product: "Bluetooth Headphones",
    quantity: "500 Units",
    status: "Quote Received",
    date: "2025-05-28",
  },
  {
    id: 3,
    product: "Smartphone 6.5 inch",
    quantity: "300 Units",
    status: "Quote Received",
    date: "2025-05-15",
  },
  {
    id: 4,
    product: "Gaming Laptops",
    quantity: "75 Units",
    status: "No Quote",
    date: "2025-06-05",
  },
  {
    id: 5,
    product: "Wireless Routers",
    quantity: "200 Units",
    status: "Quote Received",
    date: "2025-06-03",
  },
];

const statusColor = {
  "No Quote": "bg-yellow-100 text-yellow-800",
  "Quote Received": "bg-green-100 text-green-800",
};

export default function MyRFQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOptions = ["All", "Quote Received", "No Quote"];

  const filteredRfqs = initialRfqs.filter((rfq) => {
    const matchesSearch = rfq.product
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#C9AF2F]">📋 My RFQs</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition
              ${
                statusFilter === status
                  ? "bg-[#C9AF2F] text-white border-[#C9AF2F]"
                  : "bg-white text-[#C9AF2F] border-[#C9AF2F] hover:bg-[#f7f3e3]"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

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
              <th className="px-6 py-3 text-[#C9AF2F]">Quote/Chat</th>
            </tr>
          </thead>
          <tbody>
            {filteredRfqs.map((rfq) => (
              <tr
                key={rfq.id}
                className="border-t hover:bg-blue-50 transition-all"
              >
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {rfq.product}
                </td>
                <td className="px-6 py-4 text-gray-700">{rfq.quantity}</td>
                <td className="px-6 py-4 text-gray-600">{rfq.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColor[rfq.status]
                    }`}
                  >
                    {rfq.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {rfq.status === "Quote Received" ? (
                    <Link
                      href={`/dashboard/chat?rfq=${rfq.id}`}
                      className="inline-block bg-[#C9AF2F] text-white px-4 py-2 rounded-lg hover:bg-[#b89d2c] transition"
                    >
                      View Quote & Chat
                    </Link>
                  ) : (
                    <span className="text-yellow-700 font-medium">
                      Waiting for Quote
                    </span>
                  )}
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
