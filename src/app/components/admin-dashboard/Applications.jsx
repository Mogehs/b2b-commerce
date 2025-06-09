"use client";

import Link from "next/link";

const mockApplications = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    company: "JD Enterprises",
    status: "Pending",
    submittedAt: "2025-06-09",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "JS Traders",
    status: "Approved",
    submittedAt: "2025-06-08",
  },
];

export default function Applications() {
  return (
    <div className="min-h-screen bg-[#F1F1F1] p-6">
      <h1 className="text-2xl font-bold text-[#000000] mb-4">Seller Applications</h1>
      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#C9AF2F] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-nowrap">Name</th>
              <th className="px-6 py-3 text-left text-nowrap">Email</th>
              <th className="px-6 py-3 text-left text-nowrap">Company</th>
              <th className="px-6 py-3 text-left text-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-nowrap">Submitted</th>
              <th className="px-6 py-3 text-left text-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[#000000]">
            {mockApplications.map((app) => (
              <tr key={app.id} className="border-b border-[#ACAAAA] hover:bg-[#F1F1F1]">
                <td className="px-6 py-4 text-nowrap">{app.name}</td>
                <td className="px-6 py-4 text-nowrap">{app.email}</td>
                <td className="px-6 py-4 text-nowrap">{app.company}</td>
                <td className="px-6 py-4 text-nowrap">{app.status}</td>
                <td className="px-6 py-4 text-nowrap">{app.submittedAt}</td>
                <td className="px-6 py-4 text-nowrap">
                  <Link href={`/dashboard/admin/applications/${app.id}`}>
                    <button className="bg-[#C9AF2F] text-white px-4 py-1 rounded hover:bg-[#b89d2c]">
                      View Detail
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

