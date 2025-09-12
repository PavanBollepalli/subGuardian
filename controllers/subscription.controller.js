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
            data:subscription
        })
    }catch(error){
        await session.abortTransaction()
        next(error)
    }finally{
        await session.endSession()
    }
}