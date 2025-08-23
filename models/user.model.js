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
        required:true,
        lowerCase:true,
        match:[/\S+@\S+\.\S+/,"please fill a valid email address"]
    }
},{timestamps:true})

const User=mongoose.model("User",UserSchema);

export default User;