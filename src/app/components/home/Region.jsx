import React from "react";
import { useRouter } from "next/navigation";

const regions = [
  {
    title: "Sindh",
    cities: "Karachi | Hyderabad | Sukkur | Larkana | Khairpur",
  },
  {
    title: "Punjab",
    cities: "Lahore | Faisalabad | Rawalpindi | Multan | Gujranwala",
  },
  {
    title: "Khyber Pakhtunkhwa",
    cities: "Peshawar | Mardan | Mingora | Kohat | Abbottabad",
  },
  { title: "Balochistan", cities: "Quetta | Turbat | Khuzdar | Hub | Gwadar" },
  {
    title: "Gilgit-Baltistan",
    cities: "Gilgit | Skardu | Khaplu | Dambudas | Shigar",
  },
  {
    title: "Azad Jammu and Kashmir",
    cities: "Muzaffarabad | Mirpur | Rawalakot | Kotli | Bhimber",
  },
];

const Region = () => {
  const router = useRouter();

  const handleRegionClick = (regionTitle) => {
    router.push(`/suppliers?region=${encodeURIComponent(regionTitle)}`);
  };

  const handleViewAllSuppliers = () => {
    router.push("/suppliers");
  };

  return (
    <div className="my-8 flex flex-col gap-4">
      {regions.map((region, index) => (
        <div
          key={index}
          className="bg-white flex md:flex-row flex-col gap-2 md:items-center p-2 md:gap-8 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          onClick={() => handleRegionClick(region.title)}
        >
          <p className="font-semibold text-[18px] text-[#C9AF2F]">
            {region.title}:
          </p>
          <p className="text-black/50">{region.cities}</p>
        </div>
      ))}

      {/* View All Suppliers Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleViewAllSuppliers}
          className="bg-[#C9AF2F] hover:bg-[#B8A028] text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200"
        >
          Browse All Suppliers
        </button>
      </div>
    </div>
  );
};

export default Region;
