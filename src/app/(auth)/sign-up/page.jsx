"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/app/components/common/Navbar";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations";
import axios from "axios";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // This enables onChange validation
  });

  // Watch all fields for real-time validation
  const watchedFields = watch();

  // Handle field touch state
  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", data);
      const responseData = res.data;

      if (res.status === 200) {
        toast.success("Account created successfully! Please log in.");
        reset();
        router.push("/log-in");
      } else {
        // Enhanced error handling with specific messages
        if (responseData.message) {
          // Show the specific error message from the server
          toast.error(responseData.message);
        } else if (res.status === 409) {
          toast.error(
            "Email already in use. Please try another email address."
          );
        } else if (res.status === 400) {
          toast.error("Please provide all required information.");
        } else {
          toast.error("Failed to create account. Please try again.");
        }

        // Highlight the field with error if it's related to a specific field
        if (responseData.field) {
          setTouchedFields((prev) => ({
            ...prev,
            [responseData.field]: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error(
        "Connection error. Please check your internet and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4 py-10">
        <div className="bg-white p-6 sm:p-14 rounded shadow-md w-full max-w-2xl border border-[#ACAAAA]">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-black text-center sm:text-left md:ml-12">
            Register Now
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <div className="flex justify-center">
              <div className="w-full md:w-[80%]">
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-black mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  placeholder="Enter your Name"
                  onBlur={() => handleFieldBlur("name")}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    touchedFields.name && errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.name && !errors.name && watchedFields.name
                      ? "border-green-500 focus:ring-green-500"
                      : "border-[#ACAAAA] focus:ring-yellow-500"
                  }`}
                />
                {touchedFields.name && errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
                {touchedFields.name && !errors.name && watchedFields.name && (
                  <p className="text-green-500 text-sm mt-1">Valid name</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex justify-center">
              <div className="w-full md:w-[80%]">
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-black mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Enter your Email"
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    touchedFields.email && errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.email &&
                        !errors.email &&
                        watchedFields.email
                      ? "border-green-500 focus:ring-green-500"
                      : "border-[#ACAAAA] focus:ring-yellow-500"
                  }`}
                />
                {touchedFields.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
                {touchedFields.email &&
                  !errors.email &&
                  watchedFields.email && (
                    <p className="text-green-500 text-sm mt-1">Valid email</p>
                  )}
              </div>
            </div>

            {/* Password Input */}
            <div className="flex justify-center">
              <div className="w-full md:w-[80%]">
                <label
                  htmlFor="password"
                  className="block text-md font-medium text-black mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="Enter your Password"
                  onBlur={() => handleFieldBlur("password")}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    touchedFields.password && errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.password &&
                        !errors.password &&
                        watchedFields.password
                      ? "border-green-500 focus:ring-green-500"
                      : "border-[#ACAAAA] focus:ring-yellow-500"
                  }`}
                />
                {touchedFields.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                {touchedFields.password &&
                  !errors.password &&
                  watchedFields.password && (
                    <p className="text-green-500 text-sm mt-1">
                      Strong password
                    </p>
                  )}
                <p className="text-xs text-gray-500 mt-1">
                  Password must contain at least 8 characters with uppercase,
                  lowercase, and number
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-[#C9AF2F] hover:bg-yellow-700 text-black font-medium py-2 rounded transition duration-200 text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-sm text-center mt-2 text-black">
              Already have an account?{" "}
              <Link href="/log-in" className="text-[#00A3E8] hover:underline">
                Login
              </Link>
            </p>
          </form>

          <div className="my-4 flex items-center justify-center">
            <span className="text-black">- OR -</span>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3 md:w-[80%] w-full max-w-xl">
              <button className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs">
                <img
                  src="/register/google.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                Log in with Google
              </button>

              <button className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs">
                <img
                  src="/register/facebook.png"
                  alt="Facebook logo"
                  className="w-5 h-5"
                />
                Log in with Facebook
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            By proceeding, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
