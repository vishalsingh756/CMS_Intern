import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting', 'note', 'site_visit'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    date: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    outcome: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'pending'],
      default: 'pending',
    },
    nextFollowUp: Date,
    attachments: [String],
  },
  { timestamps: true }
);

// Create indexes
interactionSchema.index({ client: 1, date: -1 });
interactionSchema.index({ createdBy: 1 });
interactionSchema.index({ type: 1 });

export default mongoose.model('Interaction', interactionSchema);
