"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function OtpResetPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/new-password?email=${encodeURIComponent(email)}&otp=${otp}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
        <p className="text-sm mb-4 text-gray-600">Sent to: {email}</p>
        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Enter OTP"
        />
        <button
          type="submit"
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200"
        >
          Verify & Continue
        </button>
      </form>
    </div>
  );
}
