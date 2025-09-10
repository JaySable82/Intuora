import mongoose from "mongoose";

const AdminDashboardOrderSchema=new mongoose.Schema({
    tableNo:Number,
    seatNo:Number,
    orders:{
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
            token: { type: Number, required: true },
            parcel: { type: Boolean, default: false }
        }
});

const AdminDashboardOrdersModel=mongoose.model('AdminDashboardOrders',AdminDashboardOrderSchema);

export default AdminDashboardOrderSchema;