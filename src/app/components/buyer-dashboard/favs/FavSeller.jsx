"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Product card used inside SellerCard
const ProductCard = () => {
  return (
    <div className="p-4 flex-1 min-w-[150px] flex flex-col items-center">
      <Image
        src="/dashboardsupplier/p1.png"
        alt="DSLR Camera Product Image"
        width={100}
        height={100}
        className="w-28 h-28 object-cover mb-2"
      />
      <p className="text-sm font-semibold">DSLR Camera</p>
      <p className="text-sm font-semibold mt-2">Get Bulk Price</p>
    </div>
  );
};

// Card for Group Name 2 style
const GroupTwoCard = ({ seller, onRemove, onVisit }) => (
  <div className="bg-white border rounded-md p-4 shadow-sm w-full">
    <div className="text-md font-bold text-black">{seller.name}</div>
    <div className="text-sm text-gray-600">{seller.location}</div>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <div className="text-orange-400 text-xl mt-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>{i < Math.floor(seller.rating) ? "★" : "☆"}</span>
          ))}
      </div>
      <span className="ml-2 mt-3">({seller.reviewCount})</span>
    </div>
    <div className="text-sm font-medium text-black mt-2">
      {seller.businessType}
    </div>
    <div className="text-sm font-medium text-black mt-2">
      {seller.productCategories}
    </div>
    <div className="text-sm font-medium text-black mt-2">
      {seller.capabilities?.join(", ") || ""}
    </div>

    <div className="flex justify-start items-center flex-wrap gap-2 mb-3 mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-xs text-gray-700"
        >
          <Image
            src="/dashboardsupplier/p1.png"
            alt="item"
            width={90}
            height={135}
            className="rounded-md"
          />
          <span className="text-center font-medium text-black text-xs mt-1">
            Get Bulk Price
          </span>
        </div>
      ))}

      <div className="flex flex-col items-end gap-2 mt-2 w-full md:w-auto md:ml-24">
        <button
          type="button"
          className="w-full md:w-[90px] h-[38px] bg-[#C9AF2F] text-black text-xs font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
          onClick={() => onVisit(seller.ownerId)}
        >
          Visit Store
        </button>
        <button
          type="button"
          className="w-full md:w-[90px] h-[38px] bg-white border border-gray-300 text-black text-xs font-medium rounded hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          onClick={() => onRemove(seller.ownerId)}
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

// SellerCard for Group 1 style
const SellerCard = ({ seller, onRemove, onVisit }) => {
  return (
    <div className="bg-white shadow rounded-md p-3 space-y-4 border">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="text-left mb-4 md:mb-0 md:max-w-md">
          <p className="text-md font-bold">{seller.name}</p>
          <p className="text-sm text-gray-600">{seller.location}</p>
          <div className="flex items-center text-md text-yellow-500 mt-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span key={i}>{i < Math.floor(seller.rating) ? "★" : "☆"}</span>
              ))}
            <span className="text-gray-500 text-xs ml-1">
              ({seller.reviewCount})
            </span>
          </div>
          <p className="text-sm mt-4">{seller.businessType}</p>
          <p className="text-sm mt-4">{seller.productCategories}</p>
          <p className="text-sm mt-4">
            {seller.capabilities?.join(", ") || ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <ProductCard key={idx} />
            ))}
        </div>

        <div className="flex flex-col items-end gap-2 mt-2 md:mt-14 w-full md:w-auto">
          <button
            type="button"
            className="w-full md:w-[150px] h-[38px] bg-[#C9AF2F] text-black text-sm font-medium rounded hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
            onClick={() => onVisit(seller.ownerId)}
          >
            Visit Store
          </button>
          <button
            type="button"
            className="w-full md:w-[150px] h-[38px] bg-white border border-gray-300 text-black text-sm font-medium rounded hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            onClick={() => onRemove(seller.ownerId)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Final component
export default function FavSellers() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groupedSellers, setGroupedSellers] = useState({});
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchFavoriteSellers = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/user/fav-seller/list");

        if (response.data.success) {
          setGroupedSellers(response.data.groupedSellers);
          setGroups(Object.keys(response.data.groupedSellers));
        } else {
          toast.error("Failed to load favorite sellers");
        }
      } catch (error) {
        console.error("Error fetching favorite sellers:", error);
        toast.error("Error loading favorite sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteSellers();
  }, [session]);

  const removeFromFavorites = async (sellerId) => {
    try {
      const res = await axios.post("/api/user/fav-seller", {
        sellerId,
      });

      if (res.data.success) {
        // Remove seller from state
        const updatedGroupedSellers = {};
        let isEmpty = true;

        // Filter out the removed seller from each group
        for (const groupName in groupedSellers) {
          const filteredSellers = groupedSellers[groupName].filter(
            (seller) => seller.ownerId !== sellerId
          );

          if (filteredSellers.length > 0) {
            updatedGroupedSellers[groupName] = filteredSellers;
            isEmpty = false;
          }
        }

        setGroupedSellers(updatedGroupedSellers);
        setGroups(Object.keys(updatedGroupedSellers));
        toast.success("Seller removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const visitSellerStore = (sellerId) => {
    router.push(`/business-profile/${sellerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9AF2F]"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
        <div className="flex justify-center items-center h-60 bg-white rounded shadow">
          <div className="text-gray-500 text-center">
            <p className="text-xl mb-2">No favorite sellers found</p>
            <p>Browse sellers and add them to your favorites</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 bg-[#C9AF2F] text-black px-4 py-2 rounded hover:bg-opacity-80"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      {groups.map((groupName, index) => {
        const sellers = groupedSellers[groupName] || [];
        if (sellers.length === 0) return null;

        return (
          <div
            key={groupName}
            className="bg-gray-100 p-6 space-y-6 w-full mb-8"
          >
            <h2 className="text-xl font-bold mb-4">{groupName}</h2>

            {/* For odd-numbered groups, use SellerCard style */}
            {index % 2 === 0 ? (
              <div className="space-y-6">
                {sellers.map((seller) => (
                  <SellerCard
                    key={seller.ownerId}
                    seller={seller}
                    onRemove={removeFromFavorites}
                    onVisit={visitSellerStore}
                  />
                ))}
              </div>
            ) : (
              /* For even-numbered groups, use grid layout with GroupTwoCard */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {sellers.map((seller) => (
                  <GroupTwoCard
                    key={seller.ownerId}
                    seller={seller}
                    onRemove={removeFromFavorites}
                    onVisit={visitSellerStore}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
