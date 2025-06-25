"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ApprovedSellersPage = ({ onChatWithSeller }) => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApprovedSellers();
  }, []);

  const fetchApprovedSellers = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/admin/approved-sellers");
      setSellers(response.data.sellers || []);
    } catch (error) {
      console.error("Error fetching approved sellers:", error);
      toast.error("Failed to fetch approved sellers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setIsDialogOpen(true);
  };

  const handleSuspendSeller = async (sellerId) => {
    try {
      await axios.patch(`/api/admin/sellers/${sellerId}/suspend`);
      toast.success("Seller suspended successfully");
      fetchApprovedSellers();
    } catch (error) {
      console.error("Error suspending seller:", error);
      toast.error("Failed to suspend seller");
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading approved sellers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approved Sellers</h2>
          <p className="text-gray-600 mt-1">
            Manage and communicate with approved sellers
          </p>
        </div>
        <Button
          onClick={fetchApprovedSellers}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sellers by name, business, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sellers Grid */}
      {filteredSellers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No approved sellers found</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {seller.applicationData?.businessName || "Unknown Business"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {seller.user?.name || "Unknown Seller"}
                  </p>
                  <p className="text-xs text-gray-500">{seller.user?.email}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {seller.applicationData?.category || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">
                    {seller.applicationData?.location?.address || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleViewDetails(seller)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  onClick={() => onChatWithSeller(seller)}
                  size="sm"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => handleSuspendSeller(seller._id)}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Suspend Seller
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seller Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected seller
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.applicationData?.businessName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Seller Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.user?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.applicationData?.category || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedSeller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSeller.applicationData?.location?.address || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSeller.applicationData?.description ||
                    "No description provided"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovedSellersPage;
