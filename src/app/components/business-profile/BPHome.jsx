import React, { useState, useEffect } from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";
import axios from "axios";

const BPHome = ({ sellerId, sellerData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/products?sellerId=${sellerId}&limit=6`
        );
        if (
          response.data &&
          response.data.products &&
          response.data.products.length > 0
        ) {
          const formattedProducts = response.data.products.map((product) => ({
            title: product.name || product.title,
            price: `PKR - ${product.price}`,
            minQty: `Min Qty - ${product.minOrderQuantity || 1} Pcs`,
            seller: `${sellerData?.name || "Seller"} - ${
              sellerData?.location?.formattedAddress || sellerData?.address
            }`,
            image:
              product.images && product.images[0]?.url
                ? product.images[0].url
                : "/detail-page/related-products-image.jpg",
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
  }, [sellerId, sellerData]);

  return (
    <div>
      {" "}
      <div className="mt-10 bg-gray-50 py-2 px-4 md:px-5 rounded-lg">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 bg-gray-300 rounded flex-1 animate-pulse"></div>
                      <div className="h-8 bg-gray-300 rounded flex-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt="Product"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">
                    {product.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.price}
                  </p>
                  <p className="text-sm text-gray-600">{product.minQty}</p>
                  <p className="text-sm text-gray-500">{product.seller}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-1 rounded hover:bg-gray-100">
                      Get Bulk Price
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-1 rounded hover:bg-gray-100">
                      Contact Seller
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
      <InfoCertificates userId={sellerId} />
    </div>
  );
};

export default BPHome;
