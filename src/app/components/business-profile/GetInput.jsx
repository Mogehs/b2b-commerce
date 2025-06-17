"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function GetDealForm() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    deal: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-xl mx-auto p-6 my-10 bg-white shadow-lg rounded-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Get the best deals, Faster and Smarter
        </h2>
        <p className="text-gray-600 mt-2">
          Let us help you get the best deals quickly and efficiently. Fill the
          details below:
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product / Service Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product or service"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deal">Deal You Want</Label>
          <Textarea
            id="deal"
            name="deal"
            placeholder="Describe the deal you are looking for..."
            value={form.deal}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#C9AF2F] hover:bg-[#bfa425] text-white"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
