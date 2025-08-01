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
      <div className="space-y-8">
        <div className="bg-white rounded-2xl max-w-6xl mx-auto shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl max-w-6xl mx-auto shadow-lg border border-red-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-800 mb-2">
            Error Loading Store Information
          </h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl max-w-6xl mx-auto shadow-lg border border-amber-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-amber-800 mb-2">
            Store Information Unavailable
          </h2>
          <p className="text-amber-700">
            No store information is available for this seller.
          </p>
        </div>
      </div>
    );
  }

  // Prepare certificate information
  const CertificateInfo = {
    certificates: [
      {
        label: "National Tax Number",
        value:
          storeData.certifications?.nationalTaxNumber?.year || "Not specified",
      },
      {
        label: "Professional Tax",
        value:
          storeData.certifications?.professionalTax?.year || "Not specified",
      },
      {
        label: "ISO - 9001",
        value: storeData.certifications?.iso9001?.year || "Not specified",
      },
      {
        label: "Chamber of Commerce",
        value:
          storeData.certifications?.chamberOfCommerce?.year || "Not specified",
      },
    ],
    images: storeData.certifications?.certificateImages || [],
  };

  return (
    <div className="bg-[#F1F1F1]">
      <div className="space-y-8 max-w-6xl mx-auto ">
        {/* Certificates Section */}

        <div className="p-0 bg-white">
          <div className="px-4 md:px-6 h-[70px] flex items-center mb-1 rounded-t-lg shadow-sm">
            <h2 className="text-xl tracking-wide font-bold text-gray-800">
              Certificates
            </h2>
          </div>

          {/* Certificate Information */}
          <div className="bg-[#F1F1F1] py-4 grid grid-cols-1 gap-y-1.5">
            {CertificateInfo.certificates.map((item, index) => (
              <div key={index} className="flex max-md:flex-col md:gap-[20px]">
                <div className="md:w-[50%] flex items-center ps-6 lg:ps-20 min-h-[40px] text-[14px] font-medium bg-[#FFFFFF]">
                  {item.label}
                </div>
                <div className="md:w-[50%] flex items-center ps-6 lg:ps-20 min-h-[40px] text-[14px] bg-[#FFFFFF]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Images */}
          {CertificateInfo.images.length > 0 && (
            <div className="bg-[#F1F1F1] py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
              {CertificateInfo.images.map((item, index) => (
                <div key={index} className="overflow-hidden">
                  <img
                    src={item.url}
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCertificates;
