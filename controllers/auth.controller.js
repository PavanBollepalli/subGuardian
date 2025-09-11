import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp=async (req,res,next)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        // signin logic here
        const {name,email,password}=req.body
        if(!password){
            const error=new Error("Password is required")
            error.statusCode=400
            throw error
        }
        const userExists=await User.findOne({email})
        if(userExists){
            const error=new Error("User already exists")
            error.statusCode=409;
            throw error
        }
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUsers = await User.create([{name,email,password:hashedPassword}],{session})
        // jwt token generation
        const token=jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        res.status(201).json({
            message:"User created successfully",
            data:{
                token,
                user:newUsers[0]
            }
        })
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        next(error)
    }finally{
        session.endSession()
    }
}

export const signIn=async (req,res,next)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        const {email,password}=req.body
        const user= await User.findOne({email})

        if (!user){
            const error=new Error("Email doesn't exist")
            error.statusCode=400
            throw error
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            const error =new Error("Invalid Password")
            error.statusCode=401
            throw error
        }

        // generate jwt token
        const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        const userWithoutPassword=user.toObject()
        delete userWithoutPassword.password
        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                token,
                user:userWithoutPassword
            }
        })
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        next(error)
    }finally{
        session.endSession()
    }
}

export const signOut=(req,res,next)=>{
    res.send("Sign Out")
}