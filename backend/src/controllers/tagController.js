import Tag from '../models/Tag.js';
import { generateSlug, getUniqueSlug, paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createTag = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const slug = await getUniqueSlug(generateSlug(name), Tag);

    const tag = new Tag({
      name,
      slug,
      description,
      color: color || '#000000',
    });

    await tag.save();

    // Log activity
    await logActivity(req.user._id, 'create_tag', 'tag', tag._id, { name }, req);

    sendResponse(res, 201, true, 'Tag created successfully', tag);
  } catch (error) {
    console.error('Create tag error:', error);
    sendResponse(res, 500, false, 'Error creating tag');
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, isActive } = req.body;

    let tag = await Tag.findById(id);

    if (!tag) {
      return sendResponse(res, 404, false, 'Tag not found');
    }

    if (name && name !== tag.name) {
      tag.slug = await getUniqueSlug(generateSlug(name), Tag, id);
      tag.name = name;
    }

    tag.description = description || tag.description;
    tag.color = color || tag.color;
    if (typeof isActive === 'boolean') tag.isActive = isActive;

    await tag.save();

    // Log activity
    await logActivity(req.user._id, 'edit_tag', 'tag', tag._id, { name: tag.name }, req);

    sendResponse(res, 200, true, 'Tag updated successfully', tag);
  } catch (error) {
    console.error('Update tag error:', error);
    sendResponse(res, 500, false, 'Error updating tag');
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return sendResponse(res, 404, false, 'Tag not found');
    }

    // Log activity
    await logActivity(req.user._id, 'delete_tag', 'tag', id, { name: tag.name }, req);

    sendResponse(res, 200, true, 'Tag deleted successfully');
  } catch (error) {
    console.error('Delete tag error:', error);
    sendResponse(res, 500, false, 'Error deleting tag');
  }
};

export const getTags = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    const query = { isActive: true };

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    }

    const tags = await Tag.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await Tag.countDocuments(query);

    sendResponse(res, 200, true, 'Tags retrieved successfully', tags, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get tags error:', error);
    sendResponse(res, 500, false, 'Error fetching tags');
  }
};

export const getTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);

    if (!tag) {
      return sendResponse(res, 404, false, 'Tag not found');
    }

    sendResponse(res, 200, true, 'Tag retrieved successfully', tag);
  } catch (error) {
    console.error('Get tag error:', error);
    sendResponse(res, 500, false, 'Error fetching tag');
  }
};
