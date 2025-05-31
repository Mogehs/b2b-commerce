"use client";
import React from "react";
import BPHome from "../components/business-profile/BPHome";
import BPAbout from "../components/business-profile/BPAbout";
import BPContact from "../components/business-profile/BPContact";
import BPProducts from "../components/business-profile/BPProducts";
import Navbar from "../components/common/Navbar";
import { CiSearch } from "react-icons/ci";

const products = [
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
];
const page = () => {
  const [selectedComponent, setSelectedComponent] = React.useState("home");
  return (
    <div>
      <Navbar />
      <div className="h-fit py-10 bg-gray-100 font-sans p-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white">
          {/* Left Section: Company Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Madina Traders</h1>
            <p className="text-sm text-gray-600 mt-1">
              Lahore, Punjab, Pakistan
            </p>
            <div className="mt-4 text-sm text-gray-800">
              <p>
                Phone No.: <span className="font-medium">+92 300 1234567</span>{" "}
                <span className="float-right text-blue-600 cursor-pointer">
                  Detail
                </span>
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="border p-3 bg-gray-50">
                <strong>We Are</strong>
                <p className="text-gray-700">
                  Manufacturer, Online Seller, Exporter
                </p>
              </div>

              <div className="border p-3 bg-gray-50">
                <strong>We deal</strong>
                <p className="text-gray-700">Garments, Industrial Machinery</p>
              </div>

              <div className="border p-3 bg-gray-50">
                <strong>We offered</strong>
                <p className="text-gray-700">
                  OEM, Customization, Private labeling
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Image */}
          <div className="flex-1">
            <img
              src="/business-profile/grocery-hero.png"
              alt="Grocery Section"
              className="rounded w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Navbar */}
        <div className="relative z-10">
          <div className="sticky top-4 bg-white shadow-md rounded-md px-4 py-3 flex flex-col lg:flex-row items-center justify-between mt-4 gap-4 mx-auto max-w-7xl">
            <div className="flex items-center space-x-6 text-sm font-semibold">
              <span
                onClick={() => setSelectedComponent("home")}
                className={`cursor-pointer ${
                  selectedComponent === "home" ? "text-[#C9AF2F]" : "text-black"
                }`}
              >
                HOME
              </span>
              <span
                onClick={() => setSelectedComponent("products")}
                className={`cursor-pointer ${
                  selectedComponent === "products"
                    ? "text-[#C9AF2F]"
                    : "text-black"
                }`}
              >
                PRODUCTS
              </span>
            </div>

            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search in this store..."
                className="w-full border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9AF2F]"
              />
              <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600">
                <CiSearch />
              </button>
            </div>

            <div className="flex items-center space-x-6 text-sm font-semibold">
              <span
                onClick={() => setSelectedComponent("about")}
                className={`cursor-pointer ${
                  selectedComponent === "about"
                    ? "text-[#C9AF2F]"
                    : "text-black"
                }`}
              >
                ABOUT US
              </span>
              <span
                onClick={() => setSelectedComponent("contact")}
                className={`cursor-pointer ${
                  selectedComponent === "contact"
                    ? "text-[#C9AF2F]"
                    : "text-black"
                }`}
              >
                CONTACT US
              </span>
            </div>
          </div>
        </div>
      </div>
      {selectedComponent === "home" && <BPHome />}
      {selectedComponent === "products" && <BPProducts products={products} />}
      {selectedComponent === "about" && <BPAbout />}
      {selectedComponent === "contact" && <BPContact />}
    </div>
  );
};

export default page;
