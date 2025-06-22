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
      <div>
        <Navbar />
        <div className="h-fit py-10 bg-gray-100 font-sans p-6 flex items-center justify-center">
          <div className="text-xl">Loading seller profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="h-fit py-10 bg-gray-100 font-sans p-6 flex flex-col items-center justify-center">
          <div className="text-xl text-red-500">Error: {error}</div>
          <p className="mt-2">Please check the URL and try again.</p>
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
    <div>
      <Navbar />
      <div className="h-fit py-10 bg-gray-100 font-sans p-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-20 p-4 ">
          {/* Left Section: Company Info */}
          <div className="w-1/2">
            <h1 className="text-3xl font-bold">
              {sellerData?.name || "Store Name"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {sellerData?.location?.formattedAddress ||
                sellerData?.address ||
                "Location not available"}
            </p>
            <div className="mt-4 text-sm text-gray-800">
              <p>
                Phone No.:{" "}
                <span className="font-medium">
                  {sellerData?.phone || "Not available"}
                </span>{" "}
                <span
                  className="float-right text-blue-600 cursor-pointer"
                  onClick={toggleFavorite}
                >
                  {isFavorite
                    ? "Remove from Favourite"
                    : "Add Seller to Favourite"}
                </span>
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="border p-3 bg-gray-50">
                <strong>We Are</strong>
                <p className="text-gray-700">
                  {sellerData?.businessType || "Business type not specified"}
                </p>
              </div>

              <div className="border p-3 bg-gray-50">
                <strong>We deal</strong>
                <p className="text-gray-700">
                  {sellerData?.typeOfProducts || "Products not specified"}
                </p>
              </div>

              <div className="border p-3 bg-gray-50">
                <strong>We offered</strong>
                <p className="text-gray-700">
                  {sellerData?.offers || "OEM, Customization, Private labeling"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Image */}
          <div className="flex justify-center items-center w-1/2">
            <img
              src={
                sellerData?.bannerImage?.url ||
                "/business-profile/grocery-hero.png"
              }
              alt={sellerData?.name || "Store"}
              className="rounded w-100  object-cover"
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
  );
};

export default page;
