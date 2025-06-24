"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OtpVerificationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);

    // Simulate OTP check delay
    setTimeout(() => {
      setLoading(false);

      if (otp === "123456") {
        toast.success("OTP Verified Successfully!");
        router.push("/log-in");
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">OTP Verification</h2>
        <p className="text-sm text-center mb-6 text-gray-600">
          Enter the OTP sent to <span className="font-medium text-black">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP (e.g. 123456)"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#C9AF2F] hover:bg-yellow-700 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          (Hint: use <span className="text-black font-medium">123456</span> to simulate success)
        </p>
      </div>
    </div>
  );
}
