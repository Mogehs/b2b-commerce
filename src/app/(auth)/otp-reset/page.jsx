"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function OtpResetPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email: email,
        otp: otp,
        purpose: "password_reset",
      });

      if (response.data.success) {
        toast.success("OTP verified! You can now reset your password.");
        router.push(
          `/new-password?email=${encodeURIComponent(email)}&token=${
            response.data.resetToken
          }`
        );
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
      toast.error("Email not found. Please try again.");
      return;
    }

    setResending(true);

    try {
      const response = await axios.put("/api/auth/verify-otp", {
        email: email,
        purpose: "password_reset",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Verify Reset OTP</h2>
        <p className="text-sm mb-4 text-gray-600">
          Enter the OTP sent to:{" "}
          <span className="font-medium text-black">{email}</span>
        </p>
        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center text-lg tracking-widest"
          placeholder="Enter 6-digit OTP"
        />
        <button
          type="submit"
          disabled={loading || !otp}
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resending}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded disabled:opacity-50 transition duration-200 hover:cursor-pointer"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
}
