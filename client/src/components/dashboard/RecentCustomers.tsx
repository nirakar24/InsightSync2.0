import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Customer {
  id: number;
  name: string;
  companyName: string;
  totalSpent: string;
  status: string;
  avatar: string;
}

const RecentCustomers: React.FC = () => {
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ['/api/dashboard/recent-customers'],
  });

  const formatCurrency = (amount: string) => {
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-16 rounded animate-pulse"></div>
          </div>
        </div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-2/3 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-1/2 rounded animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-20 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-12 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Customers</h3>
          <Link href="/customers" className="text-sm text-secondary hover:text-secondary/80">
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {customers?.map((customer) => (
          <div key={customer.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <img
              src={customer.avatar}
              alt={`${customer.name} avatar`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {customer.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {customer.companyName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatCurrency(customer.totalSpent)}
              </p>
              <p className={getStatusColor(customer.status)}>
                {customer.status === 'active' ? 'Paid' : customer.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCustomers;
