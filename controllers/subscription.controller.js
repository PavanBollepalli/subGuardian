import mongoose from "mongoose"
import Subscription from "../models/subscription.model.js"
import { workflowClient } from "../config/upstash.js"
import { SERVER_URL } from "../config/env.js"
export const createSubscription=async(req,res,next)=>{
    const session =await mongoose.startSession()
    try{
        session.startTransaction()
        const subscription = await Subscription.create([{
            ...req.body,
            user:req.userId
        }],{ session })
        await session.commitTransaction()
        await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminders`,
            body:{subscriptionId:subscription[0]._id},
            headers:{
                "content-type":"application/json"
            },
            retries:0,
        })
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
export const getSubscriptionById=async(req,res,next)=>{
    try{
        const subscription =await Subscription.findById(req.params.id)
        if(!subscription){
            const error=new Error("Subscription not found")
            error.status=404
            throw error
        }
        console.log("subscription.user:", subscription.user);
console.log("req.userId:", req.userId);
console.log("Types:", typeof subscription.user, typeof req.userId); 
        if(subscription.user.toString()!==req.userId.toString()){
            const error=new Error("You are not authorized to view this subscription")
            error.status=403
            throw error
        }
        res.status(200).json({
            success:true,
            message:"Subscription fetched successfully",
            data:subscription
        })
    }
    catch(error){
        next(error)
    }
}