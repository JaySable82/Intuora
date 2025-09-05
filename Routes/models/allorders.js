import mongoose from 'mongoose';

const allOrdersSchema = new mongoose.Schema({
  tableNo: String,
  blockNo: String,
  orders: {
    items: [{
        id: Number,
        marathi: String,
        name: String,
        price: Number,
        quantity: Number,
        parcel: { type: Boolean, default: false },
        bottle: { type: Number, default: 0 }
    }],
    total: { type: Number, required: true },
  }
});

export default mongoose.model('AllOrders', allOrdersSchema);
