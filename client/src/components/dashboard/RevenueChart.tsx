import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

interface RevenueData {
  month: string;
  year: number;
  value: string;
  change: string;
}

const RevenueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const { data: revenueData, isLoading } = useQuery<RevenueData[]>({
    queryKey: ['/api/dashboard/revenue-metrics'],
  });

  // Format data for Recharts
  const chartData = revenueData?.map(item => ({
    name: item.month,
    value: parseFloat(item.value) / 100000, // Convert to lakhs for display
  })) || [];

  const formatYAxis = (value: number) => {
    return `₹${value}L`;
  };

  const formatTooltip = (value: number) => {
    return [`₹${value}L`, "Revenue"];
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/4 mb-4 rounded"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="flex justify-between mt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-8 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Trend</h3>
        <div className="flex items-center space-x-2">
          <button
            className={`text-xs ${
              timeRange === 'weekly'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            } px-2 py-1 rounded`}
            onClick={() => setTimeRange('weekly')}
          >
            <span>Weekly</span>
          </button>
          <button
            className={`text-xs ${
              timeRange === 'monthly'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            } px-2 py-1 rounded`}
            onClick={() => setTimeRange('monthly')}
          >
            <span>Monthly</span>
          </button>
          <button
            className={`text-xs ${
              timeRange === 'yearly'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            } px-2 py-1 rounded`}
            onClick={() => setTimeRange('yearly')}
          >
            <span>Yearly</span>
          </button>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'var(--slate-500)' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12, fill: 'var(--slate-500)' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={formatTooltip} 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '0.375rem'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fillOpacity={1}
              fill="url(#colorValue)" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
