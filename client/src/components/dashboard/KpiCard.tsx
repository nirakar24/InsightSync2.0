import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon, color }) => {
  const getBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 text-secondary';
      case 'indigo':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-500';
      case 'amber':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-500';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-secondary';
    }
  };

  const getChangeColor = () => {
    return change >= 0
      ? 'text-green-500 bg-green-100 dark:bg-green-900/30'
      : 'text-red-500 bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:-translate-y-1 transition-transform duration-200 card-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className={`w-8 h-8 rounded-md ${getBgColor()} flex items-center justify-center`}>
          <span className="material-icons text-sm">{icon}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          <span className={`ml-2 text-xs font-medium ${getChangeColor()} px-1.5 py-0.5 rounded`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">vs previous period</p>
      </div>
    </div>
  );
};

export default KpiCard;
