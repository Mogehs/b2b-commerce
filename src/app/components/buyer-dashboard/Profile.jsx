'use client';

import React, { useState } from 'react';

export default function Profile() {
  // Contact info states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mobile, setMobile] = useState('');

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleContactSubmit = () => {
    console.log('Contact Info Submitted:', { fullName, email, whatsapp, mobile });
  };

  const handlePasswordSubmit = () => {
    console.log('Password Updated:', { oldPassword, newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-black flex flex-col items-center justify-center p-4 space-y-6">
      {/* Hero Section */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <h2 className="text-2xl font-bold text-black">{fullName}</h2>
        <p className="text-sm text-gray-700 mt-4">
          Member Since March, 2021 (1y - 5M)
        </p>
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
              placeholder='Full Name'
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
                placeholder='E-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] border border-gray-300 rounded p-2 pr-20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                Verified
              </span>
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-md font-medium mb-1">Whatsapp Number</label>
            <input
              type="text"
              placeholder='Watsapp Number'
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full md:w-[65%] h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-md font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              placeholder='Mobile Number'
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
              className="bg-[#C9AF2F] hover:bg-yellow-700 text-black font-bold px-6 rounded cursor-pointer w-[150px] h-[50px]"
            >
              Save Info
            </button>
          </div>
        </div>
      </div>

      {/* Update Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl border border-[#ACAAAA]">
        <h2 className="text-2xl font-semibold mb-6">Update Password</h2>

        <div className="mb-4 w-full md:w-[70%]">
          <label className="block text-md font-medium mb-1">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter old password"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="w-full md:w-[70%]">
            <label className="block text-md font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter new password"
            />
          </div>

          <div className="w-full md:w-[70%]">
            <label className="block text-md font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[50px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handlePasswordSubmit}
            className="bg-[#C9AF2F] hover:bg-yellow-700 text-black font-bold px-6 rounded cursor-pointer w-[170px] h-[50px]"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
