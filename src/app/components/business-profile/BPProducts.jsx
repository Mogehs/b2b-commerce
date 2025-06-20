"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import InfoCertificates from "../common/information-certificates/InfoCertificates";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "All Products",
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Toys",
  "Beauty",
];

const BPProducts = ({ sellerId }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sellerId) {
      setProducts([]);
      return;
    }

    const fetchSellerProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products?sellerId=${sellerId}`);
        console.log("Fetched products:", response.data);
        if (
          response.data &&
          response.data.products &&
          response.data.products.length > 0
        ) {
          const formattedProducts = response.data.products.map((product) => ({
            title: product.name || product.title,
            price: `PKR - ${product.price}`,
            minQty: `Min Qty - ${product.minOrderQuantity || 1} Pcs`,
            seller: product.seller?.name || "Seller",
            image:
              product.images && product.images[0]?.url
                ? product.images[0].url
                : "/detail-page/related-products-image.jpg",
            category: product.category,
          }));
          setProducts(formattedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching seller products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId]);

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="border-b pb-4">
          <div className="flex flex-wrap gap-4 text-sm">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={clsx(
                  "py-1 px-4 rounded-full transition",
                  selectedCategory === category
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-52" />
                    <div className="pt-3 space-y-2">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden transition hover:shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-800 font-semibold mt-2">
                      {product.price}
                    </p>
                    <p className="text-sm text-gray-600">{product.minQty}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.seller}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 text-sm font-medium rounded">
                        Inquire Now
                      </button>
                      <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 text-sm font-medium rounded">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">
                No products in this store.
              </p>
            </div>
          )}
        </div>
      </div>
      <InfoCertificates userId={sellerId} />
    </div>
  );
};

export default BPProducts;
