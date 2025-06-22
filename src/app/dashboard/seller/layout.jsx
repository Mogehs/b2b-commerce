"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/common/Navbar";

export default function SellerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabRoutes = {
    // Home: "/dashboard/seller",
    Profile: "/dashboard/seller/profile",
    Message: "/dashboard/seller/chat",
    // Reviews: "/dashboard/seller/reviews",
    RFQ: "/dashboard/seller/rfq",
    // History: "/dashboard/seller/history",
    "Store Profile": "/dashboard/seller/store-profile",
    Products: "/dashboard/seller/products",
  };

  // Get active tab based on current path
  const getActiveTab = () => {
    const path = pathname;
    for (const [tab, route] of Object.entries(tabRoutes)) {
      if (
        path === route ||
        (path !== "/dashboard/seller" &&
          route !== "/dashboard/seller" &&
          path.startsWith(route))
      ) {
        return tab;
      }
    }
    return "Home";
  };

  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  const handleTabChange = (tab) => {
    const route = tabRoutes[tab];
    router.push(route);
  };

  const tabs = Object.keys(tabRoutes);

  return (
    <>
      <Navbar />
      <div>
        <div className="w-full bg-[#ebebeb] py-7 flex justify-center">
          <div className="flex flex-wrap gap-5 justify-center px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
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

        {/* Page content */}
        <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
      </div>
    </>
  );
}
