"use client";
import { useState } from "react";

const tabs = [
  "Home",
  "Profile",
  "Message",
  "Favourite",
  "Reviews",
  "My RFQ",
  "History",
];

export default function Topheader() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <>
      <div className="w-full bg-[#ebebeb] py-7 flex justify-center  ">
        <div className="flex flex-wrap gap-5 justify-center px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-35 py-2 rounded border-2 border-[#ACAAAA] max-lg:text-sm  font-semibold transition-all duration-200 cursor-pointer
              ${
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
    </>
  );
}
