import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import KpiCard from '@/components/dashboard/KpiCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import RecentCustomers from '@/components/dashboard/RecentCustomers';
import TopProducts from '@/components/dashboard/TopProducts';
import SalesPipeline from '@/components/dashboard/SalesPipeline';
import SupportTickets from '@/components/dashboard/SupportTickets';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last30days');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your business performance</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative inline-block">
              <select 
                className="appearance-none inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 pr-8"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last90days">Last 90 days</option>
                <option value="thisyear">This Year</option>
              </select>
              <span className="material-icons absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-secondary text-white hover:bg-secondary/90">
              <span className="material-icons text-sm mr-1">download</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            title="Total Revenue" 
            value="₹24.5L" 
            change={12.5} 
            icon="payments" 
            color="blue" 
          />
          
          <KpiCard 
            title="Total Customers" 
            value="2,845" 
            change={5.2} 
            icon="people" 
            color="indigo" 
          />
          
          <KpiCard 
            title="Conversion Rate" 
            value="24.8%" 
            change={-1.7} 
            icon="autorenew" 
            color="purple" 
          />
          
          <KpiCard 
            title="Avg Order Value" 
            value="₹8,642" 
            change={3.8} 
            icon="shopping_cart" 
            color="amber" 
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueChart />
          <CategoryPieChart />
        </div>

        {/* Recent Customers & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentCustomers />
          <TopProducts />
        </div>
        
        {/* Sales Pipeline & Support Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <SalesPipeline />
          <SupportTickets />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
