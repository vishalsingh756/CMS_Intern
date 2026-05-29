import Media from '../models/Media.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';
import fs from 'fs';
import path from 'path';

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file uploaded');
    }

    const { folder } = req.body;

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.includes('pdf')) fileType = 'document';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      fileType,
      url: `/uploads/${req.file.filename}`,
      folder: folder || 'general',
    });

    await media.save();

    // Log activity
    await logActivity(req.user._id, 'upload_media', 'media', media._id, { filename: req.file.originalname }, req);

    sendResponse(res, 201, true, 'File uploaded successfully', media);
  } catch (error) {
    console.error('Upload media error:', error);
    sendResponse(res, 500, false, 'Error uploading file');
  }
};

export const getMediaLibrary = async (req, res) => {
  try {
    const { page, limit, folder, search, fileType } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    const query = { uploadedBy: req.user._id };

    if (folder) query.folder = folder;
    if (fileType) query.fileType = fileType;

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
      ];
    }

    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await Media.countDocuments(query);

    sendResponse(res, 200, true, 'Media retrieved successfully', media, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get media error:', error);
    sendResponse(res, 500, false, 'Error fetching media');
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return sendResponse(res, 404, false, 'Media not found');
    }

    // Check authorization
    if (media.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this media');
    }

    // Delete file from uploads folder
    const filePath = path.join(path.dirname(process.cwd()), 'backend', 'uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_media', 'media', id, { filename: media.filename }, req);

    sendResponse(res, 200, true, 'Media deleted successfully');
  } catch (error) {
    console.error('Delete media error:', error);
    sendResponse(res, 500, false, 'Error deleting media');
  }
};

export const getMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id).populate('uploadedBy', 'username email');

    if (!media) {
      return sendResponse(res, 404, false, 'Media not found');
    }

    sendResponse(res, 200, true, 'Media retrieved successfully', media);
  } catch (error) {
    console.error('Get media error:', error);
    sendResponse(res, 500, false, 'Error fetching media');
  }
};
