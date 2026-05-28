import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import { 
  Sparkles,
  ArrowLeft,
  Calendar,
  Priority,
  AlertCircle,
  PlusCircle,
  Paperclip,
  MessageSquare,
  Trash2,
  Cpu,
  UserPlus,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterUser, setFilterUser] = useState('');

  // Task Details Modal
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // set if editing
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Task Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('Todo');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [attachments, setAttachments] = useState([]);

  // AI Assist response container
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);

      if (projRes.data.success) {
        setProject(projRes.data.project);
      }
      if (tasksRes.data.success) {
        setTasks(tasksRes.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const openCreateTaskModal = (initialStatus = 'Todo') => {
    setSelectedTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus(initialStatus);
    setTaskPriority('Medium');
    setTaskDueDate('');
    setTaskAssignee('');
    setAttachments([]);
    setComments([]);
    setAiResult('');
    setError('');
    setTaskModalOpen(true);
  };

  const openTaskDetailsModal = async (task) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setTaskAssignee(task.assignedUser?._id || '');
    setAttachments(task.attachments || []);
    setAiResult('');
    setError('');
    setTaskModalOpen(true);

    // Fetch comments
    try {
      const { data } = await api.get(`/tasks/${task._id}`);
      if (data.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        assignedUser: taskAssignee || null,
        attachments,
        project: id
      };

      if (selectedTask) {
        await api.put(`/tasks/${selectedTask._id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setTaskModalOpen(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    if (window.confirm('Delete this task permanently?')) {
      try {
        await api.delete(`/tasks/${selectedTask._id}`);
        setTaskModalOpen(false);
        fetchProjectData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Multer file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError('');

    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        setAttachments(prev => [...prev, data.file]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. File type rejected or size exceeds 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Comment posting
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post('/comments', {
        text: newComment,
        taskId: selectedTask._id
      });

      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (cId) => {
    try {
      await api.delete(`/comments/${cId}`);
      setComments(prev => prev.filter(c => c._id !== cId));
    } catch (err) {
      console.error(err);
    }
  };

  // live AI assists (Gemini)
  const handleAIAssist = async (action) => {
    if (!selectedTask) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const { data } = await api.post(`/tasks/${selectedTask._id}/ai-assist`, { action });
      if (data.success) {
        setAiResult(data.result);
      }
    } catch (err) {
      console.error(err);
      setAiResult('AI Assistant: Encountered error communicating with live services.');
    } finally {
      setAiLoading(false);
    }
  };

  // Drag-and-drop persistent updates
  const handleTaskMoved = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error(err);
      fetchProjectData();
    }
  };

  // Client filtering
  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    const matchUser = filterUser ? 
      (filterUser === 'unassigned' ? !t.assignedUser : t.assignedUser?._id === filterUser) : true;
    return matchSearch && matchPriority && matchUser;
  });

  if (loading && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-brand-500 rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-400">Restructuring board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/40 pb-5">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 rounded-xl glass border hover:bg-slate-200/40 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate max-w-md">
              {project?.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-450 text-xs truncate max-w-sm mt-0.5">
              {project?.description}
            </p>
          </div>
        </div>

        {/* Members circle stack */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Team</span>
          <div className="flex -space-x-1.5 overflow-hidden">
            {project?.teamMembers?.map((m) => (
              <div 
                key={m._id} 
                className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-dark-950 bg-indigo-500 text-white font-bold flex items-center justify-center uppercase text-[10px] cursor-pointer"
                title={`${m.name} (${m.role})`}
              >
                {m.name.slice(0, 2)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-800/40">
        <div className="flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-450" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 pl-9 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none"
            />
          </div>

          {/* Priority dropdown */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none text-slate-600 dark:text-slate-300"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* User Assignment dropdown */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none text-slate-600 dark:text-slate-300"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned Tasks</option>
            {project?.teamMembers?.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Add Card action */}
        <button
          onClick={() => openCreateTaskModal('Todo')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl glow-brand"
        >
          <PlusCircle className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {/* Fluid Trello Board */}
      <KanbanBoard 
        tasks={filteredTasks} 
        onTaskMoved={handleTaskMoved} 
        onTaskClicked={openTaskDetailsModal} 
        openCreateModal={openCreateTaskModal}
      />

      {/* Full Task Creation & Details Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl p-6 rounded-2xl glass border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Content column: Task Parameters Form */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-805 pb-3">
                <h3 className="text-lg font-bold text-slate-850 dark:text-white truncate">
                  {selectedTask ? 'Card Configuration' : 'Create New Board Card'}
                </h3>
                {selectedTask && (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Task
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-500/10 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleTaskSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Refactor endpoints authorization"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Task Description
                  </label>
                  <textarea
                    placeholder="Add specific checklists or descriptions here..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 outline-none text-sm text-slate-800 dark:text-slate-100 h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Column Status
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Priority scale
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Assignee */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Assign User
                    </label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 text-xs text-slate-850 dark:text-slate-100 outline-none"
                    >
                      <option value="">Unassigned</option>
                      {project?.teamMembers?.map((m) => (
                        <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Due Deadline *
                    </label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900 text-xs text-slate-850 dark:text-slate-100 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* File Upload Attachment picker */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    File attachments (Max 10MB)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900/40 text-xs text-slate-500 cursor-pointer transition">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Processing File...' : 'Choose File'}</span>
                      <input 
                        type="file" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={uploading} 
                      />
                    </label>
                  </div>

                  {/* Render attachments previews list */}
                  {attachments.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3.5">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-dark-900/20 text-[10px] relative group overflow-hidden">
                          <span className="font-semibold text-slate-700 dark:text-slate-350 truncate w-32" title={file.name}>
                            {file.name}
                          </span>
                          <div className="flex gap-2">
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-brand-500 hover:underline font-bold"
                            >
                              Open
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(idx)}
                              className="text-rose-500 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action block */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-805">
                  <button
                    type="button"
                    onClick={() => setTaskModalOpen(false)}
                    className="px-5 py-2 rounded-xl glass border hover:bg-slate-200/40 text-xs font-bold text-slate-600 dark:text-slate-350"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl"
                  >
                    {selectedTask ? 'Save Settings' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Content Column: AI Assistant & Task Collaboration Comments */}
            <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 space-y-6">
              
              {/* Gemini AI assist box */}
              {selectedTask && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/35 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 mb-3">
                    <Cpu className="w-4 h-4 animate-pulse" />
                    <span>Gemini Core Assistant</span>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Request AI suggestions to automate prioritizations or summarize descriptions cleanly.
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAIAssist('prioritize')}
                      disabled={aiLoading}
                      className="flex-1 py-1.5 rounded-lg text-[9px] font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition"
                    >
                      Priority Suggest
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAIAssist('summarize')}
                      disabled={aiLoading}
                      className="flex-1 py-1.5 rounded-lg text-[9px] font-bold glass border border-slate-300 hover:bg-slate-200/50 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition"
                    >
                      Summarize Task
                    </button>
                  </div>

                  {/* AI response glowing pane */}
                  {(aiLoading || aiResult) && (
                    <div className="mt-4 p-3 rounded-lg bg-[#0c1020] border border-brand-500/15 text-[10px] text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                      {aiLoading ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                          <span>Gemini is compiling insights...</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line">{aiResult}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Task Comments Timeline */}
              {selectedTask ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-750 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" /> Comments Timeline
                  </h4>

                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none"
                    />
                    <button 
                      type="submit" 
                      className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      Post
                    </button>
                  </form>

                  <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-4">No comments posted yet.</p>
                    ) : (
                      comments.map((comm) => (
                        <div key={comm._id} className="p-2.5 rounded-lg bg-white/40 dark:bg-dark-900/20 border border-slate-200/50 dark:border-slate-800 text-[10px] space-y-1 relative group">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{comm.user?.name}</span>
                            <span className="text-[9px] text-slate-450">{new Date(comm.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-normal">{comm.text}</p>
                          {(user?.role === 'Admin' || comm.user?._id === user?._id) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comm._id)}
                              className="absolute top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100 transition"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 text-[10px]">
                  <Cpu className="w-8 h-8 mb-2 text-slate-350" />
                  <p>Create the task first to configure files upload, live Gemini assistance, and task comment timelines.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
