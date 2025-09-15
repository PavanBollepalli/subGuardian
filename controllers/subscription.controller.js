import mongoose from "mongoose"
import Subscription from "../models/subscription.model.js"
import { workflowClient } from "../config/upstash.js"
import { SERVER_URL } from "../config/env.js"

export const createSubscription = async (req, res, next) => {
  console.log('createSubscription called with req.userId:', req.userId);
  console.log('Request body:', req.body);
  const session = await mongoose.startSession();
  let isCommitted = false;
  try {
    session.startTransaction();
    console.log('Transaction started');
    const subscription = await Subscription.create([{
      ...req.body,
      user: req.userId
    }], { session });
    console.log('Subscription created:', subscription[0]._id);
    await session.commitTransaction();
    isCommitted = true;
    console.log('Transaction committed');

    // Trigger workflow after commit
    console.log('Triggering workflow for subscriptionId:', subscription[0]._id);
    try {
      await workflowClient.trigger({
        url: `${SERVER_URL}/api/workflow/send-reminders`,
        body: { subscriptionId: subscription[0]._id },
        headers: {
          "content-type": "application/json"
        },
        retries: 0,
      });
      console.log('Workflow triggered successfully');
    } catch (triggerError) {
      console.error('Workflow trigger failed:', triggerError.message);
      // Optionally, don't throw here to avoid failing the subscription creation
    }

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription[0]
    });
  } catch (error) {
    console.error('Error in createSubscription:', error.message);
    if (!isCommitted) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session.endSession();
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

// update subscription by id
export const updateSubscriptionById=async(req,res,next)=>{
    const session = await mongoose.startSession()
    try{
        session.startTransaction()
        const subscription= await Subscription.findById(req.params.id)
        if(!subscription){
            let error=new Error("Subscription not found")
            error.status=404
            throw error
        }
        if(subscription.user.toString()!==req.userId.toString()){
            let error=new Error("You are not authorized to update this subscription")
            error.status=403
            throw error
        }
        const updatedSubscription= await subscription.set(req.body).save({ session })
        await session.commitTransaction()
        res.status(200).json({
            success:true,
            message:"Subscription updated successfully",
            data:updatedSubscription
        })
    }catch(error){
        next(error)
    }
}