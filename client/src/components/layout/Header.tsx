import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center md:hidden">
          <button
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
            onClick={toggleSidebar}
          >
            <span className="material-icons">menu</span>
          </button>
          <div className="ml-3 md:hidden">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-white">
                <span className="material-icons text-xl">insights</span>
              </div>
              <h1 className="ml-2 text-lg font-bold text-primary dark:text-white">
                InsightSync
              </h1>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 mx-4">
          <div className="relative flex-1 max-w-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-icons text-sm">search</span>
            </span>
            <input
              type="text"
              placeholder="Search customers, products, or orders..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <span className="material-icons">light_mode</span>
            ) : (
              <span className="material-icons">dark_mode</span>
            )}
          </button>

          <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
          </button>

          <div className="border-l border-slate-200 dark:border-slate-700 h-6 mx-2"></div>

          <div className="md:hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
