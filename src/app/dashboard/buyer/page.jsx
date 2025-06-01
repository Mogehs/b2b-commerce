import ChatBox from "@/app/components/buyer-dashboard/ChatBox";
import FavProducts from "@/app/components/buyer-dashboard/FavProducts";
import FavSeller from "@/app/components/buyer-dashboard/FavSeller";
import Home from "@/app/components/buyer-dashboard/Home";
import Profile from "@/app/components/buyer-dashboard/Profile";
import Navbar from "@/app/components/common/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <div>
        Hero
        <h1>Welcome to the Buyer Dashboard</h1>
        <p>
          Here you can manage your profile, chat with sellers, and view your
          favorite products and sellers.
        </p>
        {/* You can import and use the components here */}
        <Home />
        <Profile />
        <ChatBox />
        <FavProducts />
        <FavSeller />
      </div>
    </>
  );
};

export default page;
