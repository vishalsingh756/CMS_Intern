import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'create_client',
        'edit_client',
        'delete_client',
        'create_interaction',
        'edit_interaction',
        'delete_interaction',
        'create_deal',
        'edit_deal',
        'delete_deal',
        'win_deal',
        'lose_deal',
        'create_task',
        'complete_task',
        'delete_task',
        'create_user',
        'edit_user',
        'delete_user',
        'login',
        'logout',
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['client', 'interaction', 'deal', 'task', 'user'],
    },
    entityId: mongoose.Schema.Types.ObjectId,
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Create index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
