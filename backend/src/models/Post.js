import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
      maxlength: 200,
    },
    contactName: {
      type: String,
      required: [true, 'Please provide a contact name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    industry: {
      type: String,
      enum: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other', null, ''],
      default: undefined,
    },
    status: {
      type: String,
      enum: ['prospect', 'active', 'inactive', 'lost'],
      default: 'prospect',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    lastContact: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Cold Call', 'Email', 'Social Media', 'Other', null, ''],
      default: undefined,
    },
    website: String,
    annualRevenue: Number,
    employeeCount: Number,
  },
  { timestamps: true }
);

// Create indexes for faster queries
clientSchema.index({ companyName: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ assignedTo: 1 });
clientSchema.index({ createdAt: -1 });

export default mongoose.model('Client', clientSchema);
