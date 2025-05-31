import React from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";
const relatedProducts = [
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
  {
    title:
      "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.........",
    price: "PKR - 2500",
    minQty: "Min Qty - 100 Pcs",
    seller: "Madina Traders - Lahore",
    image: "/detail-page/related-products-image.jpg",
  },
];

const BPHome = () => {
  return (
    <div>
      <div className="mt-10 bg-gray-50 py-2 px-4 md:px-5 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {relatedProducts.map((product, index) => (
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
      </div>
      <InfoCertificates />
    </div>
  );
};

export default BPHome;
