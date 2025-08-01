"use client";

import React, { useState } from "react";
import Loader from "@/app/components/common/Loader";
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

const Products = ({ selectedCategory, products, loading }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCardClick = (id) => {
    router.push(`/product-details/${id}`);
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

  const filteredProducts =
    selectedCategory && selectedCategory !== "All Products"
      ? products.filter((product) => product.category === selectedCategory)
      : products;

  return (
    <>
      <div className="my-8">
        {loading ? (
         <Loader/>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8">
            {filteredProducts.slice(0, 20).map((product, index) => (
              <div
                key={product._id || index}
                className="flex overflow-hidden flex-col w-full gap-4"
              >
                <div className="w-full">
                  <img
                    className="rounded-t-[10px]  w-full h-[220px]"
                    src={product.images[0].url || "/home-page/product.jpg"}
                    alt={product.name}
                  />
                  <div className="bg-white px-2 py-6 pt-0 flex flex-col gap-2 rounded-b-[10px] w-full">
                    <div>
                      <p className="font-bold text-[17px] line-clamp-1">{product.name}</p>
                      <p className="font-semibold text-[14px] line-clamp-2 h-10 leading-5">
                        {product.description}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-[16px]">
                        PKR: {product.price}
                      </p>
                      <p className="text-[12px]">
                        Min Qty: {product.minOrderQuantity || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="italic text-[12px]">
                        Madina Traders - Lahore
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    className="bg-white text-nowrap text-[12px] font-bold py-2.5 px-2 rounded hover:cursor-pointer"
                    onClick={() => handleCardClick(product._id)}
                  >
                    View Product
                  </button>
                  <button
                    className="bg-white text-nowrap text-[12px] font-bold py-2.5 px-2 rounded hover:cursor-pointer"
                    onClick={(e) => handleGetBulkPrice(product, e)}
                  >
                    Get Bulk Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                placeholder={`Minimum ${selectedProduct?.minOrderQuantity || 1
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
    </>
  );
};

export default Products;
