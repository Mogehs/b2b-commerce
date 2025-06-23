"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FavProducts() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/user/fav-product/list");

        if (response.data.success) {
          const fetchedProducts = response.data.products;
          setProducts(fetchedProducts);

          // Extract unique company names for filtering
          const uniqueCompanies = [
            "All",
            ...new Set(fetchedProducts.map((p) => p.company)),
          ];
          setCompanies(uniqueCompanies);
        } else {
          toast.error("Failed to load favorite products");
        }
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        toast.error("Error loading favorite products");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [session]);

  const removeFromFavorites = async (productId) => {
    try {
      const res = await axios.post("/api/user/fav-product", {
        productId,
      });

      if (res.data.success) {
        // Remove product from state
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const filteredProducts =
    selectedCompany === "All"
      ? products
      : products.filter((p) => p.company === selectedCompany);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded shadow-sm flex flex-col items-start">
      <img
        src={product.image}
        alt={product.title}
        className="mb-2 rounded w-full h-[230px] md:w-[250px] md:h-[255px] object-cover cursor-pointer"
        onClick={() => router.push(`/product-details/${product.id}`)}
      />
      <div className="text-sm text-left px-2 mb-2 text-black">
        {product.title}
      </div>
      <div className="text-sm font-bold text-left px-2 text-black">
        PKR - {product.price}
      </div>
      <div className="text-xs text-gray-600 text-left px-2">
        Min Qty - {product.qty} Pcs
      </div>
      <div className="text-xs italic text-gray-500 mt-2 mb-3 text-left px-2">
        {product.company} - {product.location}
      </div>
      <div className="flex px-2 pb-3 gap-2 w-full">
        <button
          className="flex-1 text-xs bg-white border border-gray-300 px-5 py-2 rounded shadow hover:bg-gray-50 font-medium text-black"
          onClick={() => router.push(`/product-details/${product.id}`)}
        >
          View Details
        </button>
        <button
          className="flex-1 text-xs border border-gray-300 bg-white hover:bg-red-50 text-black hover:text-red-500 px-3 py-2 rounded font-medium"
          onClick={() => removeFromFavorites(product.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="flex flex-col md:flex-row rounded">
        {/* Sidebar */}
        <div className="w-full md:max-w-[250px] border border-[#ACAAAA] space-y-2 flex-shrink-0 bg-white overflow-y-auto rounded">
          {companies.map((company, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCompany(company)}
              className={`${
                selectedCompany === company
                  ? "bg-[#ACAAAA]"
                  : "bg-white hover:bg-gray-100"
              } border-b text-center px-4 py-4 text-sm font-medium text-black cursor-pointer`}
            >
              {company}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col bg-white px-2 py-4 mt-4 md:mt-0 md:ml-4 rounded">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCompany === "All"
              ? "All Favorite Products"
              : selectedCompany}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9AF2F]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-60">
              <div className="text-gray-500 text-center">
                <p className="text-xl mb-2">No favorite products found</p>
                <p>Browse products and add them to your favorites</p>
                <button
                  onClick={() => router.push("/products")}
                  className="mt-4 bg-[#C9AF2F] text-black px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
