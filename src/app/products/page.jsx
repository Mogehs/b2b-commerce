"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import { useSearchParams, useRouter } from "next/navigation";
import BulkPriceDialog from "../components/common/BulkPriceDialog";

export default function SearchProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/products");
        const data = res.data.products;
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery)
    );
  }, [products, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / resultsPerPage);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage
    );
  }, [filteredProducts, currentPage, resultsPerPage]);

  // Navigate to business profile page
  const navigateToBusinessProfile = (sellerId) => {
    if (!sellerId) {
      console.error("No seller ID available for this product");
      return;
    }
    console.log(sellerId)
    router.push(`/business-profile/${sellerId._id}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F5]">
        {/* Sidebar with static location search */}
        <aside className="w-full md:w-[220px] bg-[#F5F5F5] border-r border-gray-200 px-4 py-6">
          <h2 className="font-semibold text-sm text-gray-700 mb-2">Location</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500"
            />
            <LuSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-white">
          {searchQuery && (
            <p className="text-sm text-gray-600 mb-6">
              Showing results for{" "}
              <span className="font-semibold text-black">{searchQuery}</span>
            </p>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer"
                  >
                    <div onClick={() => navigateToBusinessProfile(product.seller)}>
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-[240px] object-cover"
                      />

                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h3 className="font-medium text-base text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-700 text-sm">
                          PKR {product.price?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Min Qty - {product.minOrderQuantity || "N/A"} Pcs
                        </p>
                        <p className="text-sm text-gray-500 italic mt-1">
                          {product.supplier || "Madina Traders"} -{" "}
                          {product.location || "Lahore"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                      <BulkPriceDialog product={product} />
                      <button
                        className="bg-black text-white hover:bg-gray-800 py-2 text-sm rounded-md"
                        onClick={() => navigateToBusinessProfile(product.seller)}
                      >
                        Contact Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center border rounded text-sm font-medium ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
