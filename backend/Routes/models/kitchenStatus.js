import mongoose from "mongoose";

const KitchenStatusSchema=new mongoose.Schema({
    kitchenActive:Boolean
});

const KitchenStatusModel=mongoose.model('KitchenStatus',KitchenStatusSchema);

export default KitchenStatusModel;