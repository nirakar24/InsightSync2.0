import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Deal {
  id: number;
  customerId: number;
  companyName: string;
  title: string;
  stage: string;
  value: string;
  probability: number;
  createdAt: string;
  updatedAt: string;
}

const SalesPipeline: React.FC = () => {
  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
  });

  const formatCurrency = (amount: string) => {
    const numValue = parseFloat(amount);
    if (numValue >= 1000000) {
      return `₹${(numValue / 100000).toFixed(2)}L`;
    }
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'lead':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'qualified':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300';
      case 'proposal':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'closed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300';
    }
  };

  // Calculate stage values
  const stageValues = {
    lead: 0,
    qualified: 0,
    proposal: 0,
    closed: 0
  };

  deals?.forEach(deal => {
    const value = parseFloat(deal.value);
    if (deal.stage === 'lead') stageValues.lead += value;
    else if (deal.stage === 'qualified') stageValues.qualified += value;
    else if (deal.stage === 'proposal') stageValues.proposal += value;
    else if (deal.stage === 'closed') stageValues.closed += value;
  });

  if (isLoading) {
    return (
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-20 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded animate-pulse mb-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 w-full rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Company</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Stage</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Value</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Probability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[...Array(4)].map((_, index) => (
                <tr key={index}>
                  <td className="py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 w-32 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 w-20 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 w-24 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Sales Pipeline</h3>
          <Link href="/sales" className="text-sm text-secondary hover:text-secondary/80">
            View Details
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          {/* Lead */}
          <div className="mb-4 sm:mb-0 flex-1">
            <div className="flex items-center">
              <div className="text-xs font-medium text-slate-900 dark:text-white">Lead</div>
              <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatCurrency(stageValues.lead.toString())}
              </div>
            </div>
            <div className="mt-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stageValues.lead / (stageValues.lead + stageValues.qualified + stageValues.proposal + stageValues.closed)) * 100)}%` }}>
              </div>
            </div>
          </div>

          {/* Qualified */}
          <div className="mb-4 sm:mb-0 flex-1 sm:mx-4">
            <div className="flex items-center">
              <div className="text-xs font-medium text-slate-900 dark:text-white">Qualified</div>
              <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatCurrency(stageValues.qualified.toString())}
              </div>
            </div>
            <div className="mt-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stageValues.qualified / (stageValues.lead + stageValues.qualified + stageValues.proposal + stageValues.closed)) * 100)}%` }}>
              </div>
            </div>
          </div>

          {/* Proposal */}
          <div className="mb-4 sm:mb-0 flex-1">
            <div className="flex items-center">
              <div className="text-xs font-medium text-slate-900 dark:text-white">Proposal</div>
              <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatCurrency(stageValues.proposal.toString())}
              </div>
            </div>
            <div className="mt-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stageValues.proposal / (stageValues.lead + stageValues.qualified + stageValues.proposal + stageValues.closed)) * 100)}%` }}>
              </div>
            </div>
          </div>

          {/* Closed */}
          <div className="flex-1 sm:ml-4">
            <div className="flex items-center">
              <div className="text-xs font-medium text-slate-900 dark:text-white">Closed</div>
              <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatCurrency(stageValues.closed.toString())}
              </div>
            </div>
            <div className="mt-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stageValues.closed / (stageValues.lead + stageValues.qualified + stageValues.proposal + stageValues.closed)) * 100)}%` }}>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Company</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Stage</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Value</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Probability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {deals?.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3">
                  <div className="font-medium text-slate-900 dark:text-white">{deal.companyName}</div>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStageColor(deal.stage)}`}>
                    {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                  </span>
                </td>
                <td className="py-3 font-medium">{formatCurrency(deal.value)}</td>
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`${deal.stage === 'closed' ? 'bg-accent' : 'bg-secondary'} h-1.5 rounded-full`} 
                        style={{ width: `${deal.probability}%` }}>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{deal.probability}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPipeline;
