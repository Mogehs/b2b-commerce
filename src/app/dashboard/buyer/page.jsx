import ChatBox from "@/app/components/buyer-dashboard/ChatBox";
import FavProducts from "@/app/components/buyer-dashboard/FavProducts";
import FavSeller from "@/app/components/buyer-dashboard/FavSeller";
import Profile from "@/app/components/buyer-dashboard/Profile";
import React from "react";

const page = () => {
  return (
    <div>
      Hero
      <h1>Welcome to the Buyer Dashboard</h1>
      <p>
        Here you can manage your profile, chat with sellers, and view your
        favorite products and sellers.
      </p>
      {/* You can import and use the components here */}
      <Profile />
      <ChatBox />
      <FavProducts />
      <FavSeller />
    </div>
  );
};

export default page;
