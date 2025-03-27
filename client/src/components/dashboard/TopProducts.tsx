import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  trend: string;
  icon: string;
}

const TopProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/dashboard/top-products'],
  });

  const formatCurrency = (amount: string) => {
    const numValue = parseFloat(amount);
    if (numValue >= 1000000) {
      return `₹${(numValue / 100000).toFixed(2)}L`;
    }
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  const getIconColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'software':
        return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
      case 'support':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'infrastructure':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'services':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400';
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
              <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse mr-3"></div>
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
          <h3 className="font-semibold text-slate-900 dark:text-white">Top Products</h3>
          <Link href="/products" className="text-sm text-secondary hover:text-secondary/80">
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {products?.map((product) => (
          <div key={product.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className={`w-10 h-10 rounded-md ${getIconColor(product.category)} flex items-center justify-center mr-3`}>
              <span className="material-icons text-base">{product.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {product.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </p>
              <div className="flex items-center justify-end">
                <span className={`text-xs ${parseFloat(product.trend) >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  <span className="material-icons text-xs mr-0.5">
                    {parseFloat(product.trend) >= 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  {Math.abs(parseFloat(product.trend))}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
