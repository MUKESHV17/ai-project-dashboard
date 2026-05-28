import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Search, 
  PlusCircle, 
  Calendar,
  AlertCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    projectsCount: 0,
    tasksCount: 0,
    completedTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    reviewTasks: 0,
    highPriorityTasks: 0,
    completionRate: 0,
  });
  const [activities, setActivities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Modal Fields
  const [projectId, setProjectId] = useState(null); // set if editing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Planning');
  const [dueDate, setDueDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch Dashboard Stats & Projects
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/stats/dashboard')
      ]);

      if (projRes.data.success) {
        setProjects(projRes.data.projects);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setActivities(statsRes.data.activities);
      }
    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch system users for selection
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setProjectId(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('Planning');
    setDueDate('');
    setSelectedMembers([]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setProjectId(proj._id);
    setTitle(proj.title);
    setDescription(proj.description);
    setPriority(proj.priority);
    setStatus(proj.status);
    setDueDate(proj.dueDate ? new Date(proj.dueDate).toISOString().split('T')[0] : '');
    setSelectedMembers(proj.teamMembers.map(m => m._id));
    setError('');
    setModalOpen(true);
  };

  const handleDeleteProject = async (pId) => {
    if (window.confirm('Are you absolutely sure you want to delete this project? This will permanently delete all associated tasks, attachments, and comments.')) {
      try {
        await api.delete(`/projects/${pId}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMemberToggle = (uId) => {
    setSelectedMembers(prev => 
      prev.includes(uId) ? prev.filter(id => id !== uId) : [...prev, uId]
    );
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const payload = { title, description, priority, status, dueDate, teamMembers: selectedMembers };
      if (projectId) {
        await api.put(`/projects/${projectId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please check parameters.');
    }
  };

  // Filter projects by search keyword
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Visual stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total projects */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Projects</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.projectsCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Total tasks */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.tasksCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Completion margin percentage */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completion Rate</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.completionRate}%
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* High priority tasks */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent Alerts</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white text-rose-500">
              {stats.highPriorityTasks}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Primary Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">
              Your Active Boards
            </h3>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter boards..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Add Project trigger (Admin/Manager only) */}
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl glow-brand shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              )}
            </div>
          </div>

          {/* Skeleton Loaders during loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="h-44 rounded-2xl skeleton border border-slate-200/50 dark:border-slate-800/40" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass border border-slate-200/50 dark:border-slate-800/30">
              <Briefcase className="w-12 h-12 text-slate-400 mb-4" />
              <h4 className="font-bold text-slate-700 dark:text-slate-350">No Boards Configured</h4>
              <p className="text-slate-500 dark:text-slate-450 text-xs mt-1 max-w-sm">
                Get started by creating a new project board. Assign priorities, invite members, and build task workflows.
              </p>
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1.5 px-4 py-2 mt-4 text-xs font-semibold text-white bg-brand-600 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4" /> Create First Board
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((proj) => (
                <div 
                  key={proj._id}
                  className="group p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/50 hover:shadow-md hover:translate-y-[-2px] transition duration-200 relative flex flex-col justify-between"
                >
                  {/* Actions Dropdown */}
                  {(user?.role === 'Admin' || proj.createdBy?._id === user?._id) && (
                    <div className="absolute top-4 right-4 flex gap-1">
                      <button 
                        onClick={() => openEditModal(proj)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 hover:text-brand-500"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(proj._id)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 hover:text-rose-500"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                        proj.priority === 'High' 
                          ? 'bg-rose-500/10 text-rose-500' 
                          : proj.priority === 'Medium' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {proj.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {proj.status}</span>
                    </div>

                    <Link to={`/project/${proj._id}`} className="block">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-brand-500 transition duration-150 truncate">
                        {proj.title}
                      </h4>
                    </Link>

                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 mt-5 pt-4">
                    {/* Due date */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>

                    {/* Members stack count */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {proj.teamMembers?.slice(0, 3).map((m, i) => (
                          <div 
                            key={i} 
                            className="w-5.5 h-5.5 rounded-full ring-2 ring-white dark:ring-dark-950 bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white uppercase select-none w-5 h-5"
                            title={m.name}
                          >
                            {m.name.slice(0, 2)}
                          </div>
                        ))}
                      </div>
                      {proj.teamMembers?.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-semibold">+{proj.teamMembers.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity timelines side panel */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/45 shadow-sm h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-550 dark:text-slate-350 border-b border-slate-200/50 dark:border-slate-800 pb-3 mb-4">
            Squad Activity Logs
          </h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(s => (
                <div key={s} className="h-10 skeleton rounded-lg" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No recent actions recorded.</p>
          ) : (
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2.5 space-y-5">
              {activities.map((act) => (
                <div key={act._id} className="relative pl-6">
                  {/* timeline dot */}
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-dark-950" />
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal">
                      <span className="font-semibold">{act.user?.name}</span> {act.action}
                    </p>
                    <span className="block text-[9px] text-slate-400">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.project?.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Create/Edit Project */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl p-8 rounded-2xl glass border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {projectId ? 'Edit Board Details' : 'Build A New Project Board'}
            </h3>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleProjectSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Redesign Landing Portal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                  Project Description *
                </label>
                <textarea
                  placeholder="Summarize the core targets and specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100 h-24 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                    Priority scale
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                    Project Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                  Due Deadline Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Team Members Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-2">
                  Assign Squad Members
                </label>
                <div className="max-h-28 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white/40 dark:bg-dark-900/30 space-y-1.5">
                  {allUsers.map((u) => (
                    <label key={u._id} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => handleMemberToggle(u._id)}
                        className="rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500 text-brand-500 h-3.5 w-3.5"
                      />
                      <span className="font-medium">{u.name}</span>
                      <span className="text-[10px] text-slate-400">({u.role})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions Button */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl glass border hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow shadow-brand-500 transition"
                >
                  {projectId ? 'Save Changes' : 'Build Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
