// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#F1F1F1] text-[#222] text-sm border-t border-[#ACAAAA]">
      <div className="max-w-7xl mx-auto px-5 py-7 flex flex-col md:flex-row justify-center items-center md:space-x-6 space-y-2  md:space-y-0 text-center md:text-left">
        <a href="#" className="hover:underline">Terms & Conditions</a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">Become Free Seller</a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">About Us</a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
      <div className="text-center text-xs text-gray-600 py-4 border-t border-[#ACAAAA]">
        Copyright © 2025 <span className="text-[#fcb900] font-semibold">JZ Mart</span>, All Rights Reserved
      </div>
    </footer>
  );
}


