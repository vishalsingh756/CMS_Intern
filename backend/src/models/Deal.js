import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a deal title'],
      trim: true,
      maxlength: 200,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide deal amount'],
    },
    probability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stage: {
      type: String,
      enum: ['prospect', 'negotiation', 'proposal', 'won', 'lost'],
      default: 'prospect',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expectedCloseDate: Date,
    actualCloseDate: Date,
    description: {
      type: String,
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    products: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

// Create indexes
dealSchema.index({ client: 1 });
dealSchema.index({ owner: 1 });
dealSchema.index({ stage: 1 });
dealSchema.index({ expectedCloseDate: 1 });

export default mongoose.model('Deal', dealSchema);
