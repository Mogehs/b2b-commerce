"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const cards = [
  { title1: "Low MOQ", title2: "Minimum Order Quality", service: "Low MOQ" },
  {
    title1: "OEM Services",
    title2: "Original Equipment Manufacture",
    service: "OEM Services",
  },
  {
    title1: "Private Labeling",
    title2: "Private Label Manufactures",
    service: "Private Labeling",
  },
  {
    title1: "Ready to Ship",
    title2: "Deliver on time, every day",
    service: "Ready to Ship",
  },
];

const BrandingCards = ({ products, loading }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedService, setSelectedService] = useState("Low MOQ");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch products by branding service
  const fetchProductsByService = async (service) => {
    try {
      setServiceLoading(true);
      const response = await axios.get(
        `/api/products/by-branding-service?service=${encodeURIComponent(
          service
        )}&limit=20`
      );
      if (response.data.success) {
        setFilteredProducts(response.data.products);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products by service:", error);
      setFilteredProducts([]);
    } finally {
      setServiceLoading(false);
    }
  };

  // Load Low MOQ products by default when component mounts
  useEffect(() => {
    fetchProductsByService("Low MOQ");
  }, []);

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
  };

  const handleBrandingServiceClick = (service) => {
    setSelectedService(service);
    fetchProductsByService(service);
  };

  // Handle RFQ submission
  const handleSubmitRFQ = async () => {
    if (!session?.user) {
      toast.error("Please log in to request a quote");
      router.push("/log-in");
      return;
    }

    if (
      !quantity ||
      parseInt(quantity) < (selectedProduct?.minOrderQuantity || 1)
    ) {
      toast.error(
        `Minimum order quantity is ${selectedProduct?.minOrderQuantity || 1}`
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post("/api/rfq", {
        productId: selectedProduct._id,
        sellerId: selectedProduct.seller._id || selectedProduct.seller,
        quantity: quantity,
        message: message,
      });
      toast.success("Quote requested successfully!");

      // Close dialog
      setDialogOpen(false);

      // Clear form fields
      setQuantity("");
      setMessage("");
      setSelectedProduct(null);

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

  const handleGetBulkPrice = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="my-8">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`bg-white space-y-4 py-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border ${
                selectedService === card.service
                  ? "border-[#C9AF2F] shadow-lg bg-[#C9AF2F]/5"
                  : "hover:border-[#C9AF2F]"
              }`}
              onClick={() => handleBrandingServiceClick(card.service)}
            >
              <p
                className={`text-nowrap md:text-[20px] font-bold ${
                  selectedService === card.service
                    ? "text-[#C9AF2F]"
                    : "text-[#C9AF2F]"
                }`}
              >
                {card.title1}
              </p>
              <p className="text-nowrap text-gray-600">{card.title2}</p>
              {selectedService === card.service && (
                <div className="w-2 h-2 bg-[#C9AF2F] rounded-full mx-auto mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {serviceLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg my-6">
          <p className="text-gray-500 text-lg">
            No products found for "{selectedService}" service.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try selecting a different branding service.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-8 my-6">
          {/* <div className="col-span-full mb-4">
            <p className="text-lg font-semibold text-gray-700 text-center">
              Products from stores offering "{selectedService}" service (
              {filteredProducts.length} found)
            </p>
          </div> */}
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="relative flex flex-col gap-2 group"
            >
              <img
                className="bg-white w-full h-32 object-contain rounded-lg border hover:border-[#C9AF2F] transition-colors cursor-pointer"
                src={product.images[0]?.url || "/home-page/dslr.png"}
                alt={product.name}
                onClick={() => handleCardClick(product._id)}
              />
              {/* Hover Popup with Get Bulk Price button */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-80 transition duration-300 z-10 whitespace-nowrap cursor-pointer"
                onClick={(e) => handleGetBulkPrice(product, e)}
              >
                Get Bulk Price
              </div>

              <p
                className="bg-white text-center font-semibold text-sm cursor-pointer"
                onClick={() => handleCardClick(product._id)}
              >
                {product.name.length > 12
                  ? product.name.slice(0, 12) + "..."
                  : product.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* RFQ Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get Bulk Price Quote</DialogTitle>
            <DialogDescription>
              Fill in your details and required quantity. The seller will get
              back to you with the best bulk price.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {!session?.user && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-yellow-700 text-sm">
                  Please{" "}
                  <a href="/log-in" className="text-blue-600 underline">
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
                min={selectedProduct?.minOrderQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Minimum ${
                  selectedProduct?.minOrderQuantity || 1
                }`}
                disabled={submitting}
                required
              />
              <p className="text-xs text-gray-500">
                Minimum quantity: {selectedProduct?.minOrderQuantity || 1}
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
  );
};

export default BrandingCards;
