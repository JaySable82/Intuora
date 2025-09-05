import mongoose from "mongoose";

const rawMaterialSchema=new mongoose.Schema({
    name:String,
    unit:String,
    quantity:Number,
    threshold:Number
});

const rawMaterialModel=mongoose.model("rawMaterialModel",rawMaterialSchema);

export default rawMaterialModel;