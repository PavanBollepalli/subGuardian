import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:2,
        maxlength:20,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/^\S+@\S+\.\S+$/, 'Email is not valid']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least 6 characters long'],
    }
},{timestamps:true})

const User=mongoose.model("User",UserSchema);

export default User;