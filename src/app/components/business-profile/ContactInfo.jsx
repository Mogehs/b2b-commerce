import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

const ContactInfo = ({ sellerId, sellerData: propSellerData }) => {
  const [sellerData, setSellerData] = useState(propSellerData || null);
  const [loading, setLoading] = useState(!propSellerData);
  const [messageText, setMessageText] = useState("");
  const params = useParams();
  const id = sellerId || params.id;

  useEffect(() => {
    if (propSellerData) {
      setSellerData(propSellerData);
      setLoading(false);
      return;
    }

    const fetchSellerData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/seller/${id}`);
        if (response.data && response.data.length > 0) {
          setSellerData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id, propSellerData]);

  if (loading) {
    return (
      <div className="bg-[#F1F1F1] py-10">
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-[2px] shadow-sm">
          <div className="text-center text-base">
            Loading contact information...
          </div>
        </div>
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="bg-[#F1F1F1] py-10">
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-[2px] shadow-sm">
          <div className="text-center text-red-500 text-base">
            Contact information not available
          </div>
        </div>
      </div>
    );
  }

  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };

  return (
    <div className="font-sans bg-[#F1F1F1]">
      {/* First section - Deals form */}
      <div className="bg-[#f2f2f2] py-8 flex justify-center px-6">
        <div className="bg-[#FFFFFF] rounded-[2px] border border-gray-300 px-6 py-5 w-full max-w-4xl shadow-sm">
          <h2 className="text-lg font-semibold text-black">
            Get the best deals, Faster and Smarter
          </h2>
          <p className="text-gray-500 font-medium text-[14px] mt-1">
            Let us help you get the best deals quickly and efficiently. Fill the
            details below:
          </p>

          <form className="mt-4 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Product / service"
              className="border border-gray-300 px-4 py-2 rounded-[2px] w-full sm:w-auto flex-1 min-w-[180px] text-sm"
            />
            <input
              type="text"
              placeholder="Qty"
              className="border border-gray-300 px-4 py-2 rounded-[2px] w-full sm:w-auto flex-1 min-w-[100px] text-sm"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="border border-gray-300 px-4 py-2 rounded-[2px] w-full sm:w-auto flex-1 min-w-[200px] text-sm"
            />
            <button
              type="submit"
              className="bg-[#C9AF2F] hover:bg-[#b89b2f] text-black font-semibold px-5 py-2 rounded-[2px] text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Second section - Message to supplier */}
      <div className="bg-[#f5f5f5] px-6">
        <div className="bg-[#FFFFFF] border border-gray-400/40 rounded-[2px] max-w-7xl mx-auto shadow-sm">
          <div className="bg-[#FFFFFF] max-w-4xl mx-auto md:py-10 py-5 px-2">
            <span className="text-base">To:-</span>
            <div className="px-5">
              <p className="mb-3">
                <span className="text-base tracking-wide">
                  {sellerData.name || "Supplier"}
                </span>
                <span className="ml-4 font-bold text-base tracking-wide">
                  Message to Supplier
                </span>
                <span className="float-right text-xs text-gray-800 font-medium max-md:mt-2">
                  {messageText.length}/1000
                </span>
              </p>
              <textarea
                rows="5"
                className="w-full border border-gray-300 p-3 rounded-[2px] resize-none text-sm placeholder-gray-500"
                placeholder="Write your inquiry"
                maxLength={1000}
                value={messageText}
                onChange={handleMessageChange}
              ></textarea>
              <div className="mt-3 text-right">
                <button className="bg-[#C9AF2F] hover:bg-[#b89b2f] text-black font-semibold px-5 py-2 rounded-[2px] text-sm">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third section - Contact info grid */}
      <div className="bg-gray-100 px-6 py-6 md:py-8">
        <div className="bg-white p-5 rounded-[2px] shadow-sm max-w-7xl mx-auto text-nowrap">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3">
            <h2 className="text-lg lg:text-xl font-bold">
              {sellerData.name || "Supplier"}
            </h2>
            <h2 className="text-lg font-bold hidden lg:block">Follow us</h2>
          </div>

          {/* Contact Info Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-[32%_68%] lg:grid-cols-[25%_75%] gap-2 md:gap-5 lg:gap-6">
            {/* Left Column - Contact Info */}
            <div className="space-y-3">
              {[
                { label: "Website:", value: sellerData.website || "Not provided" },
                { label: "E-mail:", value: sellerData.email || "Not provided" },
                { label: "Phone #:", value: sellerData.phone || "Not provided" },
                {
                  label: "Phone #2:",
                  value:
                    (sellerData.secondaryPhones &&
                      sellerData.secondaryPhones[0]) ||
                    "Not provided",
                },
                {
                  label: "Phone #3:",
                  value:
                    (sellerData.secondaryPhones &&
                      sellerData.secondaryPhones[1]) ||
                    "Not provided",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-1 items-center">
                  <span className="font-bold text-[15px] lg:text-[16px] w-28">
                    {item.label}
                  </span>
                  <span className="font-semibold text-[14px] lg:text-[15px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Middle Column - Additional Info */}
            <div className="space-y-3">
              {[
                {
                  label: "Whatsapp #:",
                  value:
                    (sellerData.whatsappNumbers &&
                      sellerData.whatsappNumbers[0]) ||
                    "Not provided",
                },
                {
                  label: "Whatsapp #2:",
                  value:
                    (sellerData.whatsappNumbers &&
                      sellerData.whatsappNumbers[1]) ||
                    "Not provided",
                },
                {
                  label: "Whatsapp #3:",
                  value:
                    (sellerData.whatsappNumbers &&
                      sellerData.whatsappNumbers[2]) ||
                    "Not provided",
                },
                {
                  label: "Land Mark:",
                  value: (
                    <div className="flex items-center">
                      {sellerData.landmark || "Not provided"}
                      <a
                        href="#"
                        className="text-[#00A3E8] text-[15px] lg:text-[16px] font-bold ml-4"
                      >
                        Find on map
                      </a>
                    </div>
                  ),
                },
                {
                  label: "Address:",
                  value:
                    sellerData.address ||
                    sellerData.location?.formattedAddress ||
                    "Not provided",
                  className: "line-clamp-1 flex items-center",
                },
              ].map((item) => (
                <div key={item.label} className="flex max-lg:gap-0 gap-4 items-center">
                  <span className="font-bold text-[15px] lg:text-[16px] w-32">
                    {item.label}
                  </span>
                  <span
                    className={`flex-1 font-semibold text-[14px] lg:text-[15px] ${
                      item.className || ""
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column - Social Icons */}
            <div className="hidden absolute right-0 -top-2 lg:flex flex-col">
              <div className="flex gap-5 pe-2">
                <div className="space-y-4">
                  {sellerData.socialLinks?.facebook && (
                    <a
                      href={sellerData.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFacebookF className="cursor-pointer h-[30px]" />
                    </a>
                  )}
                  <PiXLogoBold className="cursor-pointer h-[30px]" />
                  {sellerData.socialLinks?.instagram && (
                    <a
                      href={sellerData.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaInstagram className="cursor-pointer h-[30px]" />
                    </a>
                  )}
                </div>
                <div className="space-y-4">
                  {sellerData.socialLinks?.linkedin && (
                    <a
                      href={sellerData.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedinIn className="cursor-pointer h-[30px]" />
                    </a>
                  )}
                  <FaYoutube className="cursor-pointer h-[30px]" />
                  <FaTiktok className="cursor-pointer h-[30px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Social Icons */}
          <div className="lg:hidden mt-6 flex gap-2">
            <h2 className="text-base font-bold mb-4">Follow us :</h2>
            <div className="flex space-x-3 md:space-x-4">
              {sellerData.socialLinks?.facebook && (
                <a
                  href={sellerData.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebookF className="cursor-pointer h-[24px]" />
                </a>
              )}
              <PiXLogoBold className="cursor-pointer h-[24px]" />
              {sellerData.socialLinks?.instagram && (
                <a
                  href={sellerData.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="cursor-pointer h-[24px]" />
                </a>
              )}
              {sellerData.socialLinks?.linkedin && (
                <a
                  href={sellerData.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn className="cursor-pointer h-[24px]" />
                </a>
              )}
              <FaYoutube className="cursor-pointer h-[24px]" />
              <FaTiktok className="cursor-pointer h-[24px]" />
              {sellerData.whatsappNumbers && sellerData.whatsappNumbers[0] && (
                <a
                  href={`https://wa.me/${sellerData.whatsappNumbers[0]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp className="cursor-pointer h-[24px]" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
