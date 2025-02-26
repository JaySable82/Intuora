import mongoose from "mongoose";

//{item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:100,unit_price:140,total_price:140},

const purchaseOrderSchema=new mongoose.Schema({
    item:String,
    vendor:String,
    invoice_no:String,
    quantity:Number,
    unit_price:Number,
    total_price:Number
});

const purchaseOrderModel=mongoose.model("purchaseOrder",purchaseOrderSchema);

export default purchaseOrderModel;