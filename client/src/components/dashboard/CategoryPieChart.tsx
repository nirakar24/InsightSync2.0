import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';

interface CategoryData {
  id: number;
  category: string;
  value: string;
  percentage: string;
}

const CategoryPieChart: React.FC = () => {
  const { data: categoryData, isLoading } = useQuery<CategoryData[]>({
    queryKey: ['/api/dashboard/category-sales'],
  });

  // Colors for the different categories
  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#A855F7'];

  // Format data for Recharts
  const chartData = categoryData?.map((item, index) => ({
    name: item.category,
    value: parseFloat(item.percentage),
    color: COLORS[index % COLORS.length],
  })) || [];

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 mb-4 rounded"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto w-48"></div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Sales by Category</h3>
        <button className="text-slate-500 dark:text-slate-400">
          <span className="material-icons text-sm">more_vert</span>
        </button>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: entry.color }}></span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
