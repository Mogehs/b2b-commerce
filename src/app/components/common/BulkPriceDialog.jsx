// components/common/BulkPriceDialog.jsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

const BulkPriceDialog = ({ product }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user) {
      toast.error("Please log in to request a quote");
      router.push("/log-in");
      return;
    }

    if (!quantity || parseInt(quantity) < product.minOrderQuantity) {
      toast.error(`Minimum order quantity is ${product.minOrderQuantity}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/rfq", {
        productId: product._id,
        sellerId: product.seller?._id,
        quantity,
        message,
      });

      toast.success("Quote requested successfully!");
      setOpen(false);
      setQuantity("");
      setMessage("");

      setTimeout(() => {
        router.push(
          `/dashboard/buyer/chat?conversationId=${res.data.conversationId}`
        );
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 text-sm rounded-md">
          Get Bulk Price
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Get Bulk Price Quote</DialogTitle>
          <DialogDescription>
            Fill in your details and required quantity. The seller will respond
            shortly.
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
              min={product.minOrderQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Minimum ${product.minOrderQuantity}`}
              disabled={submitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write any specific requirements..."
              disabled={submitting}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-200 text-gray-800"
              disabled={submitting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-[#C9AF2F] text-black"
            onClick={handleSubmit}
            disabled={submitting || !session?.user}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPriceDialog;
