"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FaUserCircle,
  FaHeart,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { TbRadar } from "react-icons/tb";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlineRateReview } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaGlobeAsia } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NearMeModal from "./NearMeModal";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [showNearMe, setShowNearMe] = useState(false);
  const dialogRef = useRef(null);
  const router = useRouter();

  const toggleDialog = () => setShowDialog((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowDialog(false);
  };

  return (
    <header className="w-full bg-white border-b border-[#ACAAAA] relative">
      <div className="max-w-7xl mx-auto px-4 py-4 max-md:py-0 max-md:pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
        <div className="flex flex-col items-start">
          <Image
            src="/logo.png"
            alt="ZaBiz Logo"
            width={200}
            height={50}
            className="object-contain"
          />
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <nav className="flex gap-6 font-bold text-base text-gray-800 ps-5 max-md:ps-3 mt-[-12px]">
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => router.replace("/")}
            >
              Product
            </span>
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => router.replace("/seller-application")}
            >
              Supplier
            </span>
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => router.replace("/dashboard/buyer")}
            >
              Buyer
            </span>
          </nav>

          <div className="flex w-full h-[45px] lg:h-[50px] border border-[#ACAAAA] rounded overflow-hidden shadow-sm p-1 mt-1">
            <input
              type="text"
              placeholder="I am Looking for"
              className="flex-grow px-2 md:px-4 text-base outline-none"
            />
            <button className="bg-[#d2b33a] text-black font-semibold px-6 max-md:px-2 hover:bg-[#c4a831] transition text-base cursor-pointer">
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-6 text-center text-black md:text-base max-md:mt-[-3px] relative">
          <div
            onClick={toggleDialog}
            className="flex flex-col items-center justify-end mb-2 cursor-pointer w-[80px] h-[70px]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin text-xl" />
                <span className="text-xs font-medium">Loading...</span>
              </>
            ) : status === "authenticated" ? (
              <>
                <Image
                  src={session.user?.image || "/logo.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full text-3xl mb-1"
                />
                <span className="text-xs font-medium truncate">
                  {session.user?.name || "User"}
                </span>
              </>
            ) : (
              <>
                <FaUserCircle className="text-3xl mb-1" />
                <span className="text-xs font-medium whitespace-nowrap">
                  Login / Sign-up
                </span>
              </>
            )}
          </div>

          <div
            className="flex flex-col items-center justify-end w-[80px] h-[70px] cursor-pointer"
            onClick={() => setShowNearMe(true)}
          >
            <TbRadar className="text-3xl mb-1" />
            <span className="text-xs font-medium">Near Me</span>
          </div>
        </div>
      </div>

      {showDialog && (
        <div
          ref={dialogRef}
          className="absolute max-md:top-[98%] top-[95%] max-md:left-[1%] md:right-[1%] lg:right-[5%] md mt-2 w-[240px] bg-white shadow-lg rounded-lg border border-gray-300 z-50 p-4 text-black text-sm"
        >
          {status === "loading" ? (
            <div className="flex items-center gap-10 mb-5">
              <FaUserCircle className="text-3xl mb-1 animate-pulse" />
              <span className="text-xs font-medium whitespace-nowrap">
                Loading...
              </span>
            </div>
          ) : session ? (
            <div className="flex items-center gap-6 mb-5">
              <Image
                src={session.user?.image || "/logo.png"}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full text-3xl mb-1"
              />
              <span className="text-xs font-medium truncate">
                {session.user?.name || "User"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-6 mb-5">
              <FaUserCircle className="text-3xl mb-1" />
              <span className="text-xs font-medium whitespace-nowrap">
                Login / Sign-up
              </span>
            </div>
          )}

          <ul className="space-y-3 mt-2">
            <li
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/buyer/profile");
              }}
            >
              <FaUser /> My Profile
            </li>
            <li
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard/buyer/chat")}
            >
              <BiMessageRoundedDetail /> Message
            </li>
            <li
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard/buyer/favourite")}
            >
              <FaHeart /> Favourite
            </li>
            <li className="flex items-center gap-2 cursor-pointer">
              <MdOutlineRateReview /> My Reviews
            </li>
            <li
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard/buyer/rfq")}
            >
              <BsFileEarmarkText /> My RFQ
            </li>
            {/* <li className="flex items-center gap-2 cursor-pointer">
              <FaGlobeAsia /> Browsing History
            </li> */}
            {session ? (
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleSignOut}
              >
                <FaSignOutAlt /> Logout
              </li>
            ) : (
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/log-in")}
              >
                <FaSignInAlt /> Sign In
              </li>
            )}
          </ul>
        </div>
      )}

      <NearMeModal open={showNearMe} onClose={() => setShowNearMe(false)} />
    </header>
  );
}
