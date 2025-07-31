"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Loader2,
  MessageCircle,
  Heart,
  Star,
  FileText,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Import socket hook if you have one, or we'll create inline socket logic
// import { useSocket } from "@/app/context/SocketContext";

const cards = [
  {
    title: "Messages",
    subtitle: "New Messages",
    highlight: true,
    link: "Message",
    icon: MessageCircle,
    color: "from-[#C9AF2F] to-[#B8A028]",
  },
  {
    title: "Favourite Products",
    link: "Favourite",
    icon: Heart,
    color: "from-red-500 to-red-600",
  },
  {
    title: "Favourite Supplier",
    link: "Favourite",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  // {
  //   title: "My Reviews",
  //   link: "Reviews",
  //   icon: Star,
  //   color: "from-yellow-500 to-yellow-600",
  // },
  {
    title: "My RFQ",
    link: "My RFQ",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
  },
  // {
  //   title: "My History",
  //   link: "History",
  //   icon: Clock,
  //   color: "from-green-500 to-green-600",
  // },
];

export default function Dashboard({ activeTab }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Socket connection for real-time updates
  useEffect(() => {
    if (!session?.user) return;

    const initSocket = async () => {
      const { io } = await import("socket.io-client");
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;

      const socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        console.log("Connected to socket server");
        // Join user's room for personal notifications
        socketInstance.emit("join-user-room", session.user.id);
      });

      socketInstance.on("new-message", (data) => {
        console.log("New message received:", data);
        // Show toast notification for new message
        toast.success(`New message from ${data.senderName || "someone"}`, {
          description:
            data.content?.length > 50
              ? data.content.substring(0, 50) + "..."
              : data.content,
          action: {
            label: "View",
            onClick: () => activeTab("Message"),
          },
        });
        // Update conversations and unread count
        fetchConversations();
      });

      socketInstance.on("message-read", (data) => {
        console.log("Message read:", data);
        // Update read status
        fetchConversations();
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    };

    initSocket();
  }, [session]);

  const fetchConversations = async () => {
    try {
      const conversationsResponse = await fetch("/api/conversations");
      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        setConversations(conversationsData.conversations || []);

        // Calculate total unread messages count
        const unread =
          conversationsData.conversations?.reduce((total, conv) => {
            return total + (conv.unreadCount || 0);
          }, 0) || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

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

          // Fetch user profile
          const profileResponse = await fetch("/api/user/profile");
          if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile");
          }
          const profileData = await profileResponse.json();
          setProfile(profileData.user);

          // Fetch conversations
          await fetchConversations();
        } catch (err) {
          console.error("Error fetching data:", err);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#C9AF2F]/20 border-t-[#C9AF2F] rounded-full animate-spin mx-auto"></div>
            <div className="w-9 h-9 border-3 border-[#B8A028]/20 border-t-[#B8A028] rounded-full animate-spin mx-auto absolute top-1.5 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="text-base font-semibold text-gray-700">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-6 shadow-md border border-gray-100 text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-red-500"
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
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] text-white rounded-full hover:from-[#B8A028] hover:to-[#A69124] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F1] min-h-screen p-4 md:p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Info */}
        <div className="bg-white shadow-md border border-[#ACAAAA] p-2 md:py-3 md:px-4 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="md:text-lg text-base font-bold text-[#000000]">
                  {profile?.name || session?.user?.name}
                </h2>
              </div>
              <p className="md:text-sm text-xs text-[#000000] inline-block">
                {formatMembershipDuration(
                  profile?.createdAt || session?.user?.createdAt
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 md:px-8 px-2">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const getCount = () => {
              switch (idx) {
                case 0:
                  return conversations?.length || 0;
                case 1:
                  return profile?.favProducts?.length || 0;
                case 2:
                  return profile?.favSellers?.length || 0;
                case 3:
                  return profile?.reviews?.length || 0;
                case 4:
                  return profile?.rfqs?.length || 0;
                case 5:
                  return profile?.purchaseHistory?.length || 0;
                default:
                  return 0;
              }
            };

            const count = getCount();
            const showNotification = idx === 0 && unreadCount > 0;

            return (
              <div
                onClick={() => activeTab(card.link)}
                key={idx}
                className="group bg-white  shadow-md border border-gray-100 py-3 h-25 px-3 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-102 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="md:text-sm text-xs font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-200">
                    {card.title}
                  </h3>

                  {showNotification && (
                    <p className="text-xs text-red-600 font-medium mb-2">
                      {unreadCount} {card.subtitle}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-1">
                    <span className="md:text-sm text-xs text-black/50">Total</span>
                    <span className="md:text-sm text-xs text-black/50">-</span>
                    <span className="md:text-sm text-xs text-black/50">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Conversations Preview */}
        {conversations.length > 0 && (
          <div className="bg-white rounded-md shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-md flex items-center justify-center mr-2">
                  <MessageCircle className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Recent Conversations
                </h3>
              </div>
              <button
                onClick={() => activeTab("Message")}
                className="text-[#C9AF2F] hover:text-[#B8A028] font-medium text-xs transition-colors duration-200"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {conversations.slice(0, 3).map((conversation, idx) => (
                <div
                  key={conversation._id}
                  className="flex items-center p-2 rounded-md bg-gray-50/50 hover:bg-[#C9AF2F]/5 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-medium text-xs">
                      {conversation.participants?.[0]?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-gray-800">
                      {conversation.participants?.[0]?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
