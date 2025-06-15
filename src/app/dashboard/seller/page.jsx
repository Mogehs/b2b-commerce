"use client";

import React, { useState } from "react";
import Home from "@/app/components/seller-dashboard/Home";
import Profile from "@/app/components/seller-dashboard/Profile";
import ChatBox from "@/app/components/seller-dashboard/ChatBox";

import Navbar from "@/app/components/common/Navbar";
import Fav from "@/app/components/seller-dashboard/Fav";
import Reviews from "@/app/components/seller-dashboard/Reviews";
import RFQ from "@/app/components/seller-dashboard/RFQ";
import History from "@/app/components/seller-dashboard/History";
import StoreProfile from "@/app/components/seller-dashboard/StoreProfile";
import AddProducts from "@/app/components/seller-dashboard/AddProducts";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    "Home",
    "Profile",
    "Message",
    // "Favourite",
    "Reviews",
    "RFQ",
    "History",
    "Store Profile",
    "Products",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "Profile":
        return <Profile />;
      case "Message":
        return <ChatBox />;
      // case "Favourite":
      //   return <Fav />;
      case "Reviews":
        return <Reviews />;
      case "RFQ":
        return <RFQ />;
      case "History":
        return <History />;
      case "Store Profile":
        return <StoreProfile />;
      case "Products":
        return <AddProducts />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="w-full bg-[#ebebeb] py-7 flex justify-center">
          <div className="flex flex-wrap gap-5 justify-center px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-35 py-2 rounded border-2 border-[#ACAAAA] max-lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#C9AF2F4D] text-black"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Render selected tab content */}
        <div>{renderTabContent()}</div>
      </div>
    </>
  );
};

export default SellerDashboard;
