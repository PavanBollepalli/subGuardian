import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, { requested: 1 });
        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ message: "Too Many Requests - Rate limit exceeded" });
            }
            if(decision.reason.isBot()){
                return res.status(403).json({ message: "Forbidden - Bot traffic detected" });
            }
            return res.status(403).json({ message: "Forbidden - Access denied" });
        }
        next();
    }catch(error){
        console.error("Arcjet Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export default arcjetMiddleware;