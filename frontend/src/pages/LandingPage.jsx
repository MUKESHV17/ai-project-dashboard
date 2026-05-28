import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  BarChart3, 
  Users, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const featureCards = [
    {
      title: "Interactive Kanban Boards",
      desc: "Perfect fluid drag-and-drop mechanics to group task items into Todo, In Progress, Review, and Completed columns.",
      icon: Layers,
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      title: "Google Gemini Core AI",
      desc: "Instantly analyze task specifications to suggest priorities, generate concise task summaries, and provide action lists.",
      icon: Cpu,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Recharts Deep Analytics",
      desc: "Animated priority allocations, completion margins, and workload balances that clarify team progress at a single glance.",
      icon: BarChart3,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      title: "Role-Based Privileges",
      desc: "Clean permissions mapping allowing Admins, Managers, and Members distinct levels of authorization and action controls.",
      icon: Users,
      color: "bg-amber-500/10 text-amber-500"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100">
      <div className="bg-mesh" />

      {/* Navigation Header */}
      <nav className="flex items-center justify-between h-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 glow-brand">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Antigravity<span className="text-brand-500">PM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md glow-brand hover:shadow-lg transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-brand-600 dark:text-brand-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Introducing AI-Driven Workflow Management
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
        >
          Manage Projects with <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Gemini Intelligence</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
        >
          A production-level workspace crafted for high-performing squads. Track operations with beautiful Kanban boards, automated charts, and live AI suggestions.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/register" 
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg hover:shadow-xl glow-brand hover:translate-y-[-2px] transition duration-200"
          >
            Create Your Workspace
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 text-base font-semibold rounded-2xl glass border hover:bg-white/20 dark:hover:bg-slate-800/40 transition"
          >
            Live Demo Session
          </Link>
        </motion.div>

        {/* Dashboard Preview mockup */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 rounded-2xl glass border p-3 shadow-2xl max-w-5xl mx-auto overflow-hidden border-white/20"
        >
          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 flex flex-col relative group">
            {/* Mock Dashboard Topbar */}
            <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="w-40 h-5 bg-slate-700/60 rounded ml-4 text-[10px] text-slate-400 flex items-center justify-center font-medium">
                workspace.antigravity.pm
              </div>
            </div>
            {/* Mock Dashboard Inner */}
            <div className="flex-1 bg-[#0f172a] p-6 flex flex-col justify-start text-left select-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg">Product Capstone Launch</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Automated AI estimations active</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">MV</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">JD</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {['Todo', 'In Progress', 'Review', 'Completed'].map((col, idx) => (
                  <div key={col} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col gap-3">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">{col}</span>
                    {idx === 0 && (
                      <div className="bg-slate-850 border border-slate-800 rounded-lg p-3 shadow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-semibold uppercase">High</span>
                        </div>
                        <h4 className="text-white font-semibold text-xs truncate">Configure JWT auth</h4>
                        <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">Ensure secure verification keys.</p>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="bg-slate-850 border border-slate-800 rounded-lg p-3 shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-brand-500/25 blur-lg" />
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold uppercase">Medium</span>
                        </div>
                        <h4 className="text-white font-semibold text-xs truncate">Write Recharts views</h4>
                        <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">Visualize metrics on status columns.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Feature Showcase Grid */}
      <section className="bg-slate-100/50 dark:bg-dark-900/30 border-y border-slate-200/50 dark:border-slate-800/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Engineered with Enterprise Standards
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4">
              Everything teams need to collaborate, structure deliverables, and achieve product goals effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div 
                  key={i} 
                  className="rounded-2xl glass-card p-6 border border-slate-200/60 dark:border-slate-800/50 hover:translate-y-[-4px] transition-transform duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-12 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-500">
        <p>© 2026 Antigravity Project Management Dashboard. Week 4 Capstone Internship project.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
