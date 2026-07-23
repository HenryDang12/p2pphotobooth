import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},

}, {timestamps: true});

const userModel = mongoose.models.user || mongoose.model("user", userSchema) ;
export default userModel;