import { Router } from "express";
import signupController from "../controllers/auth.controller.js";
export const authRouter = Router()
authRouter.get("/sign-up", signupController)

authRouter.get("/sign-in", (req, res) => {
    res.send({ message: "signin route working" })
})

authRouter.get("/sign-out", (req, res) => {
    res.send({ message: "signout route working" })
})