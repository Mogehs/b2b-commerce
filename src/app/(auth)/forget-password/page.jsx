"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/forget-password", {
        email: email,
      });

      if (response.data.success) {
        toast.success("Password reset OTP sent to your email!");
        router.push(`/otp-reset?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(response.data.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Forget password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
        <label className="block mb-2 text-sm font-medium">
          Enter your Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="your@email.com"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset OTP"}
        </button>
      </form>
    </div>
  );
}
