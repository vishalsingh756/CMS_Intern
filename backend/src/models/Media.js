import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'video', 'document', 'audio', 'other'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    usedInPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    folder: {
      type: String,
      default: 'general',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
