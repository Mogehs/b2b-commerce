'use client';

import React, { useState, useEffect } from "react";
import InfoCertificates from "../common/information-certificates/InfoCertificates";
import axios from "axios";
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
import Loader from "@/app/components/common/Loader"

const BPHome = ({ sellerId, sellerData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Basic info using seller data from props
  const basicInfo = [
    { label: "Business Owner", value: sellerData?.owner || "Mr. ABC" },
    { label: "Business Type", value: sellerData?.businessType || "Manufacturer, Wholesaler, Importer Exporter" },
    { label: "Business Legal Status", value: sellerData?.businessLegalStatus || "Sole Proprietor" },
    { label: "Year of Establish", value: sellerData?.yearEstablished || "1988" },
    { label: "Type of Products", value: sellerData?.typeOfProducts || "Jackets, Bags, Laptops etc." },
    { label: "Main Market", value: sellerData?.mainMarkets?.join(", ") || "USA, UK, Spain, Pakistan" },
    { label: "Yearly Revenue", value: sellerData?.yearlyRevenue || "230000/- Lakh" },
  ];

  // Fetch products
  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/products?sellerId=${sellerId}&limit=16`);

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
  }, [sellerId]);

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

  const navigateToBusinessProfile = (sellerId) => {
    // This function is a bit different since we're already on the business profile
    // Here we'll navigate to product details instead
    router.push(`/product-details/${sellerId}`);
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

  return (
    <>
      {/* About section with products */}
      <div className='bg-[#F1F1F1] p-6'>
        <div className='max-w-8xl mx-auto'>
          {loading ? (
              <Loader/>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No products found for this seller.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, index) => (
                <div
                  key={product._id || index}
                  className="flex flex-col justify-between bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer"
                >
                  <div onClick={() => navigateToBusinessProfile(product._id)}>
                    <img
                      src={product.images && product.images[0]?.url
                        ? product.images[0].url
                        : "/detail-page/related-products-image.jpg"}
                      alt={product.name || product.title}
                      className="w-full h-[240px] object-cover"
                    />

                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {product.name || product.title}
                      </h3>
                      <p className="text-gray-700 text-xs">
                        PKR {product.price?.toLocaleString() || product.price}
                      </p>
                      <p className="text-xs text-gray-600">
                        Min Qty - {product.minOrderQuantity || "1"} Pcs
                      </p>
                      <p className="text-xs text-gray-500 italic mt-1">
                        {sellerData?.name || "Seller"} - {sellerData?.location?.formattedAddress || sellerData?.address || "Location"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                    <button
                      className="bg-white border border-gray-300 hover:bg-gray-50 py-1.5 text-xs rounded-md"
                      onClick={(e) => handleGetBulkPrice(product, e)}
                    >
                      Get Bulk Price
                    </button>
                    <button
                      className="bg-black text-white hover:bg-gray-800 py-1.5 text-xs rounded-md"
                      onClick={(e) => handleContactSeller(product, e)}
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Information section */}
      <div className='bg-[#F1F1F1] p-6 pt-10'>
        <div className='max-w-8xl mx-auto'>
          {/* Header */}
          <div className='px-6 md:px-10 bg-white h-[80px] flex items-center mb-1'>
            <h2 className='text-xl tracking-wide font-bold'>BASIC INFORMATION</h2>
          </div>

          {/* Info Grid */}
          <div className='bg-[#F1F1F1] py-6 grid grid-cols-1 gap-y-2.5'>
            {basicInfo.map((item, index) => (
              <div key={index} className='flex max-md:flex-col md:gap-[20px]'>
                <div className='md:w-[50%] flex items-center ps-6 lg:ps-20 min-h-[40px] text-sm font-medium bg-[#FFFFFF]'>
                  {item.label}
                </div>
                <div className='md:w-[50%] flex items-center ps-6 lg:ps-20 min-h-[40px] text-sm bg-[#FFFFFF]'>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use InfoCertificates for certificates section */}
      {/*<InfoCertificates userId={sellerId} />*/}

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
    </>
  );
};

export default BPHome;
