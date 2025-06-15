"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function StoreSeedScript() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  
  const seedStoreData = async () => {
    if (!session?.user || session?.user.role !== "admin") {
      toast.error("You must be an admin to run this script");
      return;
    }
    
    try {
      setLoading(true);
      
      // Sample data for updating stores
      const storeUpdates = {
        businessLegalStatus: "Sole Proprietor",
        yearEstablished: "2015",
        typeOfProducts: "Electronics, Home Appliances, Mobile Accessories",
        mainMarkets: ["USA", "UK", "Pakistan", "UAE", "Saudi Arabia"],
        yearlyRevenue: "500,000/- USD",
        certifications: {
          nationalTaxNumber: { type: "NTN-12345", year: "2019" },
          professionalTax: { type: "PT-98765", year: "2020" },
          iso9001: { type: "ISO9001-2021", year: "2021" },
          chamberOfCommerce: { type: "CC-54321", year: "2018" },
          otherCertifications: [
            {
              name: "FDA Approval",
              year: "2022",
              documentUrl: "/certifications/fda.pdf"
            }
          ]
        }
      };
      
      // This would be a protected API route in production
      const response = await axios.post("/api/admin/seed-stores", storeUpdates);
      
      if (response.data.success) {
        toast.success(`Updated ${response.data.count} stores successfully!`);
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.error("Error seeding store data:", error);
      toast.error(error.response?.data?.message || "Failed to seed store data");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Store Data Seed Script</h1>
      <p className="text-gray-600 mb-6">
        This script will update all existing stores with certification and business information
        for testing purposes. Only admins can run this script.
      </p>
      
      <Button
        onClick={seedStoreData}
        disabled={loading || !session?.user || session?.user.role !== "admin"}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Updating..." : "Update Store Data"}
      </Button>
      
      {(!session?.user || session?.user.role !== "admin") && (
        <p className="mt-4 text-red-500">
          Note: You must be logged in as an admin to use this tool.
        </p>
      )}
    </div>
  );
}
