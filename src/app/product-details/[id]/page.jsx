"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";

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

const Page = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedImage, setSelectedImage] = useState(
    "/detail-page/product-image.png"
  );
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product details using axios
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data.product);

        // Set the first image as selected image if product has images
        if (
          response.data.product.images &&
          response.data.product.images.length > 0
        ) {
          setSelectedImage(response.data.product.images[0].url);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!session?.user || !id) return;

      try {
        const res = await axios.post("/api/user/fav-product/status", {
          productId: id,
        });
        setIsFavorite(res.data.favorited);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    fetchFavoriteStatus();
  }, [id, session]);

  // Handle RFQ submission with axios
  const handleSubmitRFQ = async () => {
    if (!session?.user) {
      toast.error("Please log in to request a quote");
      router.push("/log-in");
      return;
    }

    if (!quantity || parseInt(quantity) < (product?.minOrderQuantity || 1)) {
      toast.error(`Minimum order quantity is ${product.minOrderQuantity}`);
      return;
    }

    setSubmitting(true);

    try {
      console.log(product);
      const response = await axios.post("/api/rfq", {
        productId: id,
        sellerId: product.seller._id,
        quantity: quantity,
        message: message,
      });
      toast.success("Quote requested successfully!");

      // Close dialog
      setDialogOpen(false);

      // Clear form fields
      setQuantity("");
      setMessage("");

      // Redirect to the chat after a brief delay to allow dialog to close
      setTimeout(() => {
        router.push(
          `/dashboard/buyer/chat?conversationId=${response.data.conversationId}`
        );
      }, 500);
    } catch (error) {
      console.error("RFQ submission error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please login to add to favorites");
      return router.push("/log-in");
    }

    try {
      const res = await axios.post("/api/user/fav-product", {
        productId: product._id,
      });
      setIsFavorite(res.data.favorited);
      toast.success(
        res.data.favorited
          ? "Product added to favorites"
          : "Product removed from favorites"
      );
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleClick = (id) => {
    router.push(`/business-profile/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-sm text-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-4 text-gray-500 text-sm">
            Home &gt; Shop &gt;{" "}
            {loading ? "..." : product?.category || "Products"} &gt;{" "}
            <span className="text-black">
              {loading ? "..." : product?.name || "Product Details"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                {loading ? (
                  <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded"></div>
                ) : product?.images && product.images.length > 0 ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-[400px] object-contain"
                  />
                ) : (
                  <img
                    src="/detail-page/product-image.png"
                    alt="Product placeholder"
                    className="h-[400px] object-contain"
                  />
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex mt-4 gap-2 justify-center">
                {loading
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="w-16 h-16 bg-gray-200 animate-pulse rounded"
                        ></div>
                      ))
                  : product?.images && product.images.length > 0
                  ? product.images.map((image, i) => (
                      <img
                        key={i}
                        src={image.url}
                        alt={`${product.name} image ${i + 1}`}
                        onClick={() => setSelectedImage(image.url)}
                        className={`w-16 h-16 object-contain bg-gray-100 p-2 rounded cursor-pointer border transition ${
                          selectedImage === image.url
                            ? "border-[#C9AF2F]"
                            : "border-transparent"
                        }`}
                      />
                    ))
                  : thumbnails.map((src, i) => (
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
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : product ? (
                <>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="text-gray-600 text-sm">{product.description}</p>

                  <div className="space-y-2 my-4">
                    <div className="flex gap-2">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{product.brandName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{product.model}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">
                        {product.placeOfOrigin}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">Seller:</span>
                      <span className="font-medium">
                        {product.seller?.name}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-red-500">Product not found</p>
              )}{" "}
              <div className="bg-white border rounded p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {loading ? (
                      <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                    ) : product ? (
                      `PKR ${product.price?.toLocaleString() || "N/A"}`
                    ) : (
                      "Price unavailable"
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Minimum Order Quantity -{" "}
                    {loading ? "..." : product?.minOrderQuantity || "N/A"} Pcs
                  </p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading || !product}
                      className="bg-[#C9AF2F] text-black px-4 py-2 font-medium text-sm rounded cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                      {!session?.user && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                          <p className="text-yellow-700 text-sm">
                            Please{" "}
                            <a
                              href="/log-in"
                              className="text-blue-600 underline"
                            >
                              log in
                            </a>{" "}
                            to request a quote.
                          </p>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Required Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min={product?.minOrderQuantity}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder={`Minimum ${
                            product?.minOrderQuantity || 1
                          }`}
                          disabled={submitting}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Minimum quantity: {product?.minOrderQuantity || 1}
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write any specific details..."
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-gray-200 text-gray-800 px-4 py-2 font-medium text-sm rounded cursor-pointer hover:bg-gray-300 transition"
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        onClick={handleSubmitRFQ}
                        className="bg-[#C9AF2F] text-black px-4 py-2 font-medium text-sm rounded cursor-pointer hover:opacity-90 transition"
                        disabled={submitting || !session?.user}
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex md:flex-row flex-col gap-4 md:gap-0 justify-between mt-6">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-[#C9AF2F] hover:cursor-pointer"
                  onClick={toggleFavorite}
                >
                  <AiOutlineHeart size={18} />
                  {isFavorite
                    ? "Remove from Favourite"
                    : "Add Product to Favourite"}
                </button>
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-[#C9AF2F] hover:cursor-pointer"
                  onClick={() => handleClick(product?.seller?._id)}
                >
                  <AiOutlineShareAlt size={18} />
                  <span>View Seller</span>
                </button>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>Delivery:</span>
                    <span>3-5 Business Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Shipping Method:</span>
                    <span>By air, By sea, Express</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>Payment Method:</span>
                    <span>Bank Transfer, Credit Card, Online Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-[#C9AF2F]">
              Related Products
            </h2>
            {product && (
              <RelatedProducts
                category={product.category}
                currentProductId={id}
              />
            )}
          </div>
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-[#C9AF2F]">
              More From This Seller
            </h2>
            {product?.seller?._id && (
              <MoreFromSeller
                sellerId={product.seller._id}
                currentProductId={id}
              />
            )}
          </div>
          <div className="mt-12">
            {product?.seller?._id && (
              <InfoCertificates sellerId={product.seller._id} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
