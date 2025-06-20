import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

const ContactInfo = ({ sellerId, sellerData: propSellerData }) => {
  const [sellerData, setSellerData] = useState(propSellerData || null);
  const [loading, setLoading] = useState(!propSellerData);
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
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="text-center">Loading contact information...</div>
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="text-center text-red-500">
          Contact information not available
        </div>
      </div>
    );
  }

  const contactInfoItems = [
    ["Website", sellerData.website || "Not provided"],
    [
      "Whatsapp #",
      sellerData.whatsappNumbers && sellerData.whatsappNumbers[0]
        ? sellerData.whatsappNumbers[0]
        : "Not provided",
    ],
    ["Email", sellerData.email || "Not provided"],
    [
      "Whatsapp # 2",
      sellerData.whatsappNumbers && sellerData.whatsappNumbers[1]
        ? sellerData.whatsappNumbers[1]
        : "Not provided",
    ],
    ["Phone #", sellerData.phone || "Not provided"],
    [
      "Phone # 2",
      sellerData.secondaryPhones && sellerData.secondaryPhones[0]
        ? sellerData.secondaryPhones[0]
        : "Not provided",
    ],
    [
      "Phone # 3",
      sellerData.secondaryPhones && sellerData.secondaryPhones[1]
        ? sellerData.secondaryPhones[1]
        : "Not provided",
    ],
    [
      "Address",
      sellerData.address ||
        sellerData.location?.formattedAddress ||
        "Not provided",
    ],
    ["Land Mark Near", sellerData.landmark || "Not provided"],
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        {sellerData.name || "Store Name"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 text-sm border border-gray-300">
        {contactInfoItems.map(([label, value], index) => (
          <div
            key={index}
            className={`border-b border-gray-300 p-3 flex ${
              index % 2 === 0 ? "sm:border-r" : ""
            }`}
          >
            <span className="font-medium w-28">{label}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold text-lg mb-2">Follow Us</p>
        <div className="flex justify-center gap-4 text-white text-lg">
          {sellerData.socialLinks?.facebook && (
            <a
              href={sellerData.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
            >
              <FaFacebookF />
            </a>
          )}
          {sellerData.socialLinks?.instagram && (
            <a
              href={sellerData.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition"
            >
              <FaInstagram />
            </a>
          )}
          {sellerData.socialLinks?.twitter && (
            <a
              href={sellerData.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition"
            >
              <FaTwitter />
            </a>
          )}
          {sellerData.socialLinks?.linkedin && (
            <a
              href={sellerData.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-800 p-2 rounded-full hover:bg-blue-900 transition"
            >
              <FaLinkedinIn />
            </a>
          )}
          {sellerData.whatsappNumbers && sellerData.whatsappNumbers[0] && (
            <a
              href={`https://wa.me/${sellerData.whatsappNumbers[0]}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition"
            >
              <FaWhatsapp />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
