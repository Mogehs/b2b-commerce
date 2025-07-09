"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  PencilLine,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
  Building,
  Briefcase,
  DollarSign,
  Tag,
  ShoppingBag,
  Award,
  FileCheck,
  Save,
  Plus,
} from "lucide-react";

const StoreProfile = () => {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch the store profile data
  useEffect(() => {
    const fetchStoreProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/seller/store-profile");
        if (response.data.success) {
          setStore(response.data.store);
        } else {
          toast.error("Failed to load store profile");
        }
      } catch (error) {
        console.error("Error fetching store profile:", error);
        toast.error("Error loading store profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Handle branding services (multiple checkbox values)
      const brandingServices = formData.getAll("brandingServices");

      // Handle nested fields for social links
      const socialLinks = {
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        twitter: data.twitter || "",
        linkedin: data.linkedin || "",
      }; // Handle nested fields for certifications
      const certifications = {
        nationalTaxNumber: {
          certType: data.nationalTaxNumber || "",
          year: data.nationalTaxYear || "",
        },
        professionalTax: {
          certType: data.professionalTax || "",
          year: data.professionalTaxYear || "",
        },
        iso9001: {
          certType: data.iso9001 || "",
          year: data.iso9001Year || "",
        },
        chamberOfCommerce: {
          certType: data.chamberOfCommerce || "",
          year: data.chamberOfCommerceYear || "",
        },
        // Preserve any existing otherCertifications
        otherCertifications: store.certifications?.otherCertifications || [],
      };

      // Remove individual fields that are now in nested objects
      delete data.facebook;
      delete data.instagram;
      delete data.twitter;
      delete data.linkedin;
      delete data.nationalTaxNumber;
      delete data.nationalTaxYear;
      delete data.professionalTax;
      delete data.professionalTaxYear;
      delete data.iso9001;
      delete data.iso9001Year;
      delete data.chamberOfCommerce;
      delete data.chamberOfCommerceYear;

      // Add nested objects to the data
      data.socialLinks = socialLinks;
      data.certifications = certifications;
      data.brandingServices = brandingServices;

      const response = await axios.put("/api/seller/store-profile", data);
      if (response.data.success) {
        setStore(response.data.store);
        setIsEditMode(false);
        toast.success("Store profile updated successfully");
      } else {
        toast.error("Failed to update store profile");
      }
    } catch (error) {
      console.error("Error updating store profile:", error);
      toast.error("Error updating store profile");
    }
  };

  // Simple loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Loading store profile...</p>
      </div>
    );
  }

  // No store found state
  if (!store) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm text-center">
        <Store className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium mb-2">No Store Profile Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You don't have an active store profile yet.
        </p>
        <Button variant="default">Apply to Become a Seller</Button>
      </div>
    );
  }

  // Edit mode view (simple form)
  if (isEditMode) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit Store Profile</h2>
          <Button variant="outline" onClick={() => setIsEditMode(false)}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Store size={20} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Store Name
                </label>
                <input
                  name="name"
                  defaultValue={store.name}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Business Type
                </label>
                <input
                  name="businessType"
                  defaultValue={store.businessType}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={store.description}
                  className="w-full p-2 border rounded min-h-[100px]"
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Business Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Briefcase size={20} /> Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Business Legal Status
                </label>
                <input
                  name="businessLegalStatus"
                  defaultValue={store.businessLegalStatus}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Year Established
                </label>
                <input
                  name="yearEstablished"
                  defaultValue={store.yearEstablished}
                  className="w-full p-2 border rounded"
                  type="number"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Type of Products
                </label>
                <input
                  name="typeOfProducts"
                  defaultValue={store.typeOfProducts}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Yearly Revenue
                </label>
                <input
                  name="yearlyRevenue"
                  defaultValue={store.yearlyRevenue}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Branding Services
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3 border rounded">
                  {[
                    "Low MOQ",
                    "OEM Services",
                    "Private Labeling",
                    "Ready to Ship",
                  ].map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="brandingServices"
                        value={service}
                        defaultChecked={store.brandingServices?.includes(
                          service
                        )}
                        className="w-4 h-4 text-[#C9AF2F] bg-gray-100 border-gray-300 rounded focus:ring-[#C9AF2F] focus:ring-2"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Phone size={20} /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  name="email"
                  defaultValue={store.email}
                  className="w-full p-2 border rounded"
                  type="email"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  defaultValue={store.phone}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Website
                </label>
                <input
                  name="website"
                  defaultValue={store.website}
                  className="w-full p-2 border rounded"
                  type="url"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Address
                </label>
                <input
                  name="address"
                  defaultValue={store.address}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Landmark
                </label>
                <input
                  name="landmark"
                  defaultValue={store.landmark}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          {/* Certifications */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Award size={20} /> Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  National Tax Number (NTN)
                </label>
                <input
                  name="nationalTaxNumber"
                  defaultValue={
                    store.certifications?.nationalTaxNumber?.certType || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Certificate number or ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  NTN Year
                </label>
                <input
                  name="nationalTaxYear"
                  defaultValue={
                    store.certifications?.nationalTaxNumber?.year || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Year issued"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Professional Tax
                </label>
                <input
                  name="professionalTax"
                  defaultValue={
                    store.certifications?.professionalTax?.certType || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Certificate number or ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Professional Tax Year
                </label>
                <input
                  name="professionalTaxYear"
                  defaultValue={
                    store.certifications?.professionalTax?.year || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Year issued"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  ISO 9001
                </label>
                <input
                  name="iso9001"
                  defaultValue={store.certifications?.iso9001?.certType || ""}
                  className="w-full p-2 border rounded"
                  placeholder="Certificate number or ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  ISO 9001 Year
                </label>
                <input
                  name="iso9001Year"
                  defaultValue={store.certifications?.iso9001?.year || ""}
                  className="w-full p-2 border rounded"
                  placeholder="Year issued"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Chamber of Commerce
                </label>
                <input
                  name="chamberOfCommerce"
                  defaultValue={
                    store.certifications?.chamberOfCommerce?.certType || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Certificate number or ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Chamber of Commerce Year
                </label>
                <input
                  name="chamberOfCommerceYear"
                  defaultValue={
                    store.certifications?.chamberOfCommerce?.year || ""
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Year issued"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Other Certifications Section */}
            {store.certifications?.otherCertifications?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium mb-3">
                  Other Certifications
                </h4>
                <div className="space-y-3">
                  {store.certifications.otherCertifications.map(
                    (cert, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{cert.name}</span>
                          <span className="text-sm text-gray-500">
                            Year: {cert.year}
                          </span>
                        </div>
                        {cert.documentUrl && (
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileCheck size={14} />
                            View document
                          </a>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Social Media */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Globe size={20} /> Social Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Facebook
                </label>
                <input
                  name="facebook"
                  defaultValue={store.socialLinks?.facebook}
                  className="w-full p-2 border rounded"
                  type="url"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Instagram
                </label>
                <input
                  name="instagram"
                  defaultValue={store.socialLinks?.instagram}
                  className="w-full p-2 border rounded"
                  type="url"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Twitter
                </label>
                <input
                  name="twitter"
                  defaultValue={store.socialLinks?.twitter}
                  className="w-full p-2 border rounded"
                  type="url"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  LinkedIn
                </label>
                <input
                  name="linkedin"
                  defaultValue={store.socialLinks?.linkedin}
                  className="w-full p-2 border rounded"
                  type="url"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex items-center gap-2"
            >
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // View mode (simple display)
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold">{store.name}</h2>
        </div>
        <Button
          onClick={() => setIsEditMode(true)}
          variant="default"
          className="flex items-center gap-2"
        >
          <PencilLine size={16} /> Edit Profile
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* Basic Info */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Store size={18} /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p>{store.businessType || "Not specified"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p>{store.description}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Business Details */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Briefcase size={18} /> Business Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Business Legal Status</p>
            <p>{store.businessLegalStatus || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Year Established</p>
            <p>{store.yearEstablished || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type of Products</p>
            <p>{store.typeOfProducts || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Yearly Revenue</p>
            <p>{store.yearlyRevenue || "Not specified"}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Phone size={18} /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{store.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{store.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Website</p>
            {store.website ? (
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {store.website}
              </a>
            ) : (
              <p>Not specified</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p>{store.address}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />
      {/* Certifications */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Award size={18} /> Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              National Tax Number
            </p>
            <div className="mt-1 flex items-center">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />{" "}
              <p className="text-md">
                {store.certifications?.nationalTaxNumber?.certType ||
                  "Not specified"}
              </p>
            </div>
            {store.certifications?.nationalTaxNumber?.year && (
              <p className="text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                Issued: {store.certifications.nationalTaxNumber.year}
              </p>
            )}
          </div>

          <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Professional Tax
            </p>
            <div className="mt-1 flex items-center">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />
              <p className="text-md">
                {store.certifications?.professionalTax?.certType ||
                  "Not specified"}
              </p>
            </div>
            {store.certifications?.professionalTax?.year && (
              <p className="text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                Issued: {store.certifications.professionalTax.year}
              </p>
            )}
          </div>

          <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ISO 9001
            </p>
            <div className="mt-1 flex items-center">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />
              <p className="text-md">
                {store.certifications?.iso9001?.certType || "Not specified"}
              </p>
            </div>
            {store.certifications?.iso9001?.year && (
              <p className="text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                Issued: {store.certifications.iso9001.year}
              </p>
            )}
          </div>

          <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Chamber of Commerce
            </p>
            <div className="mt-1 flex items-center">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />
              <p className="text-md">
                {" "}
                {store.certifications?.chamberOfCommerce?.certType ||
                  "Not specified"}
              </p>
            </div>
            {store.certifications?.chamberOfCommerce?.year && (
              <p className="text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                Issued: {store.certifications.chamberOfCommerce.year}
              </p>
            )}
          </div>
        </div>

        {/* Other Certifications */}
        {store.certifications?.otherCertifications &&
          store.certifications.otherCertifications.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Other Certifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.certifications.otherCertifications.map((cert, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cert.name}
                    </p>
                    <div className="mt-1 flex items-center">
                      <FileCheck className="h-4 w-4 text-green-600 mr-2" />
                      {cert.documentUrl ? (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Certificate
                        </a>
                      ) : (
                        <p className="text-md">Verified</p>
                      )}
                    </div>
                    {cert.year && (
                      <p className="text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Issued: {cert.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      <Separator className="my-6" />

      {/* Branding Services */}
      {store.brandingServices && store.brandingServices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <div className="w-5 h-5 text-[#C9AF2F]">⭐</div>
            Branding Services
          </h3>
          <div className="flex flex-wrap gap-2">
            {store.brandingServices.map((service, index) => (
              <span
                key={index}
                className="bg-[#C9AF2F] bg-opacity-10 text-[#C9AF2F] px-3 py-2 rounded-lg text-sm font-medium border border-[#C9AF2F] border-opacity-20"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      {/* Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Phone size={18} /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{store.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{store.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Website</p>
            {store.website ? (
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {store.website}
              </a>
            ) : (
              <p>Not specified</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p>{store.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;
