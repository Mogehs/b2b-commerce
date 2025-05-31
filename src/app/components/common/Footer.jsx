// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-center text-sm text-gray-700 py-4 mt-12">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
        <a href="#" className="hover:underline">
          Terms & Conditions
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Become Free Seller
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          About Us
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Contact Us
        </a>
      </div>

      <p className="mt-2 text-xs text-gray-600">
        Copyright © 2025{" "}
        <span className="text-yellow-600 font-semibold">JZ Mart</span>, All
        Rights Reserved
      </p>
    </footer>
  );
}
