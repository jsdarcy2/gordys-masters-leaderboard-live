
import React from "react";
import Layout from "@/components/Layout";
import AdminPanel from "@/components/admin/AdminPanel";

const AdminPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-masters-green mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          This is a secure admin dashboard for pool administrators. 
          You can view and compare data from different sources to ensure synchronization.
        </p>
        
        <AdminPanel />
      </div>
    </Layout>
  );
};

export default AdminPage;
