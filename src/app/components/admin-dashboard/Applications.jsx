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
import { Loader2 } from "lucide-react";
export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState(null);

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

    if (!appClone.documents) {
      appClone.documents = [];
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
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={statusStyles[status] || "bg-gray-200"}>
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
      <h1 className="text-2xl font-bold mb-4">Seller Applications</h1>
      <div className="bg-white shadow rounded overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#C9AF2F]" />
            <p className="mt-2">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-6 text-center">No applications found</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-[#C9AF2F] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Business Name</th>
                <th className="px-6 py-3 text-left">Business Type</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Documents</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">{app.documents?.length || 0}</td>
                  <td className="px-6 py-4">
                    <Button
                      className="bg-[#C9AF2F] hover:bg-[#b89d2c] text-white"
                      onClick={() => handleViewDetail(app)}
                    >
                      {processingId === app._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Custom Dialog Implementation */}
      {selectedApp && isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 overflow-auto bg-white/30 bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-[98%] bg-white rounded-lg shadow-xl flex flex-col">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-lg">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedApp.applicationData?.businessName ||
                    "Business Application"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted: {formatDate(selectedApp.createdAt)}{" "}
                  {selectedApp.submissionCount > 1 &&
                    `(Submission ${selectedApp.submissionCount})`}
                </p>
              </div>

              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full hover:bg-gray-200 p-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
                    )}

                  {/* Documents */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Documents ({selectedApp.documents?.length || 0})
                      </h3>
                    </div>
                    <div className="p-4">
                      {selectedApp.documents?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No documents uploaded
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedApp.documents.map((doc, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-md p-3 bg-gray-50"
                            >
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-gray-500 mb-2">
                                {doc.type}
                              </p>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <polyline points="15 3 21 3 21 9"></polyline>
                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                View Document
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Section */}
              <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Admin Actions
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="adminNotes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Admin Notes
                      </label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={5}
                        placeholder="Enter admin notes or reasons for approval/rejection"
                        className="w-full resize-y min-h-[150px] border-gray-300 rounded-md"
                      />
                    </div>

                    {selectedApp.reason && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Previous Rejection Reason
                        </h4>
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-red-800">{selectedApp.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex flex-wrap justify-between gap-4">
              <div className="space-x-3">
                {selectedApp.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleStatusChange(selectedApp._id, "rejected")
                      }
                      disabled={processingId === selectedApp._id}
                      className="text-base px-6 py-2"
                    >
                      {processingId === selectedApp._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Reject"
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusChange(selectedApp._id, "approved")
                      }
                      disabled={processingId === selectedApp._id}
                      className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-2"
                    >
                      {processingId === selectedApp._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  </>
                )}
              </div>

              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="ml-auto text-base px-6 py-2"
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
