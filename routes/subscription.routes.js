import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getAllSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()
// get all subscriptions for a user
subscriptionRouter.get('/', authorize, getAllSubscriptions)

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: "Get subscriptions by id" })
})
// create a subscription
subscriptionRouter.post('/', authorize, createSubscription)

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