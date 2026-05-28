import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  User, 
  Activity, 
  Sparkles,
  LogOut,
  X,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 glass border-r shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 glow-brand">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Mukesh<span className="text-brand-500">PM</span>
            </span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800/50 lg:hidden text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white font-bold uppercase select-none">
              {user?.name?.slice(0, 2) || 'US'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">
                {user?.name || 'User Session'}
              </h4>
              <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-bold tracking-wider rounded uppercase ${
                user?.role === 'Admin' 
                  ? 'bg-rose-500/10 text-rose-500' 
                  : user?.role === 'Manager' 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {user?.role || 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border-l-4 border-brand-500 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:text-white hover:bg-rose-600 rounded-xl transition-all duration-250 dark:text-rose-400 dark:hover:bg-rose-600/90 border border-transparent hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
