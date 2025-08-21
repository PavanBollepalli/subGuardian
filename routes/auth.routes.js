import { Router } from "express";

export const authRouter = Router()
authRouter.get("/sign-up", (req, res) => {
    res.send({ message: "signup route working" })
})

authRouter.get("/sign-in", (req, res) => {
    res.send({ message: "signin route working" })
})

authRouter.get("/sign-out", (req, res) => {
    res.send({ message: "signout route working" })
})