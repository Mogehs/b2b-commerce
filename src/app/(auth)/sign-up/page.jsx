"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/common/Navbar"; // Adjust path if needed
import Link from "next/link";

export default function RegisterPage() {
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
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-black text-center sm:text-left md:ml-12">
            Register Now
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div className="w-full md:w-[80%]">
                <label htmlFor="email" className="block text-md font-medium text-black mb-1">
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

            <div className="flex justify-center">
              <div className="w-full md:w-[80%]">
                <label htmlFor="password" className="block text-md font-medium text-black mb-1">
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-[#C9AF2F] hover:bg-yellow-700 text-black font-medium py-2 rounded transition duration-200 text-md cursor-pointer"
              >
                Create account
              </button>
            </div>

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
                <img src="/google.png" alt="Google logo" className="w-5 h-5" />
                Log in with Google
              </button>

              <button className="flex items-center justify-center gap-3 border border-[#ACAAAA] px-4 py-2 rounded hover:bg-gray-50 w-full sm:w-[48%] text-xs">
                <img src="/facebook.png" alt="Facebook logo" className="w-5 h-5" />
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
