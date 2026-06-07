import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content:    { type: String, required: true },
  entityType: { type: String, enum: ['client','deal','task'], required: true },
  entityId:   { type: mongoose.Schema.Types.ObjectId, required: true },
  isPinned:   { type: Boolean, default: false },
  mentions:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments:[String],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

noteSchema.index({ entityType: 1, entityId: 1 });
noteSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model('Note', noteSchema);
