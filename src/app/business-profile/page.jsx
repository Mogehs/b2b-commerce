import React from "react";
import BPHome from "../components/business-profile/BPHome";
import BPAbout from "../components/business-profile/BPAbout";
import BPContact from "../components/business-profile/BPContact";
import BPProducts from "../components/business-profile/BPProducts";
import Navbar from "../components/common/Navbar";

const page = () => {
  return (
    <div>
      <Navbar />
      Hero
      <BPHome />
      <BPAbout />
      <BPContact />
      <BPProducts />
    </div>
  );
};

export default page;
