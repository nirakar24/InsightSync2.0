import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/customers', label: 'Customers', icon: 'people' },
    { path: '/products', label: 'Products', icon: 'inventory_2' },
    { path: '/sales', label: 'Sales Pipeline', icon: 'trending_up' },
    { path: '/support', label: 'Support', icon: 'support_agent' },
  ];

  const bottomNavItems = [
    { path: '/settings', label: 'Settings', icon: 'settings' },
    { path: '/help', label: 'Help Center', icon: 'help_outline' },
  ];

  return (
    <div 
      className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-all duration-300 ease-in-out ${
        collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : ''
      }`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-white">
            <span className="material-icons text-xl">insights</span>
          </div>
          {!collapsed && (
            <h1 className="ml-3 text-xl font-bold text-primary dark:text-white">InsightSync</h1>
          )}
        </div>
      </div>

      <nav className="p-2 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center p-3 rounded-md ${
                isActive(item.path)
                  ? 'bg-secondary/10 text-secondary'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              } group`}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center p-3 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 group"
              >
                <span className="material-icons text-xl">{item.icon}</span>
                {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700"
          />
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Alex Morgan
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Product Manager
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
