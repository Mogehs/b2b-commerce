import React from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";

const BPAbout = ({ sellerId, sellerData }) => {
  return (
    <div className="bg-gray-100 py-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold">About Us</h1>
        <p className="mt-4 leading-relaxed text-gray-700">
          {sellerData?.description ||
            `Welcome to ${
              sellerData?.name || "[Company Name]"
            }, where innovation meets excellence in
            manufacturing. Established in ${
              sellerData?.yearEstablished || "[Year]"
            }, we are a leading manufacturer
            specializing in high-quality products tailored to meet the diverse
            needs of our customers. With a commitment to continuous improvement
            and customer satisfaction, we take pride in offering top-tier
            solutions across a wide range of industries. At ${
              sellerData?.name || "[Company Name]"
            }, our
            vision is to revolutionize the manufacturing sector by blending
            cutting-edge technology with sustainable practices. From design to
            production, our dedicated team ensures each product is crafted to
            perfection, adhering to international quality standards.`}
        </p>

        {sellerData?.mainMarkets && sellerData.mainMarkets.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Main Markets</h2>
            <ul className="list-disc ml-5 mt-2">
              {sellerData.mainMarkets.map((market, index) => (
                <li key={index} className="text-gray-700">
                  {market}
                </li>
              ))}
            </ul>
          </div>
        )}

        {sellerData?.productCategories &&
          sellerData.productCategories.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Product Categories</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {sellerData.productCategories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
      <InfoCertificates userId={sellerId} />
    </div>
  );
};

export default BPAbout;
