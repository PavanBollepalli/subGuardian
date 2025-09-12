import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getAllSubscriptions,getSubscriptionById } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

// create a subscription
subscriptionRouter.post('/', authorize, createSubscription)

// get all subscriptions for a user
subscriptionRouter.get('/', authorize, getAllSubscriptions)

// get subscriptions by id and also check if the user is the owner
subscriptionRouter.get('/:id',authorize, getSubscriptionById)

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: "put all subscriptions" })
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({ title: "Get user subscriptions with the given id" })
})

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ title: "cancel subscriptions" })
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: "delete subscription" })
})

export default subscriptionRouter