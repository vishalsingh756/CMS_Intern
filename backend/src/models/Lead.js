import mongoose from 'mongoose';

const scoreFactorSchema = new mongoose.Schema({
  factor:  { type: String, enum: ['website_visit','email_open','form_submit','meeting','manual'], required: true },
  points:  { type: Number, required: true },
  note:    String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date:    { type: Date, default: Date.now },
}, { _id: false });

const leadSchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Name is required'], trim: true },
  company:     { type: String, trim: true },
  email:       { type: String, lowercase: true, trim: true },
  phone:       { type: String, trim: true },
  source:      { type: String, enum: ['website','referral','cold_call','social','email','trade_show','other'], default: 'other' },
  industry:    { type: String, trim: true },
  budget:      { type: Number, default: 0 },
  status:      { type: String, enum: ['new','contacted','qualified','unqualified','converted'], default: 'new' },
  score:       { type: Number, default: 0 },
  category:    { type: String, enum: ['hot','warm','cold'], default: 'cold' },
  scoreFactors:  [scoreFactorSchema],
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes:       { type: String, trim: true },
  tags:        [String],
  convertedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  convertedAt:   Date,
  lastContactedAt: Date,
  nextFollowUp:    Date,
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Auto-compute category from score
leadSchema.pre('save', function (next) {
  if (this.score >= 70)      this.category = 'hot';
  else if (this.score >= 40) this.category = 'warm';
  else                        this.category = 'cold';
  next();
});

leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ category: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
