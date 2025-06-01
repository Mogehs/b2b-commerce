import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-full md:h-[50vh] lg:h-[70vh]">
      <img
        src="/home-page/hero.jpg"
        alt="Hero"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Hero;
