"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const InfoCertificates = ({ userId, sellerId }) => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        // Use userId if provided, otherwise use sellerId
        const id = userId || sellerId;

        if (!id) {
          setError("No user ID provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/store/${id}`);
        setStoreData(response.data.store);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError(
          error.response?.data?.message || "Failed to load store information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [userId, sellerId]);

  if (loading) {
    return (
      <>
        <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ))}
          </div>
        </div>
        <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
          <Skeleton className="h-8 w-80 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="mt-5 bg-red-50 rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-xl font-medium text-red-700">
          Error Loading Store Information
        </h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="mt-5 bg-yellow-50 rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-xl font-medium text-yellow-700">
          Store Information Unavailable
        </h2>
        <p className="text-yellow-600 mt-2">
          No store information is available for this seller.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          {[
            ["Business Type", storeData.businessType || "Not specified"],
            [
              "Business Legal Status",
              storeData.businessLegalStatus || "Not specified",
            ],
            [
              "Year of Established",
              storeData.yearEstablished || "Not specified",
            ],
            ["Type Of Products", storeData.typeOfProducts || "Not specified"],
            [
              "Main Market",
              storeData.mainMarkets?.join(", ") || "Not specified",
            ],
            ["Yearly Revenue", storeData.yearlyRevenue || "Not specified"],
          ].map(([label, value], i) => (
            <div key={i} className="flex flex-col">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Registration And Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          {[
            [
              "National Tax Number",
              storeData.certifications?.nationalTaxNumber?.year ||
                "Not specified",
            ],
            [
              "Professional Tax",
              storeData.certifications?.professionalTax?.year ||
                "Not specified",
            ],
            [
              "ISO - 9001",
              storeData.certifications?.iso9001?.year || "Not specified",
            ],
            [
              "Chamber of Commerce",
              storeData.certifications?.chamberOfCommerce?.year ||
                "Not specified",
            ],
          ].map(([label, value], i) => (
            <div key={i} className="flex flex-col">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>

        {storeData.certifications?.otherCertifications?.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Other Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
              {storeData.certifications.otherCertifications.map((cert, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-gray-500 text-sm">{cert.name}</span>
                  <span className="text-gray-900 font-medium">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InfoCertificates;
