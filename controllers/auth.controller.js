import mongoose from "mongoose";
import User from "../models/user.model.js";
export const signIn=async (req,res,next)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        // signin logic here
        const {name,email,password}=req.body
        const userExists=await User.findOne({email})
        if(userExists){
            throw new Error("User already exists")
            error.statusCode=409;
            throw error
        }
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        next(error)
    }
}

export const signUp=(req,res,next)=>{
    res.send("Sign Up")
}

export const signOut=(req,res,next)=>{
    res.send("Sign Out")
}