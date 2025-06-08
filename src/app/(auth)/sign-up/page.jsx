"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/common/Navbar";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Please log in.");
        // Optionally redirect to login page after registration
        router.push("/log-in");
      } else {
        toast.error(data.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Something went wrong. Please try again.");
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Name"
                  className="w-full px-4 py-2 border border-[#ACAAAA] rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="w-full px-4 py-2 border border-[#ACAAAA] rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                  className="w-full px-4 py-2 border border-[#ACAAAA] rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-[#C9AF2F] hover:bg-yellow-700 text-black font-medium py-2 rounded transition duration-200 text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
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
