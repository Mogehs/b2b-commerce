import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const ContactInfo = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Madina Traders
      </h1>

      {/* Table-like layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 text-sm border border-gray-300">
        {/* Row */}
        {[
          ["Website", "www.abc.com"],
          ["Whatsapp #", "+92-321-1234567"],
          ["Email", "abc@gmail.com"],
          ["Whatsapp # 2", "+92-321-1234567"],
          ["Phone #", "+92-321-1234567"],
          ["Phone # 2", "+92-321-1234567"],
          ["Phone # 3", "+92-321-1234567"],
          [
            "Address",
            "122-S Bazar Area, Laal Building, Pindi Road, Rawalpindi Cantt",
          ],
          ["Land Mark Near", "Laal Hawaii"],
        ].map(([label, value], index) => (
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

      {/* Follow Us */}
      <div className="mt-6 text-center">
        <p className="font-semibold text-lg mb-2">Follow Us</p>
        <div className="flex justify-center gap-4 text-white text-lg">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://wa.me/923211234567"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
