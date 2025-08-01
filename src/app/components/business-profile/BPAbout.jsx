import React from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";

const BPAbout = ({ sellerId, sellerData }) => {
  // Prepare data for basic information
  const basicInfo = [
    { label: "Business Owner", value: sellerData?.owner || "Mr. ABC" },
    {
      label: "Business Type",
      value:
        sellerData?.businessType ||
        "Manufacturer, Wholesaler, Importer Exporter",
    },
    {
      label: "Business Legal Status",
      value: sellerData?.businessLegalStatus || "Sole Proprietor",
    },
    {
      label: "Year of Establish",
      value: sellerData?.yearEstablished || "1988",
    },
    {
      label: "Type of Products",
      value: sellerData?.typeOfProducts || "Jackets, Bags, Laptops etc.",
    },
    {
      label: "Main Market",
      value: sellerData?.mainMarkets?.join(", ") || "USA, UK, Spain, Pakistan",
    },
    {
      label: "Yearly Revenue",
      value: sellerData?.yearlyRevenue || "230000/- Lakh",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      {/* About section */}
      <div className="bg-[#F1F1F1] p-4">
        <div className="max-w-6xl mx-auto bg-[#FFFFFF] rounded-lg shadow-md h-40">
          <div className="flex p-4 px-6 overflow-hidden relative">
            <div className="lg:w-[83%] w-[85%]">
              <p className="font-bold text-gray-800 text-xl mb-1">ABOUT US</p>
              <div className="font-medium text-sm leading-6 text-gray-700">
                <p>
                  {sellerData?.description ||
                    `Welcome to ${
                      sellerData?.name || "[Company Name]"
                    }, where innovation meets excellence in manufacturing. Established in ${
                      sellerData?.yearEstablished || "[Year]"
                    }, we are a leading manufacturer specializing in high-quality products tailored to meet the diverse needs of our customers. With a commitment to continuous improvement and customer satisfaction, we take pride in offering top-tier solutions across a wide range of industries. 
                  At ${
                    sellerData?.name || "[Company Name]"
                  }, our vision is to revolutionize the manufacturing sector by blending cutting-edge technology with sustainable practices. From design to production, our dedicated team ensures each product is crafted to perfection, adhering to international quality standards.`}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center bg-[#C9AF2F] absolute -top-5 -right-10 lg:h-[160px] lg:w-[200px] md:px-10 md:py-4 px-8 py-3 rounded-tl-[20px] rounded-bl-[20px] -rotate-[34deg]">
              <div className="flex flex-col items-center rotate-[34deg] text-[#FFFFFF]">
                <p className="lg:text-[80px] md:text-[70px] text-5xl font-bold lg:font-extrabold leading-[95%]">
                  {sellerData?.yearsInBusiness || "26"}
                </p>
                <span className="lg:text-[24px] md:text-[20px] text-base font-medium">
                  Years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* information section */}
      <div className="bg-[#F1F1F1] p-4 pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="px-4 md:px-6 bg-white h-[70px] flex items-center mb-1 rounded-t-lg shadow-sm">
            <h2 className="text-xl tracking-wide font-bold text-gray-800">
              BASIC INFORMATION
            </h2>
          </div>

          {/* Info Grid */}
          <div className="bg-[#F1F1F1] py-4 grid grid-cols-1 gap-y-1.5">
            {basicInfo.map((item, index) => (
              <div key={index} className="flex max-md:flex-col md:gap-[10px]">
                <div className="md:w-[50%] flex items-center ps-4 lg:ps-10 min-h-[35px] text-[16px] font-medium bg-[#FFFFFF] shadow-sm">
                  {item.label}
                </div>
                <div className="md:w-[50%] flex items-center ps-4 lg:ps-10 min-h-[35px] text-[16px] bg-[#FFFFFF] shadow-sm">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use the existing InfoCertificates component for certificates */}
      <InfoCertificates userId={sellerId} />
    </div>
  );
};

export default BPAbout;
