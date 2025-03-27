import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Ticket {
  id: number;
  ticketId: string;
  customerId: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  name: string;
  companyName: string;
  avatar: string;
}

const SupportTickets: React.FC = () => {
  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  const isLoading = ticketsLoading || customersLoading;

  const getCustomerInfo = (customerId: number) => {
    return customers?.find(customer => customer.id === customerId);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1d ago' : `${interval}d ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1h ago' : `${interval}h ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1m ago' : `${interval}m ago`;
    }
    
    return 'just now';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-500';
      case 'in progress':
        return 'bg-amber-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-16 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-20 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-12 rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded animate-pulse mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-32 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-16 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Support Tickets</h3>
          <Link href="/support" className="text-sm text-secondary hover:text-secondary/80">
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {tickets?.slice(0, 4).map((ticket) => {
          const customer = getCustomerInfo(ticket.customerId);
          return (
            <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)} mr-2`}></span>
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{ticket.ticketId}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{getTimeAgo(ticket.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{ticket.title}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {customer && (
                    <>
                      <img
                        src={customer.avatar}
                        alt={`${customer.name} avatar`}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{customer.companyName}</span>
                    </>
                  )}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportTickets;
