import mongoose from 'mongoose';

const filterSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { 
    type: String, 
    enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'between', 'in', 'is_empty', 'is_not_empty'],
    required: true 
  },
  value: mongoose.Schema.Types.Mixed,
  value2: mongoose.Schema.Types.Mixed // For 'between' operator
});

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a report name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    module: {
      type: String,
      enum: ['clients', 'deals', 'tasks', 'interactions'],
      required: [true, 'Please select a module for the report'],
    },
    chartType: {
      type: String,
      enum: ['table_only', 'bar', 'pie', 'line', 'funnel'],
      default: 'table_only',
    },
    columns: [{
      type: String, // Field names to include
      required: true
    }],
    filters: [filterSchema],
    groupBy: {
      type: String, // Field to group by (for charts)
      default: null,
    },
    aggregateBy: {
      field: { type: String, default: null },
      function: {
        type: String,
        enum: ['sum', 'avg', 'count', 'min', 'max', null],
        default: 'count',
      }
    },
    sortBy: {
      field: String,
      order: {
        type: String,
        enum: ['asc', 'desc'],
        default: 'asc'
      }
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
