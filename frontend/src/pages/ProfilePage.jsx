import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual profile header card */}
      <div className="relative p-8 rounded-2xl glass shadow border border-white/10 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative">
          {/* Large user avatar */}
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-brand-500 text-white text-3xl font-bold uppercase select-none glow-brand shadow-lg">
            {user?.name?.slice(0, 2) || 'US'}
          </div>

          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {user?.name || 'Workspace Account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              AI-Powered Project Management Workspace Member
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full uppercase ${
                user?.role === 'Admin' 
                  ? 'bg-rose-500/10 text-rose-500' 
                  : user?.role === 'Manager' 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {user?.role || 'Member'}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">Active Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Layout details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Information parameters */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-card shadow border border-white/5 space-y-5">
            <h3 className="text-lg font-bold text-slate-805 dark:text-white border-b border-slate-200/50 dark:border-slate-850 pb-3">
              Account Parameters
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40 text-sm">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">Full Name</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40 text-sm">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">Email Address</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40 text-sm">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">Permissions Privilege</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI productivity summaries card */}
        <div className="p-6 rounded-2xl glass-card shadow border border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Smart Workspace Tips
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              As a **{user?.role}**, you can create boards, collaborate on task comments timelines, upload validation files, and request live Gemini priority suggested reports.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-400">
            Authenticated via standard SHA256 JWT keys.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
