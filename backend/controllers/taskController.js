import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';
import Comment from '../models/Comment.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser, project } = req.body;

    // Verify project exists
    const projectRecord = await Project.findById(project);
    if (!projectRecord) {
      res.status(404);
      throw new Error('Project not found');
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      assignedUser: assignedUser || null,
      project,
      createdBy: req.user._id,
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      project: project,
      action: `Created task '${task.title}' in list '${task.status}'`,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a project (with filters)
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority, search, assignedUser } = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    let filter = { project: projectId };

    // Apply status filter
    if (status) {
      filter.status = status;
    }

    // Apply priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Apply assigned user filter
    if (assignedUser) {
      filter.assignedUser = assignedUser === 'unassigned' ? null : assignedUser;
    }

    // Apply search filter (match title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignedUser', 'name email avatar role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task details by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedUser', 'name email avatar role')
      .populate('createdBy', 'name email');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Get comments for this task
    const comments = await Comment.find({ task: task._id })
      .populate('user', 'name avatar role')
      .sort({ createdAt: -1 });

    res.json({ success: true, task, comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details (handles movements as well)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, status, priority, dueDate, assignedUser, attachments } = req.body;

    const oldStatus = task.status;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate || task.dueDate,
        assignedUser: assignedUser !== undefined ? (assignedUser === '' ? null : assignedUser) : task.assignedUser,
        attachments: attachments || task.attachments,
      },
      { new: true, runValidators: true }
    ).populate('assignedUser', 'name email avatar role');

    // If status changed, log the transition
    if (status && oldStatus !== status) {
      await ActivityLog.create({
        user: req.user._id,
        project: task.project,
        action: `Moved task '${task.title}' from '${oldStatus}' to '${status}'`,
      });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await ActivityLog.create({
      user: req.user._id,
      project: task.project,
      action: `Deleted task '${task.title}'`,
    });

    // Remove comments
    await Comment.deleteMany({ task: task._id });
    await task.deleteOne();

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed statistics of tasks inside a project for Recharts
// @route   GET /api/tasks/stats/analytics/:projectId
// @access  Private
export const getTaskAnalytics = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId });

    // Status counts
    const statusData = [
      { name: 'Todo', value: tasks.filter((t) => t.status === 'Todo').length },
      { name: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length },
      { name: 'Review', value: tasks.filter((t) => t.status === 'Review').length },
      { name: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length },
    ];

    // Priority counts
    const priorityData = [
      { name: 'High', value: tasks.filter((t) => t.priority === 'High').length, color: '#f43f5e' },
      { name: 'Medium', value: tasks.filter((t) => t.priority === 'Medium').length, color: '#fbbf24' },
      { name: 'Low', value: tasks.filter((t) => t.priority === 'Low').length, color: '#10b981' },
    ];

    // Team progress - group by assigned users
    const userTasks = {};
    for (const t of tasks) {
      if (t.assignedUser) {
        const userId = t.assignedUser.toString();
        if (!userTasks[userId]) {
          userTasks[userId] = { completed: 0, total: 0 };
        }
        userTasks[userId].total += 1;
        if (t.status === 'Completed') {
          userTasks[userId].completed += 1;
        }
      }
    }

    // Populate user names for team progress
    const teamProgressData = [];
    for (const [userId, counts] of Object.entries(userTasks)) {
      const userObj = await mongoose.model('User').findById(userId).select('name');
      if (userObj) {
        teamProgressData.push({
          name: userObj.name,
          completed: counts.completed,
          pending: counts.total - counts.completed,
        });
      }
    }

    res.json({
      success: true,
      statusData,
      priorityData,
      teamProgressData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI prioritize & summary suggestions using Gemini
// @route   POST /api/tasks/:id/ai-assist
// @access  Private
export const getAIAssist = async (req, res, next) => {
  try {
    const { action } = req.body; // 'prioritize' or 'summarize'
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback with standard premium mock AI suggestions
      let aiResponse = '';
      if (action === 'prioritize') {
        const hasUrgentWords = /urgent|critical|asap|fix|crash|broken|deadline/i.test(task.description + task.title);
        const hasMediumWords = /setup|implement|improve|design|page/i.test(task.description + task.title);
        const suggested = hasUrgentWords ? 'High' : hasMediumWords ? 'Medium' : 'Low';
        aiResponse = `AI Analysis: Based on the task title "${task.title}" and description, I suggest raising priority to **${suggested}**. Reason: Description contains phrases indicating ${hasUrgentWords ? 'critical path items requiring immediate resolution' : hasMediumWords ? 'standard feature implementations' : 'minor tweaks and lower severity polish'}.`;
      } else {
        aiResponse = `AI Task Summary:\n• **Objective**: Complete execution of "${task.title}".\n• **Core Tasks**: Analyze context, test functionalities, and review constraints.\n• **Productivity Recommendation**: Allocate an uninterrupted 90-minute block. Suggested assignee should verify any edge-cases before shifting status column.`;
      }

      return res.json({ success: true, result: aiResponse, fallback: true });
    }

    // Call Google Gemini REST Endpoint
    const prompt = action === 'prioritize' 
      ? `Task Title: ${task.title}\nTask Description: ${task.description}\n\nAnalyze this task details and suggest if it should be Low, Medium, or High priority. Provide a brief explanation of 2 sentences.`
      : `Task Title: ${task.title}\nTask Description: ${task.description}\n\nGenerate a professional 3-bullet point executive summary and a productivity tip for this task.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    let resultText = '';

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      resultText = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Gemini API did not return structured candidates.');
    }

    res.json({ success: true, result: resultText, fallback: false });
  } catch (error) {
    console.error('Gemini integration error:', error);
    // Secure secondary fallback
    res.json({
      success: true,
      result: `AI Assistant: Unable to query live Gemini models at this moment. For task "${task.title}", I recommend reviewing the deadlines carefully. Set to Medium as standard.`,
      fallback: true
    });
  }
};
