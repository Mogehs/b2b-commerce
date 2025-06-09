"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const cards = [
  {
    title: "Messages",
    subtitle: "1 New Message",
    highlight: true,
    link: "Message",
  },
  { title: "Favourite Products", link: "Favourite" },
  { title: "Favourite Supplier", link: "Favourite" },
  { title: "My Reviews", link: "Reviews" },
  { title: "My RFQ", link: "My RFQ" },
  { title: "My History", link: "History" },
];

export default function Dashboard({ activeTab }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatMembershipDuration = (createdAt) => {
    if (!createdAt) return "Recently joined";

    const joinDate = new Date(createdAt);
    const now = new Date();

    const months =
      (now.getFullYear() - joinDate.getFullYear()) * 12 +
      (now.getMonth() - joinDate.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const monthText = joinDate.toLocaleString("default", { month: "long" });
    const yearText = joinDate.getFullYear();

    let duration = "";
    if (years > 0) {
      duration += `${years}y`;
      if (remainingMonths > 0) duration += ` - ${remainingMonths}m`;
    } else if (months > 0) {
      duration += `${remainingMonths}m`;
    } else {
      duration += "< 1m";
    }

    return `Member Since ${monthText}, ${yearText} (${duration})`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const response = await fetch("/api/user/profile");

          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }

          const data = await response.json();
          setProfile(data.user);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1]">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl text-red-600 font-semibold">Error</h2>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f1f1] text-black flex flex-col items-center justify-start p-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {profile?.name?.charAt(0) ||
                    session?.user?.name?.charAt(0) ||
                    "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">
              {profile?.name || session?.user?.name}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              {profile?.email || session?.user?.email}
            </p>
            <p className="text-sm text-gray-700 mt-4">
              {formatMembershipDuration(
                profile?.createdAt || session?.user?.createdAt
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              onClick={() => {
                activeTab(card.link);
              }}
              key={idx}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-28 transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div>
                <h2 className="text-sm text-gray-600 font-semibold mb-1">
                  {card.title}
                </h2>
                {card.highlight && (
                  <p className="text-sm text-red-600 font-medium">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Total -{" "}
                {idx === 0
                  ? profile?.conversations?.length || 0
                  : idx === 1
                  ? profile?.favProducts?.length || 0
                  : idx === 2
                  ? profile?.favSellers?.length || 0
                  : idx === 3
                  ? profile?.reviews?.length || 0
                  : idx === 4
                  ? profile?.rfqs?.length || 0
                  : profile?.purchaseHistory?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
