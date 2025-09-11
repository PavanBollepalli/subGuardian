import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js"
import User from "../models/user.model.js"

const authorize=async (req,res,next)=>{
    try{
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1]
        }
        if(!token){
            const error=new Error("Unauthorized access")
            error.statusCode=401
            throw error
        }
        const decoded=jwt.verify(token,JWT_SECRET)
        const user= await User.findById(decoded.userId).select("-password")
        if(!user){
            const error=new Error("User not found")
            error.statusCode=404
            throw error
        }
        req.userId=user._id
        next()
    }catch(error){
        res.status(401).json({message:"Unauthorized access",error:error.message})
    }
}
export default authorize