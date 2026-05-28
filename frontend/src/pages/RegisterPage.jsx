import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register, user, loading, error, setError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const navigate = useNavigate();

  // Clear errors on initial render
  useEffect(() => {
    setError(null);
  }, [setError]);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all register fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-950 px-4">
      {/* Background Animated Mesh */}
      <div className="bg-mesh" />

      {/* Registration Pane */}
      <div className="w-full max-w-md p-8 rounded-2xl glass-card border border-white/20 shadow-2xl relative overflow-hidden my-8">
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 glow-brand mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Register Workspace
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Build your professional squads and track metrics
          </p>
        </div>

        {/* Errors Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mukesh V"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900/35 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm text-slate-800 dark:text-slate-100 transition"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. mukesh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900/35 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm text-slate-800 dark:text-slate-100 transition"
              required
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Privilege Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900/35 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm text-slate-800 dark:text-slate-100 transition"
            >
              <option value="Member">Member (standard team developer)</option>
              <option value="Manager">Manager (can manage projects & items)</option>
              <option value="Admin">Admin (full access keys)</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Secret Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900/35 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm text-slate-800 dark:text-slate-100 transition"
              required
            />
          </div>

          {/* Register Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 mt-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md glow-brand hover:shadow-lg disabled:opacity-60 transition duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Workspace'
            )}
          </button>
        </form>

        {/* Navigation Footer */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have a workspace?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
