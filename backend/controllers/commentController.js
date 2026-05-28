import Comment from '../models/Comment.js';
import Task from '../models/Task.js';

// @desc    Add comment to a task
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text, taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    let comment = await Comment.create({
      text,
      task: taskId,
      user: req.user._id,
    });

    comment = await comment.populate('user', 'name email avatar role');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Only Admin or comment creator can delete
    if (req.user.role !== 'Admin' && comment.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment removed successfully' });
  } catch (error) {
    next(error);
  }
};
