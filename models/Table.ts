import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
  },
  qrCode: {
    identifier: String,
    dynamicUrl: String,
    staticImageUrl: String,
  },
  analytics: {
    totalScans: { type: Number, default: 0 },
    uniqueScans: { type: Number, default: 0 },
    lastScan: Date,
    scansByDate: [{
      date: Date,
      count: Number,
    }],
    scansByDevice: {
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
      desktop: { type: Number, default: 0 },
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
