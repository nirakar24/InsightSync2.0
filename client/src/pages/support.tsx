import React from 'react';
import Layout from '@/components/layout/Layout';
import TicketList from '@/components/support/TicketList';

const Support: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and resolve customer support issues</p>
        </div>
        
        {/* Ticket List Component */}
        <TicketList />
      </div>
    </Layout>
  );
};

export default Support;
