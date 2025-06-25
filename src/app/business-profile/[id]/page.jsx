"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BPHome from "../../components/business-profile/BPHome";
import BPAbout from "../../components/business-profile/BPAbout";
import BPContact from "../../components/business-profile/BPContact";
import BPProducts from "../../components/business-profile/BPProducts";
import Navbar from "../../components/common/Navbar";
import { CiSearch } from "react-icons/ci";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const page = () => {
  const [selectedComponent, setSelectedComponent] = React.useState("home");
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: session } = useSession();

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
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#C9AF2F]/20 border-t-[#C9AF2F] rounded-full animate-spin mx-auto"></div>
              <div className="w-12 h-12 border-4 border-[#B8A028]/20 border-t-[#B8A028] rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="text-xl font-semibold text-gray-700">
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
        <Navbar />
        <div className="h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-red-500"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <div className="text-lg text-red-600 mb-4">{error}</div>
              <p className="text-gray-600">
                Please check the URL and try again, or contact support if the
                problem persists.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] text-white rounded-full hover:from-[#B8A028] hover:to-[#A69124] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="h-fit py-10 font-sans">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-r from-[#C9AF2F]/10 to-gray-100/50 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              {/* Left Section: Company Info */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3 leading-tight">
                    {sellerData?.name || "Store Name"}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-6">
                    <svg
                      className="w-5 h-5 mr-2 text-[#C9AF2F]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-base">
                      {sellerData?.location?.formattedAddress ||
                        sellerData?.address ||
                        "Location not available"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#C9AF2F]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {sellerData?.phone || "Not available"}
                      </span>
                    </div>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] text-white rounded-full hover:from-[#B8A028] hover:to-[#A69124] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm font-medium"
                      onClick={toggleFavorite}
                    >
                      {isFavorite ? (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          Remove from Favourite
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Add to Favourite
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <strong className="text-gray-800 text-lg">We Are</strong>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {sellerData?.businessType ||
                        "Business type not specified"}
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <strong className="text-gray-800 text-lg">We Deal</strong>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {sellerData?.typeOfProducts || "Products not specified"}
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-1a1 1 0 00-1 1v1h2V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <strong className="text-gray-800 text-lg">
                        We Offer
                      </strong>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {sellerData?.offers ||
                        "OEM, Customization, Private labeling"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section: Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img
                    src={
                      sellerData?.bannerImage?.url ||
                      "/business-profile/grocery-hero.png"
                    }
                    alt={sellerData?.name || "Store"}
                    className="relative rounded-2xl w-full max-w-lg h-80 lg:h-96 object-cover shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Section */}
        <div className="relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 lg:px-8 lg:py-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Left Navigation */}
                  <div className="flex items-center space-x-8">
                    <button
                      onClick={() => setSelectedComponent("home")}
                      className={`relative px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-300 ${
                        selectedComponent === "home"
                          ? "text-[#C9AF2F] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#C9AF2F] after:to-[#B8A028] after:rounded-full"
                          : "text-gray-600 hover:text-[#C9AF2F]"
                      }`}
                    >
                      HOME
                    </button>
                    <button
                      onClick={() => setSelectedComponent("products")}
                      className={`relative px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-300 ${
                        selectedComponent === "products"
                          ? "text-[#C9AF2F] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#C9AF2F] after:to-[#B8A028] after:rounded-full"
                          : "text-gray-600 hover:text-[#C9AF2F]"
                      }`}
                    >
                      PRODUCTS
                    </button>
                  </div>

                  {/* Center Search */}
                  <div className="relative w-full max-w-md lg:max-w-sm">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search in this store..."
                        className="w-full bg-gray-50/80 border border-gray-200/50 rounded-full px-5 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9AF2F]/30 focus:border-[#C9AF2F] transition-all duration-300 group-hover:bg-white"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <CiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-[#C9AF2F] transition-colors duration-300" />
                      </div>
                      <button className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-gray-400 hover:text-[#C9AF2F] transition-colors duration-300">
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
                  <div className="flex items-center space-x-8">
                    <button
                      onClick={() => setSelectedComponent("about")}
                      className={`relative px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-300 ${
                        selectedComponent === "about"
                          ? "text-[#C9AF2F] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#C9AF2F] after:to-[#B8A028] after:rounded-full"
                          : "text-gray-600 hover:text-[#C9AF2F]"
                      }`}
                    >
                      ABOUT US
                    </button>
                    <button
                      onClick={() => setSelectedComponent("contact")}
                      className={`relative px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-300 ${
                        selectedComponent === "contact"
                          ? "text-[#C9AF2F] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#C9AF2F] after:to-[#B8A028] after:rounded-full"
                          : "text-gray-600 hover:text-[#C9AF2F]"
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

      {/* Content Section with Enhanced Background */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
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
