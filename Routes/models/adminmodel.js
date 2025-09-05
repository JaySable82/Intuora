import mongoose from "mongoose";
import { type } from "os";

const AdminSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
});

const AdminModel=mongoose.model('Admin',AdminSchema);

export default AdminModel;