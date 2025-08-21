import express from "express";
import { PORT } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./subscription.routes.js";

const app = express()

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/subs", subscriptionRouter)

app.get("/", (req, res) => {
    res.send("Welcome to Subscription Tracker API")
})

app.listen(PORT, () => {
    console.log(`Subscription Tracker Live at http://localhost:${PORT}`)
})

export default app