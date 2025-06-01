import React from "react";
import Navbar from "./components/common/Navbar";
import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import Badge from "./components/home/Badge";
import Categories from "./components/home/Categories";
import BrandingCards from "./components/home/BrandingCards";
import Products from "./components/home/Products";
import Brands from "./components/home/Brands";
import Region from "./components/home/Region";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Header />
      <Hero />
      <div className="bg-[#F1F1F1] p-4">
        <Badge first='Categories to Explore' second='View All' />
        <Categories />
        <Badge first='Branding Services' second='View All' />
        <BrandingCards />
        <Badge first='Products you May Like' second='View All' />
        <Products />
        <Badge first='Popular Brands' second='View All' />
        <Brands />
        <Badge first='Find Supplier by Region' second='View All' />
        <Region />
      </div>
    </div>
  );
};

export default Home;
