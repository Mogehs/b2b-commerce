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

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.replace("/");
  //   }
  // }, [status, router]);

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
        toast.error(
          res?.error || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const res = await signIn("google", { redirect: false });
    if (res?.error) {
      toast.error(res.error || "Google login failed");
    } else if (res?.ok) {
      toast.success("Google login successful!");
      router.replace("/");
    }
    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setFbLoading(true);
    const res = await signIn("facebook", { redirect: false });
    if (res?.error) {
      toast.error(res.error || "Facebook login failed");
    } else if (res?.ok) {
      toast.success("Facebook login successful!");
      router.replace("/");
    }
    setFbLoading(false);
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

      <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4">
        <div className="bg-white p-6 sm:p-14 rounded shadow-md w-full max-w-2xl border border-[#ACAAAA]">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-black text-center sm:text-left md:ml-13">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="Enter your Email"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    touchedFields.email && errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.email && !errors.email
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
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="text-md font-medium text-black"
                  >
                    Password
                  </label>
                  <a href="#" className="text-sm text-black hover:underline">
                    Forget Password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  onBlur={() => handleFieldBlur("password")}
                  placeholder="Enter your Password"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    touchedFields.password && errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : touchedFields.password && !errors.password
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
                      Valid password
                    </p>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-[#C9AF2F] hover:text-white text-black font-medium py-2 rounded transition duration-200 text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <div className="flex items-center justify-center gap-5">
                  <p>Login</p>
                  {loading && <Loader2 className="animate-spin text-white" />}
                </div>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-sm text-center mt-2 text-black">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-[#00A3E8] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>

          {/* OR Divider */}
          <div className="my-4 flex items-center justify-center">
            <span className="text-black">- OR -</span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3 md:w-[80%] w-full max-w-xl">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs"
                type="button"
                disabled={loading}
              >
                <img src="/login/google.png" alt="Google" className="w-5 h-5" />
                {loading ? "Loading..." : "Log in with Google"}
              </button>

              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs"
                type="button"
                disabled={fbLoading}
              >
                <img
                  src="/login/facebook.png"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                {fbLoading ? "Loading..." : "Log in with Facebook"}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By proceeding, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
