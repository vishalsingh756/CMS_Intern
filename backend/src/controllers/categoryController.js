import Category from '../models/Category.js';
import { generateSlug, getUniqueSlug, paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const slug = await getUniqueSlug(generateSlug(name), Category);

    const category = new Category({
      name,
      slug,
      description,
      color: color || '#000000',
    });

    await category.save();

    // Log activity
    await logActivity(req.user._id, 'create_category', 'category', category._id, { name }, req);

    sendResponse(res, 201, true, 'Category created successfully', category);
  } catch (error) {
    console.error('Create category error:', error);
    sendResponse(res, 500, false, 'Error creating category');
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, isActive } = req.body;

    let category = await Category.findById(id);

    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }

    if (name && name !== category.name) {
      category.slug = await getUniqueSlug(generateSlug(name), Category, id);
      category.name = name;
    }

    category.description = description || category.description;
    category.color = color || category.color;
    if (typeof isActive === 'boolean') category.isActive = isActive;

    await category.save();

    // Log activity
    await logActivity(req.user._id, 'edit_category', 'category', category._id, { name: category.name }, req);

    sendResponse(res, 200, true, 'Category updated successfully', category);
  } catch (error) {
    console.error('Update category error:', error);
    sendResponse(res, 500, false, 'Error updating category');
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }

    // Log activity
    await logActivity(req.user._id, 'delete_category', 'category', id, { name: category.name }, req);

    sendResponse(res, 200, true, 'Category deleted successfully');
  } catch (error) {
    console.error('Delete category error:', error);
    sendResponse(res, 500, false, 'Error deleting category');
  }
};

export const getCategories = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    const query = { isActive: true };

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    }

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await Category.countDocuments(query);

    sendResponse(res, 200, true, 'Categories retrieved successfully', categories, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    sendResponse(res, 500, false, 'Error fetching categories');
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }

    sendResponse(res, 200, true, 'Category retrieved successfully', category);
  } catch (error) {
    console.error('Get category error:', error);
    sendResponse(res, 500, false, 'Error fetching category');
  }
};
