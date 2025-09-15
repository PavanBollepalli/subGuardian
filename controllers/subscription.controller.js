import mongoose from "mongoose"
import Subscription from "../models/subscription.model.js"
import { workflowClient } from "../config/upstash.js"
import { SERVER_URL } from "../config/env.js"

export const createSubscription = async (req, res) => {
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
    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminders`,
      body: { subscriptionId: subscription[0]._id },
      headers: {
        "content-type": "application/json"
      },
      retries: 0,
    });
    console.log('Workflow triggered successfully');

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
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.userId });
    res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data: subscriptions
    });
  } catch (error) {
    console.error('Error in getAllSubscriptions:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    console.log("subscription.user:", subscription.user);
    console.log("req.userId:", req.userId);
    console.log("Types:", typeof subscription.user, typeof req.userId);
    if (subscription.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this subscription" });
    }
    res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data: subscription
    });
  } catch (error) {
    console.error('Error in getSubscriptionById:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update subscription by id
export const updateSubscriptionById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    if (subscription.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this subscription" });
    }
    const updatedSubscription = await subscription.set(req.body).save({ session });
    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription
    });
  } catch (error) {
    console.error('Error in updateSubscriptionById:', error.message);
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// delete subscription by id
export const deleteSubscriptionById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    if (subscription.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this subscription" });
    }
    await Subscription.findByIdAndDelete(req.params.id, { session });
    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully"
    });
  } catch (error) {
    console.error('Error in deleteSubscriptionById:', error.message);
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};