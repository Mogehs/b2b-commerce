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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { TbRadar } from "react-icons/tb";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlineRateReview, MdDashboard } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaGlobeAsia } from "react-icons/fa";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NearMeModal from "./NearMeModal";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [showNearMe, setShowNearMe] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dialogRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  // Search suggestions data
  const searchSuggestions = [
    "Office Supplies",
    "Industrial Machinery",
    "Safety Equipment",
    "Laptops & Computers",
    "Furniture",
    "Beauty Products",
    "Clothing & Apparel",
    "Raw Materials",
    "Packaging Solutions",
    "Medical Equipment",
    "Electrical Components",
    "Construction Materials",
  ];

  // Popular searches
  const popularSearches = [
    "Bulk Office Supplies",
    "Industrial Safety Gear",
    "Commercial Kitchen Equipment",
    "Wholesale Electronics",
    "Business Furniture",
  ];

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (query) => {
    if (query.trim()) {
      const updatedHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Remove single item from history
  const removeFromHistory = (itemToRemove) => {
    const updatedHistory = searchHistory.filter(
      (item) => item !== itemToRemove
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase()) &&
        suggestion.toLowerCase() !== searchQuery.toLowerCase()
    )
    .slice(0, 6);

  const toggleDialog = () => setShowDialog((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
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

  const handleSearch = (query = searchQuery) => {
    const searchTerm = query.trim();
    if (searchTerm) {
      saveSearchToHistory(searchTerm);
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleNavigation = (path) => {
    router.replace(path);
    setShowMobileMenu(false);
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="w-full bg-white border-b border-[#ACAAAA] relative shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="ZaBiz Logo"
            width={160}
            height={40}
            className="object-contain cursor-pointer"
            onClick={() => router.replace("/")}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 max-w-3xl mx-8">
          <div className="w-full">
            <nav className="flex gap-8 font-semibold text-sm text-gray-700 mb-3 justify-center">
              <span
                className="navbar-link cursor-pointer hover:text-[#d2b33a] transition-colors duration-200 hover:scale-105 transform"
                onClick={() => router.replace("/products")}
              >
                Products
              </span>
              <span
                className="navbar-link cursor-pointer hover:text-[#d2b33a] transition-colors duration-200 hover:scale-105 transform"
                onClick={() => router.replace("/suppliers")}
              >
                Suppliers
              </span>
              <span
                className="navbar-link cursor-pointer hover:text-[#d2b33a] transition-colors duration-200 hover:scale-105 transform"
                onClick={() => router.replace("/seller-application")}
              >
                Join as Supplier
              </span>
              {/* <span
                className="navbar-link cursor-pointer hover:text-[#d2b33a] transition-colors duration-200 hover:scale-105 transform"
                onClick={() =>
                  router.replace(
                    isAdmin ? "/dashboard/admin" : "/dashboard/buyer"
                  )
                }
              >
                {isAdmin ? "Admin Dashboard" : "Buyer Dashboard"}
              </span> */}
            </nav>

            {/* Enhanced Search Bar */}
            <div className="relative" ref={searchRef}>
              <div
                className={`flex w-full h-[48px] border-2 rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
                  isSearchFocused
                    ? "border-[#d2b33a] shadow-lg ring-2 ring-[#d2b33a]/20"
                    : "border-[#ACAAAA] hover:shadow-md hover:border-[#d2b33a]/50"
                }`}
              >
                <input
                  type="text"
                  placeholder="I am Looking for..."
                  className="search-input flex-grow px-4 text-base outline-none bg-gray-50 focus:bg-white transition-colors duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={handleSearchFocus}
                />
                <button
                  onClick={() => handleSearch()}
                  className="bg-[#d2b33a] text-black font-semibold px-8 hover:bg-[#c4a831] transition-all duration-200 text-base cursor-pointer hover:scale-105 transform flex items-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (isSearchFocused || searchQuery) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-96 overflow-y-auto">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock size={16} />
                          Recent Searches
                        </h4>
                        <button
                          onClick={clearSearchHistory}
                          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between group"
                          >
                            <button
                              onClick={() => handleSuggestionClick(item)}
                              className="flex-1 text-left text-sm text-gray-600 hover:text-[#d2b33a] transition-colors py-1"
                            >
                              {item}
                            </button>
                            <button
                              onClick={() => removeFromHistory(item)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  {!searchQuery && (
                    <div className="p-3 border-b border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Popular Searches
                      </h4>
                      <div className="space-y-1">
                        {popularSearches.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className="block w-full text-left text-sm text-gray-600 hover:text-[#d2b33a] hover:bg-gray-50 transition-colors py-1 px-2 rounded"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Suggestions */}
                  {searchQuery && filteredSuggestions.length > 0 && (
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Suggestions
                      </h4>
                      <div className="space-y-1">
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-sm text-gray-600 hover:text-[#d2b33a] hover:bg-gray-50 transition-colors py-1 px-2 rounded"
                          >
                            <span className="font-medium">
                              {suggestion.substring(
                                0,
                                suggestion
                                  .toLowerCase()
                                  .indexOf(searchQuery.toLowerCase())
                              )}
                            </span>
                            <span className="bg-yellow-200">
                              {suggestion.substring(
                                suggestion
                                  .toLowerCase()
                                  .indexOf(searchQuery.toLowerCase()),
                                suggestion
                                  .toLowerCase()
                                  .indexOf(searchQuery.toLowerCase()) +
                                  searchQuery.length
                              )}
                            </span>
                            <span className="font-medium">
                              {suggestion.substring(
                                suggestion
                                  .toLowerCase()
                                  .indexOf(searchQuery.toLowerCase()) +
                                  searchQuery.length
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && filteredSuggestions.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No suggestions found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-[#d2b33a] transition-colors duration-200"
          >
            {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* User Actions */}
        <div className="flex gap-4 items-center">
          {/* User Profile */}
          <div
            onClick={toggleDialog}
            className="flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[70px]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin text-xl text-[#d2b33a]" />
                <span className="text-xs font-medium mt-1">Loading...</span>
              </>
            ) : status === "authenticated" ? (
              <>
                <div className="relative">
                  <Image
                    src={session.user?.image || "/logo.png"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className={`rounded-full ${
                      isAdmin ? "admin-avatar" : "border-2 border-[#d2b33a]"
                    }`}
                  />
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium truncate max-w-[60px] mt-1">
                  {session.user?.name || "User"}
                </span>
              </>
            ) : (
              <>
                <FaUserCircle className="text-2xl text-gray-600 hover:text-[#d2b33a] transition-colors duration-200" />
                <span className="text-xs font-medium whitespace-nowrap mt-1">
                  Login / Sign-up
                </span>
              </>
            )}
          </div>

          {/* Near Me */}
          <div
            className="flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[70px]"
            onClick={() => setShowNearMe(true)}
          >
            <TbRadar className="text-2xl text-gray-600 hover:text-[#d2b33a] transition-colors duration-200" />
            <span className="text-xs font-medium mt-1">Near Me</span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <div
            className={`flex w-full h-[44px] border-2 rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
              isSearchFocused
                ? "border-[#d2b33a] shadow-lg ring-2 ring-[#d2b33a]/20"
                : "border-[#ACAAAA]"
            }`}
          >
            <input
              type="text"
              placeholder="I am Looking for..."
              className="flex-grow px-3 text-base outline-none bg-gray-50 focus:bg-white transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={handleSearchFocus}
            />
            <button
              onClick={() => handleSearch()}
              className="bg-[#d2b33a] text-black font-semibold px-4 hover:bg-[#c4a831] transition-colors duration-200 text-sm cursor-pointer flex items-center gap-1"
            >
              <Search size={16} />
              Search
            </button>
          </div>

          {/* Mobile Search Suggestions */}
          {showSuggestions && isMobile && (isSearchFocused || searchQuery) && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-80 overflow-y-auto">
              {/* Search History - Mobile */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock size={14} />
                      Recent
                    </h4>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between group"
                      >
                        <button
                          onClick={() => handleSuggestionClick(item)}
                          className="flex-1 text-left text-sm text-gray-600 hover:text-[#d2b33a] transition-colors py-1"
                        >
                          {item}
                        </button>
                        <button
                          onClick={() => removeFromHistory(item)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches - Mobile */}
              {!searchQuery && (
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp size={14} />
                    Popular
                  </h4>
                  <div className="space-y-1">
                    {popularSearches.slice(0, 3).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-[#d2b33a] hover:bg-gray-50 transition-colors py-1 px-2 rounded"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Suggestions - Mobile */}
              {searchQuery && filteredSuggestions.length > 0 && (
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Suggestions
                  </h4>
                  <div className="space-y-1">
                    {filteredSuggestions
                      .slice(0, 4)
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-sm text-gray-600 hover:text-[#d2b33a] hover:bg-gray-50 transition-colors py-1 px-2 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[#ACAAAA] shadow-lg z-40 mobile-menu-enter"
        >
          <nav className="px-4 py-3 space-y-3">
            <div
              className="block py-2 px-3 text-gray-700 hover:bg-[#d2b33a] hover:text-white rounded-lg transition-all duration-200 cursor-pointer font-semibold"
              onClick={() => handleNavigation("/")}
            >
              Products
            </div>
            <div
              className="block py-2 px-3 text-gray-700 hover:bg-[#d2b33a] hover:text-white rounded-lg transition-all duration-200 cursor-pointer font-semibold"
              onClick={() => handleNavigation("/suppliers")}
            >
              Suppliers
            </div>
            <div
              className="block py-2 px-3 text-gray-700 hover:bg-[#d2b33a] hover:text-white rounded-lg transition-all duration-200 cursor-pointer font-semibold"
              onClick={() => handleNavigation("/seller-application")}
            >
              Join as Supplier
            </div>
            <div
              className="block py-2 px-3 text-gray-700 hover:bg-[#d2b33a] hover:text-white rounded-lg transition-all duration-200 cursor-pointer font-semibold"
              onClick={() =>
                handleNavigation(
                  isAdmin ? "/dashboard/admin" : "/dashboard/buyer"
                )
              }
            >
              {isAdmin ? "Admin Dashboard" : "Buyer Dashboard"}
            </div>
          </nav>
        </div>
      )}

      {/* User Dropdown Dialog */}
      {showDialog && (
        <div
          ref={dialogRef}
          className="absolute top-full right-4 lg:right-8 mt-2 w-[280px] bg-white shadow-xl rounded-xl border border-gray-200 z-50 p-1 text-black text-sm animate-scale-in"
        >
          {/* User Header */}
          <div className="p-4 border-b border-gray-100">
            {status === "loading" ? (
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl animate-pulse text-[#d2b33a]" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={session.user?.image || "/logo.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[#d2b33a]"
                  />
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 truncate">
                    {session.user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </div>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Guest User
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {session ? (
              <>
                {isAdmin ? (
                  // Admin Menu Items
                  <>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/admin");
                        setShowDialog(false);
                      }}
                    >
                      <MdDashboard className="text-lg" /> Admin Dashboard
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/admin/users");
                        setShowDialog(false);
                      }}
                    >
                      <FaUser className="text-lg" /> Manage Users
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/admin/profile");
                        setShowDialog(false);
                      }}
                    >
                      <FaUser className="text-lg" /> My Profile
                    </div>
                  </>
                ) : (
                  // Regular User Menu Items
                  <>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/buyer/profile");
                        setShowDialog(false);
                      }}
                    >
                      <FaUser className="text-lg" /> My Profile
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/buyer/chat");
                        setShowDialog(false);
                      }}
                    >
                      <BiMessageRoundedDetail className="text-lg" /> Messages
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/buyer/favourite");
                        setShowDialog(false);
                      }}
                    >
                      <FaHeart className="text-lg" /> Favourites
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        setShowDialog(false);
                      }}
                    >
                      <MdOutlineRateReview className="text-lg" /> My Reviews
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                      onClick={() => {
                        router.push("/dashboard/buyer/rfq");
                        setShowDialog(false);
                      }}
                    >
                      <BsFileEarmarkText className="text-lg" /> My RFQ
                    </div>
                  </>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Logout */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 hover:text-red-600 rounded-lg mx-2 transition-all duration-200 font-medium text-red-500"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="text-lg" /> Logout
                </div>
              </>
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#d2b33a] hover:text-white rounded-lg mx-2 transition-all duration-200 font-medium"
                onClick={() => {
                  router.push("/log-in");
                  setShowDialog(false);
                }}
              >
                <FaSignInAlt className="text-lg" /> Sign In
              </div>
            )}
          </div>
        </div>
      )}

      <NearMeModal open={showNearMe} onClose={() => setShowNearMe(false)} />
    </header>
  );
}
