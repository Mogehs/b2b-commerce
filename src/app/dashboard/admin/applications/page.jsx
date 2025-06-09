import Applications from "@/app/components/admin-dashboard/Applications";
import Navbar from "@/app/components/common/Navbar";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <Applications />
    </div>
  );
};

export default AdminDashboard;
