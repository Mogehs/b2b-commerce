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
        <div className="bg-white rounded-2xl max-w-6xl mx-auto shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <Skeleton className="h-8 w-80" />
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
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

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white rounded-2xl max-w-6xl mx-auto shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-[#C9AF2F]/10 to-[#B8A028]/10 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Basic Information
            </h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div
                key={i}
                className="group p-4 rounded-xl bg-gray-50/50 hover:bg-[#C9AF2F]/5 transition-all duration-200 border border-gray-100 hover:border-[#C9AF2F]/20"
              >
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wide block mb-2">
                  {label}
                </span>
                <span className="text-gray-900 font-semibold text-lg group-hover:text-[#C9AF2F] transition-colors duration-200">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration And Certifications Section */}
      <div className="bg-white rounded-2xl max-w-6xl mx-auto shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-[#C9AF2F]/15 to-[#B8A028]/15 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Registration And Certifications
            </h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div
                key={i}
                className="group p-4 rounded-xl bg-gray-50/50 hover:bg-[#C9AF2F]/5 transition-all duration-200 border border-gray-100 hover:border-[#C9AF2F]/20"
              >
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wide block mb-2">
                  {label}
                </span>
                <span className="text-gray-900 font-semibold text-lg group-hover:text-[#C9AF2F] transition-colors duration-200">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {storeData.certifications?.otherCertifications?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#C9AF2F] to-[#B8A028] rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Other Certifications
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storeData.certifications.otherCertifications.map((cert, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-xl bg-[#C9AF2F]/5 hover:bg-[#C9AF2F]/10 transition-all duration-200 border border-[#C9AF2F]/20 hover:border-[#C9AF2F]/30"
                  >
                    <span className="text-[#C9AF2F] text-sm font-medium uppercase tracking-wide block mb-2">
                      {cert.name}
                    </span>
                    <span className="text-gray-900 font-semibold text-lg group-hover:text-[#B8A028] transition-colors duration-200">
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCertificates;
