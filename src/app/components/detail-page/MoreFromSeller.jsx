"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MoreFromSeller = ({ sellerId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/products/seller/${sellerId}?excludeId=${currentProductId}&limit=5`
        );

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching seller products:", error);
        setError("Failed to load more products from this seller");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId, currentProductId]);

  const handleProductClick = (productId) => {
    router.push(`/product-details/${productId}`);
  };

  return (
    <div className="mt-10 bg-gray-50 py-2 px-4 md:px-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 uppercase">
        More From This Seller
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 mt-3">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 line-clamp-2">
                  {product.name}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  PKR {product.price?.toLocaleString() || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Min Qty - {product.minOrderQuantity} Pcs
                </p>
                <p className="text-sm text-gray-500">{product.seller}</p>
                <div className="flex gap-2 mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-1 rounded hover:bg-gray-100"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Get Bulk Price
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="py-4">
                        <h3 className="font-semibold text-lg mb-2">
                          Request Bulk Price
                        </h3>
                        <p className="mb-4 text-gray-600">
                          Please contact the seller for a bulk price quote.
                        </p>
                        <Textarea
                          placeholder="Write your message here..."
                          className="mb-4"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() =>
                              router.push(`/product-details/${product._id}`)
                            }
                          >
                            View Product
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          No other products available from this seller at the moment.
        </div>
      )}
    </div>
  );
};

export default MoreFromSeller;
