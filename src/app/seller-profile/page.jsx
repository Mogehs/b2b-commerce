"use client";

import React from "react";
import { useForm } from "react-hook-form";

const SellerProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    const transformToArray = (value) =>
      value
        ?.split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    const imageFile = data.image[0];

    const transformedData = {
      ...data,
      business: transformToArray(data.business),
      products: transformToArray(data.products),
      offers: transformToArray(data.offers),
      image: imageFile,
    };

    console.log("Form Submitted:", transformedData);
    console.log("Image File:", imageFile);

    reset();
  };


  return (
    <div className="bg-gray-100 py-10 px-4 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-xl p-6 max-w-6xl mx-auto space-y-6"
      >
        <h1 className="text-2xl font-bold text-start text-[#C9AF2F]">Become a Seller</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Store Name", name: "name", type: "text", required: "Store name is required" },
            { label: "Exact Location", name: "location", type: "text", required: "Location is required" },
            { label: "Business Type", name: "business", type: "text", required: "Business type is required" },
            { label: "Type of Products", name: "products", type: "text", required: "Product types are required" },
            { label: "Offers", name: "offers", type: "text", required: "Offers are required" },
            { label: "Title Picture", name: "image", type: "file", required: "Image is required" },
            { label: "Bio", name: "bio", type: "text", required: "Bio is required" },
            { label: "Website (Optional)", name: "website", type: "text", required: false },
            {
              label: "Email",
              name: "email",
              type: "email",
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            },
            { label: "Phone Number", name: "phone", type: "number", required: "Phone number is required" },
            { label: "Phone Number #2", name: "phone2", type: "number", required: "Phone number #2 is required" },
            { label: "Phone Number #3", name: "phone3", type: "number", required: "Phone number #3 is required" },
            { label: "WhatsApp Number", name: "whatsapp", type: "number", required: "WhatsApp is required" },
            { label: "WhatsApp Number #2", name: "whatsapp2", type: "number", required: "WhatsApp #2 is required" },
            { label: "Landmark Nearby", name: "landmark", type: "text", required: "Landmark is required" }
          ].map((field, index) => (
            <div key={index}>
              <label className="block font-semibold text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                {...register(field.name, {
                  required: field.required,
                  ...(field.pattern && { pattern: field.pattern }),
                })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9AF2F] transition"
                {...(field.type === 'file' && { accept: 'image/*' })}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-500">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold text-gray-700 mb-1">Address</label>
            <textarea
              rows={3}
              {...register("address", { required: "Address is required" })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#C9AF2F] hover:cursor-pointer font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md w-full md:w-28"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProfile;
