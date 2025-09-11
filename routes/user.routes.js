import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import authorize  from "../middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.get("/",authorize, getUsers)

userRouter.get("/:id",authorize, getUser)

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