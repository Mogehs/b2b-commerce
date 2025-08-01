"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"
import Loader from "@/app/components/common/Loader";
import axios from "axios";

export default function Profile() {
  const { data: session, status, update } = useSession();

  // Contact info states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  // Populate form with user data when session is available
  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || "");
      setEmail(session.user.email || "");

      // Check if profile data exists in session
      if (session.user.profile) {
        setWhatsapp(session.user.profile.whatsapp || "");
        setMobile(session.user.profile.phone || "");
      }

      // Always fetch user profile to get hasPassword status
      fetchUserProfile();
    }
  }, [session]);

  // Fetch user profile if not available in session
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile");
      if (response.status === 200) {
        const userData = response.data;
        if (userData.user?.profile) {
          setWhatsapp(userData.user.profile.whatsapp || "");
          setMobile(userData.user.profile.phone || "");
        }
        // Check if user has a password set
        setHasPassword(userData.user?.hasPassword || false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleContactSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put("/api/user/update-profile", {
        name: fullName,
        profile: {
          whatsapp,
          phone: mobile,
        },
      });
      const data = response.data;
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        // Update the session to reflect the changes
        await update({ name: fullName });
      } else {
        toast.error(data.message || "Failed to update profile");
        console.error("Profile update error:", data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    // Reset previous error
    setPasswordError("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // If user has no password, use set-password endpoint
    if (!hasPassword) {
      try {
        setPasswordLoading(true);
        const response = await axios.put("/api/user/set-password", {
          newPassword,
        });
        const data = response.data;
        if (response.status === 200) {
          toast.success(
            "Password set successfully! You can now login with email/password."
          );
          setHasPassword(true);
          // Clear form
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setPasswordError(data.message || "Failed to set password");
        }
      } catch (error) {
        setPasswordError("An unexpected error occurred");
      } finally {
        setPasswordLoading(false);
      }
      return;
    }

    // If user has password, use update-password endpoint
    if (!oldPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axios.put("/api/user/update-password", {
        oldPassword,
        newPassword,
      });
      const data = response.data;
      if (response.status === 200) {
        toast.success("Password updated successfully");
        // Clear form
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (status === "loading") {
    return (
    <Loader/>
    );
  }

  // Determine user type based on whether they have a password set
  // If they don't have a password, they're effectively OAuth-only users
  const isOAuthUser = !hasPassword;

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-black flex flex-col items-center justify-center p-4 space-y-6">
      {/* Hero Section */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {session?.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">
              {session?.user?.name || "User Profile"}
            </h2>
            <p className="text-sm text-gray-700 mt-1">{session?.user?.email}</p>
            <p className="text-sm text-gray-700 mt-1">
              Joined{" "}
              {session?.user?.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl border border-[#ACAAAA]">
        <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-md font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full md:w-[65%] h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-md font-medium mb-1">
              E-Mail
            </label>
            <div className="relative w-full md:w-[65%]">
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                readOnly
                className="w-full h-[50px] border border-gray-300 rounded p-2 pr-20 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-md font-medium mb-1">
              Whatsapp Number
            </label>
            <input
              type="text"
              placeholder="Whatsapp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full md:w-[65%] h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-md font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full md:w-[65%] h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Contact Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="button"
              onClick={handleContactSubmit}
              disabled={loading}
              className="bg-[#C9AF2F] hover:bg-yellow-700 text-black font-bold px-6 rounded cursor-pointer w-[150px] h-[50px] flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Save Info"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Update Password Section - Now available for all users */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl border border-[#ACAAAA]">
        <h2 className="text-2xl font-semibold mb-6">
          {!hasPassword ? "Set Password" : "Update Password"}
        </h2>

        {!hasPassword && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-medium text-blue-900 mb-2">
              🔐 Set a password to login directly
            </p>
            <p className="text-sm text-blue-700">
              You don't currently have a password set for your account. Setting
              a password will allow you to login directly with your email and
              password, in addition to your current login method.
            </p>
          </div>
        )}

        {hasPassword && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium text-green-900 mb-2">
              ✅ Password enabled
            </p>
            <p className="text-sm text-green-700">
              You can login using your email and password, or continue using
              your preferred login method.
            </p>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {passwordError}
          </div>
        )}

        {/* Show old password field only if user has a password set */}
        {hasPassword && (
          <div className="mb-4 w-full md:w-[70%]">
            <label className="block text-md font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter current password"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="w-full md:w-[70%]">
            <label className="block text-md font-medium mb-1">
              {!hasPassword ? "New Password" : "New Password"}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder={
                !hasPassword ? "Set your password" : "Enter new password"
              }
            />
          </div>

          <div className="w-full md:w-[70%]">
            <label className="block text-md font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handlePasswordSubmit}
            disabled={passwordLoading}
            className="bg-[#C9AF2F] hover:bg-yellow-700 text-black font-bold px-6 rounded cursor-pointer w-[170px] h-[50px] text-nowrap flex items-center justify-center"
          >
            {passwordLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : !hasPassword ? (
              "Set Password"
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
