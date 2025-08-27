const errorMiddleWare=(err,req,res,next)=>{
    try{
        console.log("Iam the dangerrr")
        let error = {...err}
        error.message=err.message
        console.error(error)
        // mongoose bad objectid error
        if(err.name ==="CastError"){
            error.message="Invalid Object ID"
            error.statusCode=400
        }
        // mongoose duplicate key error
        if(err.code === 11000){
            error.message="Duplicate field value entered"
            error.statusCode=400
        }
        // mongoose validation error
        if(err.name==="ValidationError"){
            error.message=Object.values(err.errors).map(val=>val.message)
            error=new Error(error.message)
            error.statusCode=400
        }
        res.statusCode=error.statusCode || 500
        res.json({
            success:false,
            message:error.message || "Server Error"
        })
    }catch(error){
        next(error)
    }
}
export default errorMiddleWare