import React from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";

const BPAbout = ({ sellerId, sellerData }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {/* About Us Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-6xl mx-auto mb-8 hover:shadow-xl transition-all duration-300">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 mb-6 bg-gradient-to-r from-[#C9AF2F]/5 to-transparent p-6 rounded-xl border-l-4 border-[#C9AF2F]">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {sellerData?.mainMarkets && sellerData.mainMarkets.length > 0 && (
            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 hover:bg-[#C9AF2F]/5 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Main Markets
                </h2>
              </div>
              <ul className="space-y-2">
                {sellerData.mainMarkets.map((market, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-[#C9AF2F] rounded-full mr-3"></div>
                    {market}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sellerData?.productCategories &&
            sellerData.productCategories.length > 0 && (
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 hover:bg-[#C9AF2F]/5 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Product Categories
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sellerData.productCategories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#C9AF2F]/10 to-[#B8A028]/10 text-[#C9AF2F] px-4 py-2 rounded-full text-sm font-medium border border-[#C9AF2F]/20 hover:bg-[#C9AF2F]/20 transition-all duration-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Branding Services */}
          {sellerData.brandingServices &&
            sellerData.brandingServices.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Branding Services
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sellerData.brandingServices.map((service, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Info Certificates Component */}
      <InfoCertificates userId={sellerId} />
    </div>
  );
};

export default BPAbout;
