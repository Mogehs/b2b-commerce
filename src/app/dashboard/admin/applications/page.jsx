import Applications from "@/app/components/admin-dashboard/Applications";
import ApprovedSellersPage from "@/app/components/admin-dashboard/ApprovedSellersPage";

import Navbar from "@/app/components/common/Navbar";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <Applications />
      <ApprovedSellersPage/>
    </div>
  );
};

export default AdminDashboard;
