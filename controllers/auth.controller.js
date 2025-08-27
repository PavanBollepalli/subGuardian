import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"
export const signUp= async(req,res,next)=>{
    const session = await mongoose.startSession()
    session.startTransaction()
    try{
        const {name,email,password} = req.body
        console.log(req.body)
        const existingUser=await User.findOne({email})
        if(existingUser){
            const error=new Error("User already exists")
            error.statusCode=400
            throw error
        }

        // hash password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await User.create([{name,email,password:hashedPassword}],{session})
        const token=jwt.sign({userId:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        console.log("User created successfully")
        await session.commitTransaction()
        session.endSession()
        res.status(201).json({success:true,
            message:"User created successfully",
            data:{
                token,
                user:{
                    id:newUser[0]._id,
                    email:newUser[0].email
                }
            }
        })
    }catch(error){
        console.error("Error creating user:", error)
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}
export const signOut= async(req,res,next)=>{}
export const signIn= async(req,res,next)=>{
    try{
        const {name,email,password}=req.body
        const existingUser=await User.findById(email)
        if(!existingUser){
            const error=new Error("User does not exist")
            error.statusCode=404
            throw error
        }
        const isPasswordCorrect=await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            const error=new Error("Invalid credentials")
            error.statusCode=401
            throw error
        }
        const token=jwt.sign({userId:existingUser._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                token,
                user:{
                    id:existingUser._id,
                    email:existingUser.email
                }
            }
        })
    }catch(error){
        console.log(error.message)
    }
}