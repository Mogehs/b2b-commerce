"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function OtpVerificationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try registering again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email: email,
        otp: otp,
        purpose: "email_verification",
      });

      if (response.data.success) {
        toast.success("Email verified successfully!");
        router.push("/log-in");
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please try registering again.");
      return;
    }

    setResending(true);

    try {
      const response = await axios.put("/api/auth/verify-otp", {
        email: email,
        purpose: "email_verification",
      });

      if (response.data.success) {
        toast.success("New OTP sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          OTP Verification
        </h2>
        <p className="text-sm text-center mb-6 text-gray-600">
          Enter the OTP sent to{" "}
          <span className="font-medium text-black">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center text-lg tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={loading || !otp}
          className="w-full bg-[#C9AF2F] hover:text-white text-black font-semibold py-2 rounded disabled:opacity-50 transition duration-200 hover:cursor-pointer mb-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={resending}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded disabled:opacity-50 transition duration-200 hover:cursor-pointer"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Didn't receive the code? Check your spam folder or click resend.
        </p>
      </div>
    </div>
  );
}
