"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const SeedSellersPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSeedSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/admin/seed-approved-sellers");
      toast.success("Sample sellers created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error seeding sellers:", error);
      toast.error("Failed to create sample sellers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Seed Sample Data
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to create sample approved sellers for testing
          the admin dashboard.
        </p>
        <Button
          onClick={handleSeedSellers}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating Sellers..." : "Create Sample Sellers"}
        </Button>
      </div>
    </div>
  );
};

export default SeedSellersPage;
