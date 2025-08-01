'use client';

import React, { useState, useEffect } from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";
import axios from "axios";
import { IoMdCheckboxOutline } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BPProducts = ({ sellerId, sellerData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Default product categories - could be fetched from an API
  const [categories, setCategories] = useState(['All Products']);
  const [selected, setSelected] = useState('All Products');
  const [showSidebar, setShowSidebar] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories based on seller's products
  useEffect(() => {
    const fetchCategories = async () => {
      if (!sellerId) return;

      try {
        const response = await axios.get(`/api/products/categories?sellerId=${sellerId}`);
        if (response.data && response.data.categories && response.data.categories.length > 0) {
          setCategories(['All Products', ...response.data.categories]);
        }
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };

    fetchCategories();
  }, [sellerId]);

  // Fetch products when category changes
  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        // Add category filter when not "All Products"
        const categoryParam = selected !== 'All Products' ? `&category=${selected}` : '';
        const response = await axios.get(
            `/api/products?sellerId=${sellerId}&limit=16${categoryParam}`
        );

        if (
            response.data &&
            response.data.products &&
            response.data.products.length > 0
        ) {
          setProducts(response.data.products);
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
  }, [sellerId, sellerData, selected]);

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
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleContactSeller = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please log in to contact the seller");
      router.push("/log-in");
      return;
    }

    // Create a conversation with the seller
    const startConversation = async () => {
      try {
        const response = await axios.post("/api/conversations", {
          recipientId: product.seller._id || product.seller,
          productId: product._id,
        });

        // Navigate to chat screen
        router.push(`/dashboard/buyer/chat?conversationId=${response.data.conversationId}`);

        toast.success("Starting conversation with seller...");
      } catch (error) {
        console.error("Error starting conversation:", error);
        toast.error("Failed to start conversation. Please try again.");
      }
    };

    startConversation();
  };

  const handleProductClick = (productId) => {
    router.push(`/product-details/${productId}`);
  };

  return (
      <div className="min-h-screen bg-white">
        <div className="max-w-full mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4 bg-[#F1F1F1]">
          {/* Overlay for mobile */}
          {showSidebar && (
              <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 lg:hidden" onClick={() => setShowSidebar(false)} />
          )}

          {/* Sidebar */}
          <aside
              className={`z-50 fixed lg:static top-0 left-0 h-full lg:h-auto w-[80%] lg:w-1/5 bg-white border border-gray-200 rounded-[5px] p-[0.875rem] transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
          >
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-3 lg:hidden">
              <h2 className="text-[#191C1F] text-[1rem] uppercase font-bold">Product Group</h2>
              <button onClick={() => setShowSidebar(false)}>
                <IoClose className="text-[1.25rem] text-black" />
              </button>
            </div>

            {/* Title (for desktop) */}
            <h2 className="hidden lg:block text-[#191C1F] text-[1rem] text-center uppercase font-bold mb-3">Product Group</h2>

            <div className="flex flex-col gap-2">
              {categories.map((item) => (
                  <button
                      key={item}
                      onClick={() => {
                        setSelected(item);
                        setShowSidebar(false);
                      }}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-full text-xs text-left bg-[#F1F1F1] hover:cursor-pointer 
                text-black transition`}
                  >
                    <span>{item}</span>
                    {selected === item && <IoMdCheckboxOutline className="text-green-600 text-xs ml-2" />}
                  </button>
              ))}
            </div>
          </aside>

          {/* Product Content */}
          <main className="w-full lg:w-4/5">
            {/* Toggle Sidebar button on mobile */}
            <div className="mb-3 block lg:hidden">
              <button
                  onClick={() => setShowSidebar(true)}
                  className="bg-[#C9AF2F] text-white font-medium text-xs px-3 py-1.5 rounded-md"
              >
                ☰ Product Groups
              </button>
            </div>

            {/* Header */}
            <div className="w-full flex flex-col gap-1 bg-white rounded-[5px] p-[0.875rem] mb-3">
              <h1 className="text-[1rem] text-black font-bold">All Products</h1>
              <div className="flex items-center gap-1 md:mx-[6rem]">
                <h2 className="text-sm text-black">Products &gt;</h2>
                <h2 className="text-sm text-[#C9AF2F]">{selected}</h2>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array(8).fill(0).map((_, index) => (
                      <div key={index} className="overflow-hidden flex flex-col gap-2">
                        <div className="rounded-[8px] bg-white shadow-sm">
                          <div className="w-full h-[14rem] bg-gray-200 animate-pulse rounded-t-[8px]"></div>
                          <div className="p-2 space-y-2">
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full rounded-[5px] gap-2">
                          <div className="h-6 bg-gray-200 rounded flex-1 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded flex-1 animate-pulse"></div>
                        </div>
                      </div>
                  ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {products.map((product) => (
                      <div
                          key={product._id}
                          className="overflow-hidden flex flex-col gap-2 cursor-pointer"
                          onClick={() => handleProductClick(product._id)}
                      >
                        <div className="rounded-[8px] bg-white shadow-sm">
                          <div className="w-full h-[14rem] relative">
                            <img
                                src={product.images && product.images[0]?.url
                                    ? product.images[0].url
                                    : "/detail-page/related-products-image.jpg"}
                                alt={product.name || product.title}
                                className="w-full h-full object-cover rounded-t-[8px]"
                            />
                          </div>
                          <div className="p-2">
                            <h3 className="text-xs text-black line-clamp-2">
                              {product.name || product.title}
                            </h3>
                            <p className="text-sm font-bold text-black mt-1">PKR - {product.price}</p>
                            <p className="text-xs text-black mb-1">Min Qty - {product.minOrderQuantity || 1} Pcs</p>
                            <p className="text-xs text-black italic">{sellerData?.name || "Seller"} - {sellerData?.location?.formattedAddress || sellerData?.address || "Location"}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full rounded-[5px] gap-2">
                          <button
                              onClick={(e) => handleGetBulkPrice(product, e)}
                              className="text-xs font-medium p-1.5 w-full rounded-[4px] bg-white shadow-sm hover:bg-gray-50"
                          >
                            Get Bulk Price
                          </button>
                          <button
                              onClick={(e) => handleContactSeller(product, e)}
                              className="text-xs font-medium p-1.5 w-full rounded-[4px] bg-white shadow-sm hover:bg-gray-50"
                          >
                            Contact Seller
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm font-medium">
                    No products in this category.
                  </p>
                </div>
            )}
          </main>
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
                    placeholder={`Minimum ${selectedProduct?.minOrderQuantity || 1}`}
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

        {/*<InfoCertificates userId={sellerId} />*/}
      </div>
  );
};

export default BPProducts;
