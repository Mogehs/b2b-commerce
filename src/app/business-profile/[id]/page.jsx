"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BPHome from "../../components/business-profile/BPHome";
import BPAbout from "../../components/business-profile/BPAbout";
import BPContact from "../../components/business-profile/BPContact";
import BPProducts from "../../components/business-profile/BPProducts";
import { CiSearch } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi";

const page = () => {
  const [selectedComponent, setSelectedComponent] = React.useState("home");
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const params = useParams();
  const sellerId = params.id;

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoading(true);
        if (!sellerId) {
          setError("No seller ID provided");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`/api/seller/${sellerId}`);
        if (response.data && response.data.length > 0) {
          setSellerData(response.data[0]);
        } else {
          setError("Seller not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch seller data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  useEffect(() => {
    const fetchFavSellerStatus = async () => {
      if (!session?.user || !sellerId) return;

      try {
        const res = await axios.post("/api/user/fav-seller/status", {
          sellerId,
        });
        setIsFavorite(res.data.favorited);
      } catch (err) {
        console.error("Error checking favorite seller status:", err);
      }
    };

    fetchFavSellerStatus();
  }, [sellerId, session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-[#C9AF2F]/20 border-t-[#C9AF2F] rounded-full animate-spin mx-auto"></div>
              <div className="w-9 h-9 border-3 border-[#B8A028]/20 border-t-[#B8A028] rounded-full animate-spin mx-auto absolute top-1.5 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Loading seller profile...
            </div>
            <div className="text-sm text-gray-500">
              Please wait while we fetch the details
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <div className="text-base text-red-600 mb-3">{error}</div>
              <p className="text-gray-600 text-sm">
                Please check the URL and try again, or contact support if the
                problem persists.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] text-white rounded-full hover:from-[#B8A028] hover:to-[#A69124] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please login to add to favorites");
      return router.push("/log-in");
    }

    try {
      const res = await axios.post("/api/user/fav-seller", {
        sellerId,
      });
      setIsFavorite(res.data.favorited);
      toast.success(
        res.data.favorited
          ? "Seller added to favorites"
          : "Seller removed from favorites"
      );
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <div className="h-fit font-sans bg-[#F1F1F1]">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-[#F1F1F1] py-8 px-4 md:py-10 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-5 lg:h-[400px]">
              {/* Left Section: Company Info */}
              <div className="w-full lg:w-[40%] space-y-2">
                <div className="bg-[#FFFFFF] backdrop-blur-sm rounded-[2px] h-[36%] px-6 py-2 space-y-3 shadow-sm border border-white/20 max-lg:py-3">
                  <h1 className="text-2xl text-center lg:text-3xl font-bold text-gray-800">
                    {sellerData?.name || "Store Name"}
                  </h1>
                  <p className="text-center font-semibold text-[14px] text-black">
                    {sellerData?.location?.formattedAddress ||
                      sellerData?.address ||
                      "Location not available"}
                  </p>
                  <div className="flex justify-between mt-4 text-[14px]">
                    <span className="text-gray-800 font-medium">
                      Phone No. {sellerData?.phone || "Not available"}
                    </span>
                    <span className="text-gray-800 font-medium">Detail</span>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-1 h-[62%]">
                  <div className="bg-[#FFFFFF] flex flex-col justify-center rounded-[2px] px-4 py-3 shadow-sm border border-white/30">
                    <div className="flex items-center">
                      <strong className="text-gray-800 text-base">
                        We Are
                      </strong>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {sellerData?.businessType ||
                        "Business type not specified"}
                    </p>
                  </div>

                  <div className="bg-[#FFFFFF] flex flex-col justify-center rounded-[2px] px-4 py-3 shadow-sm border border-white/30">
                    <div className="flex items-center">
                      <strong className="text-gray-800 text-base">
                        We Deal
                      </strong>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {sellerData?.typeOfProducts || "Products not specified"}
                    </p>
                  </div>

                  <div className="bg-[#FFFFFF] flex flex-col justify-center rounded-[2px] px-4 py-3 shadow-sm border border-white/30">
                    <div className="flex items-center">
                      <strong className="text-gray-800 text-base">
                        We Offer
                      </strong>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {sellerData?.offers ||
                        "OEM, Customization, Private labeling"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section: Image */}
              <div className="w-full lg:w-[60%] h-full flex justify-center">
                <img
                  src={
                    sellerData?.bannerImage?.url ||
                    "/business-profile/grocery-hero.png"
                  }
                  alt={sellerData?.name || "Store"}
                  className="rounded-[2px] w-full object-cover shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Section */}
        <div className="relative z-10 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#FFFFFF] backdrop-blur-lg shadow-sm rounded-[2px] border border-white/20 overflow-hidden">
              <div className="px-4 py-3 lg:px-6 lg:py-4">
                <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 text-nowrap">
                  {/* Left Navigation */}
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => setSelectedComponent("home")}
                      className={`relative px-3 py-1 font-semibold text-base ${
                        selectedComponent === "home"
                          ? "text-[#C9AF2F]"
                          : "text-gray-800"
                      }`}
                    >
                      HOME
                    </button>
                    <button
                      onClick={() => setSelectedComponent("products")}
                      className={`relative px-3 py-1 font-semibold text-base ${
                        selectedComponent === "products"
                          ? "text-[#C9AF2F]"
                          : "text-gray-800"
                      }`}
                    >
                      PRODUCTS
                    </button>
                  </div>

                  {/* Center Search */}
                  <div className="relative w-full max-w-md lg:max-w-xs">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search in this store..."
                        className="w-full bg-[#F1F1F1] border border-gray-200/50 rounded-[2px] px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9AF2F]/30 focus:border-[#C9AF2F] transition-all duration-300"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <CiSearch className="w-4 h-4 text-gray-400 group-focus-within:text-[#C9AF2F] transition-colors duration-300" />
                      </div>
                      <button className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-gray-800">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right Navigation */}
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => setSelectedComponent("about")}
                      className={`relative px-3 py-1 font-semibold text-base ${
                        selectedComponent === "about"
                          ? "text-[#C9AF2F]"
                          : "text-gray-800"
                      }`}
                    >
                      ABOUT US
                    </button>
                    <button
                      onClick={() => setSelectedComponent("contact")}
                      className={`relative px-4 py-2 font-semibold text-[20px] ${
                        selectedComponent === "contact"
                          ? "text-[#C9AF2F]"
                          : "text-gray-800"
                      }`}
                    >
                      CONTACT US
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with components */}
      <div className="bg-[#F1F1F1] min-h-screen">
        {selectedComponent === "home" && (
          <BPHome sellerId={sellerId} sellerData={sellerData} />
        )}
        {selectedComponent === "products" && <BPProducts sellerId={sellerId} />}
        {selectedComponent === "about" && (
          <BPAbout sellerId={sellerId} sellerData={sellerData} />
        )}
        {selectedComponent === "contact" && (
          <BPContact sellerId={sellerId} sellerData={sellerData} />
        )}
      </div>
    </div>
  );
};

export default page;
