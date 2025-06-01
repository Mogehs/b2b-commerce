"use client";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { TbRadar } from "react-icons/tb";

export default function TopHeader() {
    return (
        <header className="w-full bg-white ">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">

                {/* Left Side: Logo and Navigation */}
                <div className="flex flex-col items-start">
                    {/* Logo */}
                    <Image
                        src="/logo.png" // 🔧 your actual logo path here
                        alt="ZaBiz Logo"
                        width={200}
                        height={50}
                        className="object-contain"
                    />

                </div>

                {/* Middle: Search Bar */}
                <div className="flex-1 w-full max-w-2xl">
                    {/* Navigation Links */}
                    <nav className="flex gap-6 font-bold text-base text-gray-8  00 ps-5 mt-[-12px]">
                        <span className="cursor-pointer hover:text-gray-600">Product</span>
                        <span className="cursor-pointer hover:text-gray-600">Supplier</span>
                        <span className="cursor-pointer hover:text-gray-600">Buyer</span>
                    </nav>

                    <div className="flex w-full h-[45px] border border-[#ACAAAA] rounded overflow-hidden shadow-sm p-1 mt-1">
                        <input
                            type="text"
                            placeholder="I am Looking for"
                            className="flex-grow px-4 text-base outline-none"
                        />
                        <button className="bg-[#d2b33a] text-black font-semibold px-6 max-md:px-0 hover:bg-[#c4a831] transition text-base cursor-pointer">
                            Search
                        </button>
                    </div>
                </div>

                {/* Right Side: Icons with Text Underneath */}
                <div className="flex gap-6 text-center text-black text-sm md:text-base ">
                    <div className="flex flex-col items-center cursor-pointer text-nowrap">
                        <FaUserCircle className="text-3xl mb-1" />
                        <span>Login / Sign-up</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer">
                        <TbRadar className="text-3xl mb-1" />
                        <span>Near Me</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
