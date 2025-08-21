import { Router } from "express";

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => {
    res.send({ title: "Get all subscriptions" })
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: "Get subscriptions by id" })
})

subscriptionRouter.post('/', (req, res) => {
    res.send({ title: "CREATE subscriptions" })
})

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: "put all subscriptions" })
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({ title: "Get all users subscriptions" })
})

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ title: "cancel subscriptions" })
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: "delete subscription" })
})

export default subscriptionRouter