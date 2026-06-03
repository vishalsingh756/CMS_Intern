import Note from '../models/Note.js';
import { sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createNote = async (req, res) => {
  try {
    const { content, entityType, entityId, mentions, attachments } = req.body;

    const note = new Note({
      content,
      entityType,
      entityId,
      mentions: mentions || [],
      attachments: attachments || [],
      createdBy: req.user._id,
    });

    await note.save();
    await note.populate('createdBy', 'username email firstName lastName');
    await note.populate('mentions', 'username email firstName lastName');

    await logActivity(req.user._id, 'create_note', entityType, entityId, { noteId: note._id }, req);
    sendResponse(res, 201, true, 'Note created successfully', note);
  } catch (error) {
    console.error('Create note error:', error);
    sendResponse(res, 500, false, 'Error creating note');
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, mentions, attachments, isPinned } = req.body;

    const note = await Note.findById(id);
    if (!note) return sendResponse(res, 404, false, 'Note not found');

    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this note');
    }

    if (content !== undefined) note.content = content;
    if (mentions !== undefined) note.mentions = mentions;
    if (attachments !== undefined) note.attachments = attachments;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    await note.populate('createdBy', 'username email firstName lastName');
    await note.populate('mentions', 'username email firstName lastName');

    sendResponse(res, 200, true, 'Note updated successfully', note);
  } catch (error) {
    console.error('Update note error:', error);
    sendResponse(res, 500, false, 'Error updating note');
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return sendResponse(res, 404, false, 'Note not found');

    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this note');
    }

    await Note.findByIdAndDelete(id);

    sendResponse(res, 200, true, 'Note deleted successfully');
  } catch (error) {
    console.error('Delete note error:', error);
    sendResponse(res, 500, false, 'Error deleting note');
  }
};

export const getNotes = async (req, res) => {
  try {
    const { entityType, entityId } = req.query;
    if (!entityType || !entityId) {
      return sendResponse(res, 400, false, 'entityType and entityId are required');
    }

    const notes = await Note.find({ entityType, entityId })
      .populate('createdBy', 'username email firstName lastName')
      .populate('mentions', 'username email firstName lastName')
      .sort({ isPinned: -1, createdAt: -1 });

    sendResponse(res, 200, true, 'Notes retrieved successfully', notes);
  } catch (error) {
    console.error('Get notes error:', error);
    sendResponse(res, 500, false, 'Error fetching notes');
  }
};

export const togglePinNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return sendResponse(res, 404, false, 'Note not found');

    note.isPinned = !note.isPinned;
    await note.save();

    sendResponse(res, 200, true, note.isPinned ? 'Note pinned successfully' : 'Note unpinned successfully', note);
  } catch (error) {
    console.error('Toggle pin note error:', error);
    sendResponse(res, 500, false, 'Error toggling pin status');
  }
};

export default {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
  togglePinNote,
};
