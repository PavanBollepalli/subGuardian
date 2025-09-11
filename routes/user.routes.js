import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
const userRouter = Router()

userRouter.get("/", getUsers)

userRouter.get("/:id", getUser)


userRouter.post("/", (req, res) => {
    res.send({ message: "CREATE new user" })
})


userRouter.put("/:id", (req, res) => {
    res.send({ message: "UPDATE user by id" })
})


userRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE user by id" })
})

export default userRouter