"use client";

import React from "react";
import Home from "@/app/components/buyer-dashboard/Home";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Handle navigation from home page cards
  const handleNavigate = (tab) => {
    switch (tab) {
      case "Profile":
        router.push("/dashboard/buyer/profile");
        break;
      case "Message":
        router.push("/dashboard/buyer/chat");
        break;
      case "Favourite":
        router.push("/dashboard/buyer/favourite");
        break;
      case "Reviews":
        router.push("/dashboard/buyer/reviews");
        break;
      case "My RFQ":
        router.push("/dashboard/buyer/my-rfq");
        break;
      case "History":
        router.push("/dashboard/buyer/history");
        break;
      default:
        break;
    }
  };

  return <Home activeTab={handleNavigate} />;
}
