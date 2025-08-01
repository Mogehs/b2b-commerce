"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Filter,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Building2,
  Eye,
  Calendar,
  Package,
} from "lucide-react";
import Loader from "@/app/components/common/Loader";

export default function SuppliersPage() {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filters, setFilters] = useState({
    region: "all",
    category: "all",
    service: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStores: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12,
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    services: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch stores data
  const fetchStores = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.region !== "all") params.append("region", filters.region);
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.service !== "all") params.append("service", filters.service);
      if (filters.search.trim()) params.append("search", filters.search.trim());

      const response = await axios.get(`/api/store/all?${params}`);
      console.log("API Response:", response.data);

      if (response.data.success) {
        setStores(response.data.data.stores);
        setPagination(response.data.data.pagination);
        setFilterOptions(response.data.data.filters);
      } else {
        toast.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get("service");

    if (serviceParam) {
      setFilters((prev) => ({ ...prev, service: serviceParam }));
    }

    fetchStores();
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get("service");

    if (serviceParam && serviceParam !== filters.service) {
      setFilters((prev) => ({ ...prev, service: serviceParam }));
      // Re-fetch stores with new service filter
      setTimeout(() => fetchStores(1), 100);
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchStores(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchStores(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle view store details
  const handleViewDetails = (ownerId) => {
    router.push(`/business-profile/${ownerId}`);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      region: "all",
      category: "all",
      service: "all",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setTimeout(() => fetchStores(1), 100);
  };

  // Store card component
  const StoreCard = ({ store, viewMode }) => {
    const isGridView = viewMode === "grid";

    return (
      <div
        className={`bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 ${
          isGridView ? "h-full" : "flex"
        }`}
      >
        {/* Store Banner/Image */}
        <div
          className={`${
            isGridView ? "h-40" : "w-40 flex-shrink-0"
          } bg-[#C9AF2F] relative`}
        >
          {store.bannerImage?.url ? (
            <img
              src={store.bannerImage.url}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white opacity-80" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white px-2 py-0.5 text-xs font-medium">
            {store.isVerified ? (
              <span className="text-green-600">✓ Verified</span>
            ) : (
              <span className="text-gray-600">Pending</span>
            )}
          </div>
        </div>

        {/* Store Details */}
        <div className={`p-3 ${isGridView ? "" : "flex-1"}`}>
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {store.name}
            </h3>
            <div className="flex items-center text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs text-gray-600 ml-1">4.5</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-1.5">{store.businessType}</p>

          <p className="text-xs text-gray-700 line-clamp-2 mb-2">
            {store.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600 mb-1.5">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {store.location?.formattedAddress || store.address}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center text-xs text-gray-600 mb-1.5">
            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>{store.phone}</span>
          </div>

          {/* Categories */}
          {store.productCategories && store.productCategories.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Package className="w-3 h-3 mr-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {store.productCategories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-1.5 py-0.5 text-[10px]"
                  >
                    {category}
                  </span>
                ))}
                {store.productCategories.length > 2 && (
                  <span className="text-gray-500 text-[10px]">
                    +{store.productCategories.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Branding Services */}
          {store.brandingServices && store.brandingServices.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <div className="w-3 h-3 mr-1 flex-shrink-0 text-[#C9AF2F]">★</div>
              <div className="flex flex-wrap gap-1">
                {store.brandingServices.slice(0, 2).map((service, index) => (
                  <span
                    key={index}
                    className="bg-[#C9AF2F] bg-opacity-10 text-black px-1.5 py-0.5 text-[10px] font-medium"
                  >
                    {service}
                  </span>
                ))}
                {store.brandingServices.length > 2 && (
                  <span className="text-[#C9AF2F] text-[10px] font-medium">
                    +{store.brandingServices.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => handleViewDetails(store.owner._id)}
            className="w-full bg-[#C9AF2F] hover:bg-[#B8A028] text-black py-1.5 px-3 text-xs transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Find Suppliers
          </h1>
          <p className="text-sm text-gray-600">
            Discover verified suppliers and their business profiles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-sm p-4 mb-5 border border-gray-200">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search suppliers, products, or business types..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 focus:ring-1 focus:ring-[#C9AF2F] focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-[#C9AF2F] hover:bg-[#B8A028] text-black px-5 py-1.5 text-sm transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">
                {pagination.totalStores} suppliers found
              </span>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${
                    viewMode === "grid"
                      ? "bg-[#C9AF2F] text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${
                    viewMode === "list"
                      ? "bg-[#C9AF2F] text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Region Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) =>
                      handleFilterChange("region", e.target.value)
                    }
                    className="w-full border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-[#C9AF2F] focus:border-transparent"
                  >
                    <option value="all">All Regions</option>
                    {filterOptions.regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-[#C9AF2F] focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Branding Service
                  </label>
                  <select
                    value={filters.service}
                    onChange={(e) =>
                      handleFilterChange("service", e.target.value)
                    }
                    className="w-full border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-[#C9AF2F] focus:border-transparent"
                  >
                    <option value="all">All Services</option>
                    {filterOptions.services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-[#C9AF2F] focus:border-transparent"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="yearEstablished">Established Year</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-[#C9AF2F] hover:bg-[#B8A028] text-black py-1.5 px-3 text-xs transition-colors duration-200"
                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 text-xs transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stores Grid/List */}
            {stores.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
                    : "space-y-3 mb-6"
                }
              >
                {stores.map((store) => (
                  <StoreCard
                    key={store._id}
                    store={store}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white border border-gray-200 shadow-sm">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1.5">
                  No suppliers found
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#C9AF2F] hover:bg-[#B8A028] text-black py-1.5 px-4 text-sm transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-1.5 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrentPage = pageNum === pagination.currentPage;

                  // Show only a few pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.currentPage - 2 &&
                      pageNum <= pagination.currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2.5 py-1.5 border text-xs ${
                          isCurrentPage
                            ? "bg-[#C9AF2F] text-white border-[#C9AF2F]"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === pagination.currentPage - 3 ||
                    pageNum === pagination.currentPage + 3
                  ) {
                    return (
                      <span key={pageNum} className="px-1.5 text-xs">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-1.5 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
