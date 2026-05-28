import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  // Deduce title based on routing pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/project/')) return 'Kanban Boards';
    if (path === '/dashboard') return 'Overview Dashboard';
    if (path === '/analytics') return 'Analytics & Reports';
    if (path === '/profile') return 'Account Profile';
    return 'Project Workspace';
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b glass border-slate-200/50 dark:border-slate-800/50">
      {/* Title & Burger Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 lg:hidden text-slate-600 dark:text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-slate-850 dark:text-white">
          {getPageTitle()}
        </h2>
      </div>

      {/* Toolbar actions */}
      <div className="flex items-center gap-4">
        {/* Alerts / Notifications */}
        <div className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-dark-950" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all duration-200"
          aria-label="Toggle Theme Mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* Profile Circle */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-semibold uppercase text-xs">
            {user?.name?.slice(0, 2) || 'U'}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-600 dark:text-slate-300">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
