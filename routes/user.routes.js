import { Router } from "express";

const userRouter = Router()

userRouter.get("/", (req, res) => {
    res.send({ message: "GET all users" })
})


userRouter.get("/:id", (req, res) => {
    res.send({ message: `GET data for the user ${req.body.id} ` })
})


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