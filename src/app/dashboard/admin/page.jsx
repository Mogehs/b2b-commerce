"use client";

import { useState } from "react";
import Navbar from "@/app/components/common/Navbar";
import Applications from "@/app/components/admin-dashboard/Applications";
import ApprovedSellersPage from "@/app/components/admin-dashboard/ApprovedSellersPage";
import AdminChat from "@/app/components/admin-dashboard/AdminChat";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [selectedSeller, setSelectedSeller] = useState(null);

  const handleChatWithSeller = (seller) => {
    setSelectedSeller(seller);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "applications"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Applications
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "approved"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Approved Sellers
              </button>
              {selectedSeller && (
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "chat"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Chat with {selectedSeller.storeName}
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "applications" && <Applications />}
            {activeTab === "approved" && (
              <ApprovedSellersPage onChatWithSeller={handleChatWithSeller} />
            )}
            {activeTab === "chat" && selectedSeller && (
              <AdminChat seller={selectedSeller} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
