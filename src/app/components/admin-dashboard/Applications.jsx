"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Filter, RefreshCw, Eye } from "lucide-react";

// Add animation styles
const fadeIn = {
  animation: "fadeIn 0.3s ease-in-out",
};

const slideIn = {
  animation: "slideIn 0.3s ease-out",
};

// CSS keyframes as a style tag to be inserted in the component
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/applications");
        if (res.data.success) {
          setApplications(res.data.applications);
        } else {
          throw new Error(res.data.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load seller applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);
  const handleViewDetail = (app) => {
    // Clone the application object to avoid reference issues
    const appClone = JSON.parse(JSON.stringify(app));

    // Ensure all required nested objects exist to prevent errors
    if (!appClone.applicationData) {
      appClone.applicationData = {};
    }

    setSelectedApp(appClone);
    setAdminNotes(appClone.adminNotes || "");
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (id, status) => {
    if (!adminNotes && status === "rejected") {
      toast.error("Please provide reason for rejection in Admin Notes");
      return;
    }

    setProcessingId(id);
    try {
      const res = await axios.put(`/api/applications/${id}/status`, {
        status,
        adminNotes,
      });

      if (res.data.success) {
        toast.success(`Application ${status}`);
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status, adminNotes } : app
          )
        );
        setIsDialogOpen(false);
      } else {
        throw new Error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update application status");
    } finally {
      setProcessingId(null);
    }
  };
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-amber-100 text-amber-800 border border-amber-200 shadow-sm",
      approved:
        "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm",
      rejected: "bg-rose-100 text-rose-800 border border-rose-200 shadow-sm",
    };

    const statusIcons = {
      pending: (
        <div className="w-2 h-2 bg-amber-400 rounded-full mr-1.5 animate-pulse"></div>
      ),
      approved: (
        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
      ),
      rejected: <div className="w-2 h-2 bg-rose-500 rounded-full mr-1.5"></div>,
    };

    return (
      <Badge
        className={`${
          statusStyles[status] || "bg-gray-200"
        } px-2.5 py-1 flex items-center`}
      >
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="min-h-screen bg-[#F1F1F1] p-6">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Seller Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Review and manage seller applications
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge className="bg-[#C9AF2F] text-white px-3 py-1.5 text-xs font-semibold">
            {applications.filter((app) => app.status === "pending").length}{" "}
            Pending Review
          </Badge>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#C9AF2F] border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">
              Loading applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path d="M14 2v6h6"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
                <path d="M10 9H8"></path>
              </svg>
            </div>
            <p className="text-lg text-gray-600 font-medium">
              No applications found
            </p>
          </div>
        ) : (
          <div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 800);
                  }}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-[#C9AF2F] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Business Name</th>
                  <th className="px-6 py-3 text-left">Business Type</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Submitted</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>{" "}
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-50 transition-all duration-150 hover:shadow-sm"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {app.applicationData?.businessName || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {app.applicationData?.businessType || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {app.applicationData?.location?.formattedAddress?.split(
                        ","
                      )[0] ||
                        app.applicationData?.businessAddress?.split(",")[0] ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4">
                      {" "}
                      <Button
                        className="bg-[#C9AF2F] hover:bg-[#b89d2c] text-white flex items-center transition-all duration-200 hover:scale-105 hover:shadow-md shadow-sm"
                        onClick={() => handleViewDetail(app)}
                      >
                        {processingId === app._id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>{" "}
      {/* Custom Dialog Implementation */}
      {selectedApp && isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 overflow-auto bg-black/50 backdrop-blur-sm overflow-y-auto"
          style={fadeIn}
        >
          <div
            className="relative w-full max-w-[95%] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200"
            style={slideIn}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b bg-gradient-to-r from-[#C9AF2F]/10 to-transparent rounded-t-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApp.applicationData?.businessName ||
                      "Business Application"}
                  </h2>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Submitted: {formatDate(selectedApp.createdAt)}{" "}
                  {selectedApp.submissionCount > 1 &&
                    `(Submission ${selectedApp.submissionCount})`}
                </p>
              </div>

              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full hover:bg-gray-200 p-2 transition-colors"
                aria-label="Close dialog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Left Column: Business Information */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Business Information
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Business Name</p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Business Type</p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessType || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="mt-1">
                          {selectedApp.applicationData?.businessDescription ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Service Radius
                          </p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.serviceRadius ||
                              "N/A"}{" "}
                            km
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Landmark</p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.landmark || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Contact Information
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="mt-1">
                          {selectedApp.applicationData?.businessAddress ||
                            selectedApp.applicationData?.location
                              ?.formattedAddress ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessPhone ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessEmail ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium text-blue-600">
                          {selectedApp.applicationData?.businessWebsite ? (
                            <a
                              href={selectedApp.applicationData.businessWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {selectedApp.applicationData.businessWebsite}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Additional Information */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Categories & Offers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedApp.applicationData?.productCategories?.length >
                      0 && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Product Categories
                          </h3>
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.applicationData.productCategories.map(
                              (category, i) => (
                                <Badge
                                  key={i}
                                  className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1"
                                >
                                  {category}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedApp.applicationData?.offers && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Special Offers
                          </h3>
                        </div>
                        <div className="p-4">
                          <p>{selectedApp.applicationData.offers}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Social Media */}
                  {selectedApp.applicationData?.socialMedia &&
                    Object.values(selectedApp.applicationData.socialMedia).some(
                      (val) => val
                    ) && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Social Media
                          </h3>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(
                              selectedApp.applicationData.socialMedia
                            ).map(([platform, link], i) =>
                              link ? (
                                <div key={i} className="flex items-center">
                                  <span className="font-medium capitalize mr-2">
                                    {platform}:
                                  </span>
                                  <span className="text-blue-600 truncate">
                                    {link}
                                  </span>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    )}{" "}
                  {/* Additional Information Card */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Additional Information
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Business Email
                          </p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessEmail ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Business Phone
                          </p>
                          <p className="font-medium">
                            {selectedApp.applicationData?.businessPhone ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Application ID</p>
                        <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 border border-gray-200">
                          {selectedApp._id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Admin Section */}
              <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gradient-to-r from-[#C9AF2F]/10 to-transparent px-4 py-3 border-b border-gray-200 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#C9AF2F]"
                      >
                        <path d="m16 6 4 14"></path>
                        <path d="M12 6v14"></path>
                        <path d="M8 8v12"></path>
                        <path d="M4 4v16"></path>
                      </svg>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Admin Review
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Current Status:
                      </span>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="adminNotes"
                        className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <path d="M14 2v6h6"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                          <path d="M10 9H8"></path>
                        </svg>
                        Admin Notes{" "}
                        {selectedApp.status === "pending" && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={5}
                        placeholder="Enter admin notes or reasons for approval/rejection"
                        className="w-full resize-y min-h-[150px] rounded-md border-gray-200 focus:border-[#C9AF2F] focus:ring focus:ring-[#C9AF2F] focus:ring-opacity-20"
                      />
                      {selectedApp.status === "pending" && (
                        <p className="text-xs text-gray-500 mt-1.5">
                          Required for rejection
                        </p>
                      )}
                    </div>

                    {selectedApp.reason && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Previous Rejection Reason
                        </h4>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-red-800">{selectedApp.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-8 py-5 border-t bg-gray-50 rounded-b-xl flex flex-wrap justify-between gap-4">
              <div className="space-x-3">
                {selectedApp.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedApp._id, "rejected")
                      }
                      disabled={processingId === selectedApp._id}
                      className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-base px-6 py-2.5 shadow-sm transition-all duration-200"
                    >
                      {processingId === selectedApp._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1.5"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          Reject Application
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusChange(selectedApp._id, "approved")
                      }
                      disabled={processingId === selectedApp._id}
                      className="bg-[#C9AF2F] hover:bg-[#b89d2c] text-white text-base px-7 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {processingId === selectedApp._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1.5"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                          Approve Application
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="ml-auto text-base px-6 py-2.5 border-gray-200 hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
