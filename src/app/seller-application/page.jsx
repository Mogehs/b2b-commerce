"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Navbar from "../components/common/Navbar";

const SellerProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      toast.error("Please login to submit seller application");
      router.push("/login");
    }
  }, [session, status, router]);

  const onSubmit = async (data) => {
    if (!session) {
      toast.error("Please login to submit application");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "image" && data[key]?.[0]) {
          formData.append("image", data[key][0]);
        } else if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post("/api/seller/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        timeout: 60000,
      });

      if (response.status === 201) {
        toast.success(
          "Application submitted successfully! We'll review it soon.",
          {
            description: "You'll receive an email notification once reviewed.",
            duration: 5000,
          }
        );
        reset();
        router.push("/dashboard/seller");
      }
    } catch (error) {
      console.error("Application submission error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid application data");
      } else if (error.response?.status === 409) {
        toast.warning("You already have a pending application", {
          description:
            "Please wait for the current application to be reviewed.",
        });
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to submit application", {
          description: "Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="bg-gray-100 py-10 px-4 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
          </div>
        </main>
      </>
    );
  }

  const fields = [
    { label: "Store Name", name: "name", type: "text", required: true },
    { label: "Exact Location", name: "location", type: "text", required: true },
    { label: "Business Type", name: "business", type: "text", required: true },
    {
      label: "Type of Products",
      name: "products",
      type: "text",
      required: true,
    },
    { label: "Offers", name: "offers", type: "text", required: true },
    {
      label: "Title Picture",
      name: "image",
      type: "file",
      required: true,
      accept: "image/*",
    },
    { label: "Website (Optional)", name: "website", type: "url" },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Invalid email address",
      },
    },
    { label: "Phone Number", name: "phone", type: "tel", required: true },
    { label: "Phone Number #2", name: "phone2", type: "tel", required: true },
    { label: "Phone Number #3", name: "phone3", type: "tel", required: true },
    { label: "WhatsApp Number", name: "whatsapp", type: "tel", required: true },
    {
      label: "WhatsApp Number #2",
      name: "whatsapp2",
      type: "tel",
      required: true,
    },
    {
      label: "Landmark Nearby",
      name: "landmark",
      type: "text",
      required: true,
    },
  ];

  const socials = [
    { label: "Facebook", name: "facebook" },
    { label: "Instagram", name: "instagram" },
    { label: "Twitter", name: "twitter" },
    { label: "LinkedIn", name: "linkedin" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 py-10 px-4 min-h-screen">
        <h1 className="text-center text-[#C9AF2F] text-3xl font-bold mb-10 uppercase">
          Become a Supplier
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-xl rounded-xl p-8 max-w-6xl mx-auto space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-6">
              Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    {...register(field.name, {
                      required: field.required && `${field.label} is required`,
                      ...(field.pattern && { pattern: field.pattern }),
                    })}
                    accept={field.accept || undefined}
                    className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors[field.name]
                        ? "border-red-400 focus:ring-red-400"
                        : "focus:ring-[#C9AF2F]"
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Describe your store, offerings, values..."
                {...register("description", {
                  required: "Description is required",
                })}
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-[#C9AF2F]"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Address</label>
              <textarea
                rows={5}
                {...register("address", { required: "Address is required" })}
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-[#C9AF2F]"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-4">
              Social Media Links (Optional)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socials.map((social, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {social.label}
                  </label>
                  <input
                    type="url"
                    placeholder={`https://${social.label.toLowerCase()}.com/yourpage`}
                    {...register(social.name)}
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9AF2F]"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C9AF2F] text-white font-semibold px-10 py-3 rounded-lg hover:bg-[#b79e29] transition-all duration-300 shadow-md w-full sm:w-48 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default SellerProfile;
