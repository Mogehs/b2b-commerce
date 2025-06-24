"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // In real case: send request to reset password with email + otp + password
    alert(`Password updated for ${email}`);
    router.push("/log-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="New Password"
        />
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Confirm Password"
        />
        <button
          type="submit"
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
