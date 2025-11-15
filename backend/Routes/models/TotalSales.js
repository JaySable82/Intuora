// models/SalesSummary.js
import mongoose from 'mongoose';

const SalesSummarySchema = new mongoose.Schema({
  _id: { type: String, default: 'salesSummary' }, // we'll use a single doc with known id
  totalReceived: { type: Number, default: 0 },    // money received (sum of totals)
  lastUpdatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SalesSummary || mongoose.model('Sales', SalesSummarySchema);
