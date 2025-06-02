"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/common/Navbar";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4">
        <div className="bg-white p-6 sm:p-14 rounded shadow-md w-full max-w-2xl border border-[#ACAAAA]">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-black text-center sm:text-left md:ml-13">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                  className="w-full px-4 py-2 border border-[#ACAAAA] rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-[#C9AF2F] hover:bg-yellow-700 text-black font-medium py-2 rounded transition duration-200 text-md cursor-pointer"
              >
                Login
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
              <button className="flex items-center justify-center gap-3 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs border-[#ACAAAA]">
                <img src="/login/google.png" alt="Google" className="w-5 h-5" />
                Log in with Google
              </button>
              <button className="flex items-center justify-center gap-3 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs border-[#ACAAAA]">
                <img
                  src="/login/facebook.png"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Log in with Facebook
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
