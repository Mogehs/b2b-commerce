"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/app/components/common/Navbar";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
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
        toast.success("Account created! Please verify OTP.");
        router.push(
          `/otp-verification?email=${encodeURIComponent(data.email)}`
        );
        return;
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

      // Handle different types of errors
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          toast.error(
            data.message ||
              "This email address is already registered. Please use another email or login."
          );
        } else if (status === 400) {
          toast.error(
            data.message || "Please provide all required information."
          );
        } else if (status === 422) {
          toast.error(
            data.message || "Invalid data provided. Please check your inputs."
          );
        } else {
          toast.error(
            data.message || "Failed to create account. Please try again."
          );
        }
      } else if (error.request) {
        toast.error(
          "Connection error. Please check your internet and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        if (res.error.includes("OAuthAccountNotLinked")) {
          toast.error(
            "This email is already associated with another login method. Please use your original login method."
          );
        } else if (res.error.includes("AccessDenied")) {
          toast.error("Google login was cancelled or access was denied.");
        } else {
          toast.error("Google login failed. Please try again.");
        }
      } else if (res?.ok) {
        toast.success("Google login successful!");
        router.replace("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to connect with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setFbLoading(true);
      const res = await signIn("facebook", { redirect: false });
      if (res?.error) {
        if (res.error.includes("OAuthAccountNotLinked")) {
          toast.error(
            "This email is already associated with another login method. Please use your original login method."
          );
        } else if (res.error.includes("AccessDenied")) {
          toast.error("Facebook login was cancelled or access was denied.");
        } else {
          toast.error("Facebook login failed. Please try again.");
        }
      } else if (res?.ok) {
        toast.success("Facebook login successful!");
        router.replace("/");
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Failed to connect with Facebook. Please try again.");
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div>

      <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4 py-8">
        <div className="bg-white p-6 sm:p-8 lg:p-14 rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl border border-[#ACAAAA]">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-black text-center">
            Register Now
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <div className="flex justify-center">
              <div className="w-full lg:w-[80%]">
                <label
                  htmlFor="name"
                  className="block text-sm sm:text-md font-medium text-black mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  placeholder="Enter your Name"
                  onBlur={() => handleFieldBlur("name")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                    touchedFields.name && errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.name && !errors.name && watchedFields.name
                      ? "border-green-500 focus:ring-green-500"
                      : "border-[#ACAAAA] focus:ring-yellow-500"
                  }`}
                />
                {touchedFields.name && errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
                {touchedFields.name && !errors.name && watchedFields.name && (
                  <p className="text-green-500 text-xs sm:text-sm mt-1">
                    ✓ Valid name
                  </p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex justify-center">
              <div className="w-full lg:w-[80%]">
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-md font-medium text-black mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Enter your Email"
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
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
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
                {touchedFields.email &&
                  !errors.email &&
                  watchedFields.email && (
                    <p className="text-green-500 text-xs sm:text-sm mt-1">
                      ✓ Valid email
                    </p>
                  )}
              </div>
            </div>

            {/* Password Input */}
            <div className="flex justify-center">
              <div className="w-full lg:w-[80%]">
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-md font-medium text-black mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="Enter your Password"
                  onBlur={() => handleFieldBlur("password")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
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
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                {touchedFields.password &&
                  !errors.password &&
                  watchedFields.password && (
                    <p className="text-green-500 text-xs sm:text-sm mt-1">
                      ✓ Strong password
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
                className="w-full sm:w-2/3 lg:w-1/2 bg-[#C9AF2F] hover:bg-yellow-600 text-black font-medium py-2 sm:py-3 rounded-md transition-all duration-200 text-sm sm:text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading ||
                  googleLoading ||
                  fbLoading ||
                  Object.keys(errors).length > 0
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {loading ? "Creating account..." : "Create account"}
                  </span>
                  {loading && (
                    <Loader2 className="animate-spin w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-xs sm:text-sm text-center mt-4 text-black">
              Already have an account?{" "}
              <Link
                href="/log-in"
                className="text-[#00A3E8] hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-4 text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-[80%] max-w-xl">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-50 hover:border-gray-400 w-full sm:w-1/2 text-xs sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={loading || googleLoading || fbLoading}
              >
                <img
                  src="/register/google.png"
                  alt="Google logo"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>
                  {googleLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-3 h-3" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    "Sign up with Google"
                  )}
                </span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-50 hover:border-gray-400 w-full sm:w-1/2 text-xs sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={loading || googleLoading || fbLoading}
              >
                <img
                  src="/register/facebook.png"
                  alt="Facebook logo"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>
                  {fbLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-3 h-3" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    "Sign up with Facebook"
                  )}
                </span>
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 mt-6">
            By proceeding, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              terms and conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
