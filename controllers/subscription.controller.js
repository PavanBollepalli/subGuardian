import mongoose from "mongoose"
import Subscription from "../models/subscription.model.js"
export const createSubscription=async(req,res,next)=>{
    const session =await mongoose.startSession()
    try{
        session.startTransaction()
        const subscription = await Subscription.create([{
            ...req.body,
            user:req.userId
        }],{ session })

        await session.commitTransaction()

        res.status(201).json({
            success:true,
            message:"Subscription created successfully",
            data:subscription[0]
        })
    }catch(error){
        await session.abortTransaction()
        next(error)
    }finally{
        session.endSession()
    }
}
export const getAllSubscriptions=async(req,res,next)=>{
    try{
        const subscriptions=await Subscription.find({user:req.userId})
        res.status(200).json({
            success:true,
            message:"Subscriptions fetched successfully",
            data:subscriptions
        })
    }catch(error){
        next(error)
    }
}