"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const resetToken = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber,
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
      return;
    }

    if (!email || !resetToken) {
      toast.error("Invalid reset session. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email: email,
        resetToken: resetToken,
        newPassword: password,
      });

      if (response.data.success) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/log-in");
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
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
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <p className="text-sm mb-4 text-gray-600">
          Setting new password for:{" "}
          <span className="font-medium text-black">{email}</span>
        </p>

        <div className="mb-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              password && passwordValidation.isValid
                ? "border-green-500 focus:ring-green-500"
                : password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-yellow-500"
            }`}
            placeholder="New Password"
          />

          {password && (
            <div className="mt-2 text-xs space-y-1">
              <div
                className={
                  passwordValidation.minLength
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ✓ At least 8 characters
              </div>
              <div
                className={
                  passwordValidation.hasUpper
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ✓ One uppercase letter
              </div>
              <div
                className={
                  passwordValidation.hasLower
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ✓ One lowercase letter
              </div>
              <div
                className={
                  passwordValidation.hasNumber
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ✓ One number
              </div>
            </div>
          )}
        </div>

        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={`w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 ${
            confirm && password === confirm
              ? "border-green-500 focus:ring-green-500"
              : confirm
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-yellow-500"
          }`}
          placeholder="Confirm Password"
        />

        {confirm && password !== confirm && (
          <p className="text-red-500 text-xs mb-4">Passwords do not match</p>
        )}

        <button
          type="submit"
          disabled={
            loading || !passwordValidation.isValid || password !== confirm
          }
          className="w-full bg-[#C9AF2F] hover:text-white font-medium py-2 rounded hover:cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
