"use client";

import React, { useState } from "react";
import { FiSearch, FiEye } from "react-icons/fi";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleView = (rfq) => {
    setSelectedRFQ(rfq);
    setIsDialogOpen(true);
    setQuote("");
    setQuoteNote("");
  };
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    if (!quote) {
      return;
    }

    try {
      const response = await fetch(`/api/rfq/${selectedRFQ.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Quoted",
          price: quote,
          note: quoteNote,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      // Update the local state
      setRfqs(
        rfqs.map((r) =>
          r.id === selectedRFQ.id ? { ...r, status: "Quoted" } : r
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit quote:", error);
      // Show error notification
    }
  };

  const statusOptions = ["All", "Pending", "Quoted", "Closed"];

  const filteredRfqs = rfqs.filter((rfq) => {
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
              <th className="px-6 py-3 text-[#C9AF2F]">Actions</th>
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
                <td className="px-6 py-4 flex gap-3 text-lg">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                    onClick={() => handleView(rfq)}
                  >
                    <FiEye />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>RFQ Details</DialogTitle>
          </DialogHeader>
          {selectedRFQ && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Product:</span>
                  <span>{selectedRFQ.product}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Quantity:</span>
                  <span>{selectedRFQ.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span>{selectedRFQ.date}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColor[selectedRFQ.status]
                      }`}
                    >
                      {selectedRFQ.status}
                    </span>
                  </span>
                </div>
              </div>
              {selectedRFQ.status === "Pending" && (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Quote Amount
                    </label>
                    <Input
                      type="number"
                      min="1"
                      required
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Enter your quote amount"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Message/Note (optional)
                    </label>
                    <Textarea
                      value={quoteNote}
                      onChange={(e) => setQuoteNote(e.target.value)}
                      placeholder="Add a note for the buyer..."
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-[#C9AF2F] text-white hover:bg-[#b89d2c]"
                    >
                      Send Quote
                    </Button>
                  </DialogFooter>
                </form>
              )}{" "}
              {selectedRFQ.status !== "Pending" && (
                <div className="text-center py-4">
                  {selectedRFQ.status === "Quoted" ? (
                    <>
                      <p className="text-green-700 font-semibold mb-4">
                        You have already sent a quote for this RFQ.
                      </p>
                      <Button
                        onClick={() =>
                          (window.location.href = `/dashboard/seller/chat?rfq=${selectedRFQ.id}`)
                        }
                        className="bg-[#C9AF2F] text-white hover:bg-[#b89d2c]"
                      >
                        View Conversation
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-700 font-semibold">
                      This RFQ is closed.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
