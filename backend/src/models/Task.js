import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: 200,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedAt: Date,
    remindBefore: {
      type: Number,
      default: 24,
      description: 'Remind before X hours',
    },
  },
  { timestamps: true }
);

// Create indexes
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ client: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });

export default mongoose.model('Task', taskSchema);
