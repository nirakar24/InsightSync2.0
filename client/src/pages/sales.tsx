import React from 'react';
import Layout from '@/components/layout/Layout';
import PipelineView from '@/components/sales/PipelineView';

const Sales: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track and manage your sales opportunities</p>
        </div>
        
        {/* Pipeline View Component */}
        <PipelineView />
      </div>
    </Layout>
  );
};

export default Sales;
