"use client";
import React, { useState } from "react";

import Navbar from "@/app/components/common/Navbar";
import RelatedProducts from "@/app/components/detail-page/RelatedProducts";
import { AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import MoreFromSeller from "@/app/components/detail-page/MoreFromSeller";
import Footer from "@/app/components/common/Footer";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InfoCertificates from "@/app/components/common/information-certificates/InfoCertificates";
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
const thumbnails = [
  "/detail-page/product-image.png",
  "/detail-page/related-product-detail-1.png",
  "/detail-page/related-product-detail-2.png",
  "/detail-page/related-product-detail-3.png",
];
const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(
    "/detail-page/product-image.png"
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-sm text-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-4 text-gray-500 text-sm">
            Home &gt; Shop &gt; Men &gt;{" "}
            <span className="text-black">T-shirts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Product"
                  className="h-[400px] object-contain"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex mt-4 gap-2 justify-center">
                {thumbnails.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    onClick={() => setSelectedImage(src)}
                    className={`w-16 h-16 object-contain bg-gray-100 p-2 rounded cursor-pointer border transition ${
                      selectedImage === src
                        ? "border-[#C9AF2F]"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Men’s t shirts online shopping in Pakistan. Explore huge variety
                of premium quality t-shirts. All sizes and colors are
                available.....
              </p>

              <div className="bg-white border rounded p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">PKR-1500</h2>
                  <p className="text-sm text-gray-500">
                    Minimum Order Quantity - 100 Pcs
                  </p>
                </div>

                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-[#C9AF2F] text-black px-4 py-2 font-medium text-sm rounded cursor-pointer hover:opacity-90 transition"
                        a
                      >
                        Get Bulk Price
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Get Bulk Price Quote</DialogTitle>
                        <DialogDescription>
                          Fill in your details and required quantity. The seller
                          will get back to you with the best bulk price.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" placeholder="John Doe" />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="quantity">Required Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="e.g. 500"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Write any specific details..."
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="bg-[#C9AF2F] text-black px-4 py-2 font-medium text-sm rounded cursor-pointer hover:opacity-90 transition"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-[#C9AF2F] text-black px-4 py-2 font-medium text-sm rounded cursor-pointer hover:opacity-90 transition"
                        >
                          Request Quote
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </div>

              {/* Seller Info Box */}
              <div className="bg-white border rounded p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Madina Traders</h3>
                    <p className="text-sm text-gray-500">
                      Lahore, Punjab, Pakistan
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xl text-gray-700 mt-5">
                    <AiOutlineHeart className="cursor-pointer" />
                    <AiOutlineShareAlt className="cursor-pointer" />
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Manufacture</span>, Online
                    Seller, Exporter
                  </p>
                  <p>
                    <span className="font-medium">Main Categories:</span>
                    Garments, Industrial Machinery
                  </p>
                  <p>
                    <span className="font-medium">We Offered:</span> OEM,
                    Customization, Private labeling
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="border border-gray-400 px-4 py-2 rounded text-sm hover:bg-gray-100">
                    View Number
                  </button>
                  <button className="border border-gray-400 px-4 py-2 rounded text-sm hover:bg-gray-100">
                    Contact Seller
                  </button>
                </div>

                {/* Bottom right: See All Products */}
                <div className="absolute top-4 right-4 text-xs text-gray-600 underline cursor-pointer">
                  See all Products
                </div>
              </div>

              {/* Rating & Reviews Placeholder */}
              <div className="text-sm text-gray-500">
                Rating & Reviews <p>5/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Overview Table */}
        <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Product Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
            {[
              ["Product name", "T-Shirt"],
              ["Brand name", "Uzi"],
              ["Model", "N/A"],
              ["Place of Origin", "Pakistan"],
              ["Product Price", "1500"],
              ["Minimum Order Quantity", "100 Pcs"],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Description */}
        <div className="mt-10 md:px-5">
          <h1 className="text-xl font-medium pb-3">Description</h1>
          <p className="">
            Elevate your casual style with our sleek black t-shirt, perfect for
            any occasion. Crafted from high-quality, breathable fabric, this
            t-shirt ensures comfort while making a bold statement. The classic
            fit flatters all body types, while the stylish design pairs
            effortlessly with your favorite jeans or shorts. Complete your look
            with a pair of trendy sunglasses for that effortlessly cool vibe.
            Make this essential piece a staple in your wardrobe today.
          </p>
          <div className="flex items-center justify-center max-sm:flex-col  py-5 gap-3">
            {[1, 2, 3].map((item, i) => (
              <div key={i}>
                <img
                  key={i}
                  src={`/detail-page/related-product-detail-${item}.png`}
                  alt={`Thumbnail ${i + 1}`}
                  className="object-cover w-96 h-80 rounded-lg"
                />
              </div>
            ))}
          </div>
          <div>
            <MoreFromSeller relatedProducts={relatedProducts} />
            <RelatedProducts relatedProducts={relatedProducts} />
          </div>
          <InfoCertificates />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
