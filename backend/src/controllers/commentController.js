import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    if (!post.commentsEnabled) {
      return sendResponse(res, 403, false, 'Comments are disabled for this post');
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    await comment.save();
    await comment.populate('author', 'username email firstName lastName avatar');

    // Increment comment count
    post.commentCount += 1;
    await post.save();

    // Log activity
    await logActivity(req.user._id, 'create_comment', 'comment', comment._id, { post: postId }, req);

    sendResponse(res, 201, true, 'Comment created successfully', comment);
  } catch (error) {
    console.error('Create comment error:', error);
    sendResponse(res, 500, false, 'Error creating comment');
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    let comment = await Comment.findById(id);

    if (!comment) {
      return sendResponse(res, 404, false, 'Comment not found');
    }

    // Check authorization
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this comment');
    }

    comment.content = content;
    await comment.save();

    await comment.populate('author', 'username email firstName lastName avatar');

    // Log activity
    await logActivity(req.user._id, 'edit_comment', 'comment', comment._id, {}, req);

    sendResponse(res, 200, true, 'Comment updated successfully', comment);
  } catch (error) {
    console.error('Update comment error:', error);
    sendResponse(res, 500, false, 'Error updating comment');
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return sendResponse(res, 404, false, 'Comment not found');
    }

    // Check authorization
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(id);

    // Decrement comment count
    const post = await Post.findById(comment.post);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await post.save();
    }

    // Log activity
    await logActivity(req.user._id, 'delete_comment', 'comment', id, {}, req);

    sendResponse(res, 200, true, 'Comment deleted successfully');
  } catch (error) {
    console.error('Delete comment error:', error);
    sendResponse(res, 500, false, 'Error deleting comment');
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit, status } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    const query = { post: postId, parentComment: null };

    if (status) {
      query.status = status;
    } else {
      query.status = 'approved';
    }

    const comments = await Comment.find(query)
      .populate('author', 'username email firstName lastName avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username email firstName lastName avatar' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await Comment.countDocuments(query);

    sendResponse(res, 200, true, 'Comments retrieved successfully', comments, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    sendResponse(res, 500, false, 'Error fetching comments');
  }
};

export const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendResponse(res, 403, false, 'Not authorized');
    }

    const comment = await Comment.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    if (!comment) {
      return sendResponse(res, 404, false, 'Comment not found');
    }

    // Log activity
    await logActivity(req.user._id, 'approve_comment', 'comment', id, {}, req);

    sendResponse(res, 200, true, 'Comment approved', comment);
  } catch (error) {
    console.error('Approve comment error:', error);
    sendResponse(res, 500, false, 'Error approving comment');
  }
};

export const rejectComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendResponse(res, 403, false, 'Not authorized');
    }

    const comment = await Comment.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

    if (!comment) {
      return sendResponse(res, 404, false, 'Comment not found');
    }

    // Log activity
    await logActivity(req.user._id, 'reject_comment', 'comment', id, {}, req);

    sendResponse(res, 200, true, 'Comment rejected', comment);
  } catch (error) {
    console.error('Reject comment error:', error);
    sendResponse(res, 500, false, 'Error rejecting comment');
  }
};
