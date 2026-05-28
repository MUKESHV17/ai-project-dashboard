import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { BarChart3, Briefcase, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const AnalyticsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [teamProgressData, setTeamProgressData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load Projects list on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setInitialLoading(true);
        const { data } = await api.get('/projects');
        if (data.success && data.projects.length > 0) {
          setProjects(data.projects);
          setSelectedProjectId(data.projects[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch charts data when project ID selection changes
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tasks/stats/analytics/${selectedProjectId}`);
        if (data.success) {
          setStatusData(data.statusData);
          setPriorityData(data.priorityData);
          setTeamProgressData(data.teamProgressData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedProjectId]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981']; // Red (High), Amber (Medium), Emerald (Low)

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-400">Assembling metrics dashboards...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass border border-slate-200/50 dark:border-slate-800/30">
        <BarChart3 className="w-12 h-12 text-slate-400 mb-4" />
        <h4 className="font-bold text-slate-700 dark:text-slate-350">No Data Available</h4>
        <p className="text-slate-500 dark:text-slate-450 text-xs mt-1 max-w-sm">
          Please build project boards and populate cards to view detailed Recharts charts here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Selector banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-800/40">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-brand-500" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Select Project Board:</span>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-4 py-2 rounded-xl text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none text-slate-750 dark:text-slate-250 font-semibold"
        >
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="mt-4 text-[10px] font-semibold text-slate-400">Loading charts...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Row: Column splits and priorities pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Status Splits */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/45 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">
                Tasks Status Columns
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3341551a" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px' 
                      }} 
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/45 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">
                Priority Distribution Density
              </h4>
              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px'
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" fontSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bottom Row: Squad metrics */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/45 shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">
              Squad Workload Ratio (Pending vs Completed)
            </h4>
            
            {teamProgressData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No squad members assigned to active tasks on this board.</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamProgressData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3341551a" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending Tasks" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
