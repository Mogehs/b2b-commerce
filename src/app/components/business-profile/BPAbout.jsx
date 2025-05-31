import React from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";

const BPAbout = () => {
  return (
    <div className="bg-gray-100 py-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold">About Us</h1>
        <p>
          Welcome to [Company Name], where innovation meets excellence in
          manufacturing. Established in [Year], we are a leading manufacturer
          specializing in high-quality products tailored to meet the diverse
          needs of our customers. With a commitment to continuous improvement
          and customer satisfaction, we take pride in offering top-tier
          solutions across a wide range of industries. At [Company Name], our
          vision is to revolutionize the manufacturing sector by blending
          cutting-edge technology with sustainable practices. From design to
          production, our dedicated team ensures each product is crafted to
          perfection, adhering to international quality standards.
        </p>
      </div>
      <InfoCertificates />
    </div>
  );
};

export default BPAbout;
