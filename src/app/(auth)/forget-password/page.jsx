"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just navigate to otp verification page
    router.push(`/otp-reset?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
        <label className="block mb-2 text-sm font-medium">Enter your Email</label>
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
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
