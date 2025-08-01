"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import Loader from "@/app/components/common/Loader";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  Quoted: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
};

export default function MyRFQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const statusOptions = ["All", "Quoted", "Pending", "Closed"];

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rfq?role=buyer");

        if (response.data && response.data.rfqs) {
          setRfqs(response.data.rfqs);
        } else {
          setRfqs([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching RFQs:", err);
        setError("Failed to fetch your RFQs. Please try again later.");
        setLoading(false);
      }
    };

    fetchRFQs();
  }, []);

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChatClick = (rfq) => {
    if (rfq.conversation) {
      router.push(`/dashboard/buyer/chat?conversationId=${rfq.conversation}`);
    } else {
      router.push(`/dashboard/buyer/chat`);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

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

      {loading ? (
      <Loader/>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
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
              {filteredRfqs.length > 0 ? (
                filteredRfqs.map((rfq) => (
                  <tr
                    key={rfq._id}
                    className="border-t hover:bg-blue-50 transition-all"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {rfq.productName ||
                        (rfq.product && rfq.product.name) ||
                        "Unknown Product"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{rfq.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(rfq.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColor[rfq.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleChatClick(rfq)}
                        className="inline-block bg-[#C9AF2F] text-white px-4 py-2 rounded-lg hover:bg-[#b89d2c] transition"
                      >
                        {rfq.status === "Quoted"
                          ? "View Quote & Chat"
                          : "Open Chat"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-6 py-8 text-gray-500"
                  >
                    {searchTerm || statusFilter !== "All"
                      ? "No RFQs found matching your search."
                      : "You have not created any RFQs yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
