import Post from '../models/Post.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import { generateSlug, getUniqueSlug, paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status, seoTitle, seoDescription, seoKeywords } = req.body;

    const slug = await getUniqueSlug(generateSlug(title), Post);

    const post = new Post({
      title,
      content,
      excerpt,
      slug,
      author: req.user._id,
      category,
      tags: tags ? tags.split(',') : [],
      status: status || 'draft',
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords ? seoKeywords.split(',') : [],
    });

    await post.save();

    // Log activity
    await logActivity(req.user._id, 'create_post', 'post', post._id, { title, status }, req);

    await post.populate('author', 'username email').populate('category').populate('tags');

    sendResponse(res, 201, true, 'Post created successfully', post);
  } catch (error) {
    console.error('Create post error:', error);
    sendResponse(res, 500, false, 'Error creating post');
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, status, seoTitle, seoDescription, seoKeywords } = req.body;

    let post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this post');
    }

    // Save current version to revisions
    post.revisions.push({
      content: post.content,
      title: post.title,
      author: req.user._id,
      createdAt: new Date(),
    });

    if (title && title !== post.title) {
      post.slug = await getUniqueSlug(generateSlug(title), Post, id);
      post.title = title;
    }

    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.tags = tags ? tags.split(',') : post.tags;
    post.status = status || post.status;
    post.seoTitle = seoTitle || post.seoTitle;
    post.seoDescription = seoDescription || post.seoDescription;
    post.seoKeywords = seoKeywords ? seoKeywords.split(',') : post.seoKeywords;

    await post.save();

    // Log activity
    await logActivity(req.user._id, 'edit_post', 'post', post._id, { title: post.title, status: post.status }, req);

    await post.populate('author', 'username email').populate('category').populate('tags');

    sendResponse(res, 200, true, 'Post updated successfully', post);
  } catch (error) {
    console.error('Update post error:', error);
    sendResponse(res, 500, false, 'Error updating post');
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this post');
    }

    await Post.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_post', 'post', post._id, { title: post.title }, req);

    sendResponse(res, 200, true, 'Post deleted successfully');
  } catch (error) {
    console.error('Delete post error:', error);
    sendResponse(res, 500, false, 'Error deleting post');
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'username email firstName lastName avatar')
      .populate('category')
      .populate('tags');

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    // Increment views
    post.views += 1;
    await post.save();

    sendResponse(res, 200, true, 'Post retrieved successfully', post);
  } catch (error) {
    console.error('Get post error:', error);
    sendResponse(res, 500, false, 'Error fetching post');
  }
};

export const getPosts = async (req, res) => {
  try {
    const { page, limit, status, category, author, search } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (author) query.author = author;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Only show published posts to non-authenticated users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
      query.status = 'published';
    }

    const posts = await Post.find(query)
      .populate('author', 'username email firstName lastName avatar')
      .populate('category')
      .populate('tags')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await Post.countDocuments(query);

    sendResponse(res, 200, true, 'Posts retrieved successfully', posts, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    sendResponse(res, 500, false, 'Error fetching posts');
  }
};

export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to publish this post');
    }

    post.status = 'published';
    post.publishedAt = new Date();

    await post.save();

    // Log activity
    await logActivity(req.user._id, 'publish_post', 'post', post._id, { title: post.title }, req);

    await post.populate('author', 'username email').populate('category').populate('tags');

    sendResponse(res, 200, true, 'Post published successfully', post);
  } catch (error) {
    console.error('Publish post error:', error);
    sendResponse(res, 500, false, 'Error publishing post');
  }
};

export const getPostRevisions = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate('revisions.author', 'username email');

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    sendResponse(res, 200, true, 'Revisions retrieved successfully', post.revisions);
  } catch (error) {
    console.error('Get revisions error:', error);
    sendResponse(res, 500, false, 'Error fetching revisions');
  }
};

export const autosaveDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    post.autosaveDraft = {
      content,
      title,
      lastSaved: new Date(),
    };

    await post.save();

    sendResponse(res, 200, true, 'Draft autosaved', post.autosaveDraft);
  } catch (error) {
    console.error('Autosave error:', error);
    sendResponse(res, 500, false, 'Error autosaving draft');
  }
};
