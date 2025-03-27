import React from 'react';
import Layout from '@/components/layout/Layout';
import CustomerList from '@/components/customers/CustomerList';

const Customers: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Management</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage your customer relationships</p>
        </div>
        
        {/* Customer List Component */}
        <CustomerList />
      </div>
    </Layout>
  );
};

export default Customers;
