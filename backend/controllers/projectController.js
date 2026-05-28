import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin or Manager only)
export const createProject = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, teamMembers } = req.body;

    // Standardize members list to include the creator
    const members = teamMembers ? [...new Set([...teamMembers, req.user._id.toString()])] : [req.user._id];

    const project = await Project.create({
      title,
      description,
      status: status || 'Planning',
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user._id,
      teamMembers: members,
    });

    // Create system activity log
    await ActivityLog.create({
      user: req.user._id,
      project: project._id,
      action: `Created project '${project.title}'`,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for logged in user (Admins get all)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    let query = {};

    // Member and Managers only see projects they belong to. Admins see everything.
    if (req.user.role !== 'Admin') {
      query = { teamMembers: req.user._id };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email role avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email role avatar');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify user belongs to the project (unless Admin)
    const isMember = project.teamMembers.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin or Manager only)
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Only Admin or project creator can update it
    if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    const { title, description, status, priority, dueDate, teamMembers } = req.body;

    // Standardize members list to include the creator
    let members = project.teamMembers;
    if (teamMembers) {
      members = [...new Set([...teamMembers, project.createdBy.toString()])];
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: title || project.title,
        description: description || project.description,
        status: status || project.status,
        priority: priority || project.priority,
        dueDate: dueDate || project.dueDate,
        teamMembers: members,
      },
      { new: true, runValidators: true }
    ).populate('teamMembers', 'name email role avatar');

    // Create system activity log
    await ActivityLog.create({
      user: req.user._id,
      project: project._id,
      action: `Updated project settings/details`,
    });

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin or Manager only)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Only Admin or creator can delete
    if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    // Remove all associated tasks, activity logs, etc.
    await Task.deleteMany({ project: project._id });
    await ActivityLog.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project and all associated tasks removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/projects/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query = { teamMembers: req.user._id };
    }

    const projects = await Project.find(query);
    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } });

    // Aggregate statistics
    const stats = {
      projectsCount: projects.length,
      tasksCount: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      todoTasks: tasks.filter((t) => t.status === 'Todo').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      reviewTasks: tasks.filter((t) => t.status === 'Review').length,
      highPriorityTasks: tasks.filter((t) => t.priority === 'High').length,
    };

    // Calculate completion percentages
    stats.completionRate = stats.tasksCount
      ? Math.round((stats.completedTasks / stats.tasksCount) * 100)
      : 0;

    // Get recent activity logs
    const activities = await ActivityLog.find({ project: { $in: projectIds } })
      .populate('user', 'name avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, stats, activities });
  } catch (error) {
    next(error);
  }
};
