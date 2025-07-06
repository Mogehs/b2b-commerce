"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/app/components/common/Navbar";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Watch input values for real-time validation
  const watchedFields = watch();

  // Handle field touch state
  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login successful!");
        router.replace("/");
      } else {
        // Handle specific error cases based on the actual error from NextAuth
        if (res?.error) {
          // Map NextAuth errors to user-friendly messages
          switch (res.error) {
            case "CredentialsSignin":
              // Check if user exists but credentials are wrong
              const response = await fetch("/api/user/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
              });

              if (response.ok) {
                const userData = await response.json();
                if (userData.exists && !userData.emailVerified && userData.provider === "credentials") {
                  toast.error(
                    "Please verify your email address before logging in."
                  );
                  setTimeout(() => {
                    const resend = confirm(
                      "Would you like to resend the verification email?"
                    );
                    if (resend) {
                      router.push(
                        `/otp-verification?email=${encodeURIComponent(
                          data.email
                        )}`
                      );
                    }
                  }, 2000);
                } else if (userData.accountLocked) {
                  toast.error(
                    "Account temporarily locked due to failed login attempts. Please try again later."
                  );
                } else if (userData.exists) {
                  toast.error(
                    "Invalid password. Please check your credentials and try again."
                  );
                } else {
                  toast.error(
                    "No account found with this email address. Please check your email or sign up."
                  );
                }
              } else {
                toast.error("Invalid email or password. Please try again.");
              }
              break;
            case "AccessDenied":
              toast.error(
                "Access denied. Please contact support if this issue persists."
              );
              break;
            case "Configuration":
              toast.error(
                "Authentication service is temporarily unavailable. Please try again later."
              );
              break;
            default:
              toast.error(
                "Login failed. Please check your credentials and try again."
              );
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "Connection error. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        // Handle specific Google login errors
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
        // Handle specific Facebook login errors
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4 py-8">
        <div className="bg-white p-6 sm:p-8 lg:p-14 rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl border border-[#ACAAAA]">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-black text-center">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="Enter your Email"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                    touchedFields.email && errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.email && !errors.email
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
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm sm:text-md font-medium text-black"
                  >
                    Password
                  </label>
                  <Link
                    href="/forget-password"
                    className="text-xs sm:text-sm text-blue-600 hover:underline transition-colors duration-200"
                  >
                    Forget Password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  onBlur={() => handleFieldBlur("password")}
                  placeholder="Enter your Password"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                    touchedFields.password && errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.password && !errors.password
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
                      ✓ Valid password
                    </p>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-2/3 lg:w-1/2 bg-[#C9AF2F] hover:bg-yellow-600 text-black font-medium py-2 sm:py-3 rounded-md transition-all duration-200 text-sm sm:text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || googleLoading || fbLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Login</span>
                  {loading && (
                    <Loader2 className="animate-spin w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-xs sm:text-sm text-center mt-4 text-black">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#00A3E8] hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>

          {/* OR Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-4 text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-[80%] max-w-xl">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-50 hover:border-gray-400 w-full sm:w-1/2 text-xs sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={loading || googleLoading || fbLoading}
              >
                <img
                  src="/login/google.png"
                  alt="Google"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>
                  {googleLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-3 h-3" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    "Log in with Google"
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
                  src="/login/facebook.png"
                  alt="Facebook"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>
                  {fbLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-3 h-3" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    "Log in with Facebook"
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
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
