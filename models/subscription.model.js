import mongoose from "mongoose";

const SubscriptionModel=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:100,
        trim:true
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
        min:[0,'Price must be greater than 0'],
    },
    currency:{
        type:String,
        required:[true,'Currency is required'],
        enum:['INR','USD','EUR','GBP'],
        trim:true,
        default:'INR'
    },
    frequency:{
        type:String,
        required:[true,'Frequency is required'],
        enum:['daily','weekly','monthly','yearly'],
        default:'monthly'
    },
    category:{
        type:String,
        enum:['Entertainment','Utilities','Food','Travel','Health'],
        required:true,
    },
    payment:{
        type:String,
        enum:['Credit Card','Debit Card','PayPal','UPI'],
        required:true,
        default:'Credit Card'
    },
    status:{
        type:String,
        enum:['active','inactive','paused'],
        default:'active',
        required:true,
    },
    startDate:{
        type:Date,
        required:[true,'Start date is required'],
        validate:{
            validator:function(value){
                return value<new Date();
            },
            message:'Start date must be in the past'
        }
    },
    renewalDate:{
        type:Date,
        // required:[true,'Renewal date is required'],
        validate:{
            validator:function (value) {
                return value > this.startDate;
            },
            message:'Renewal date must be after start date'
        }
    },
    user:{  
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'User is required'],
        index:true 
    }
},{timestamps:true})

SubscriptionModel.pre("save",function(next){
    if (typeof this.startDate === 'string') {
        this.startDate = new Date(this.startDate);
    }

    if(!this.renewalDate){
        const renewalPeriod={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        }
        this.renewalDate=new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriod[this.frequency])
    }
    if(this.renewalDate<new Date()){
        this.status='inactive'
    }
    next()
})
const Subscription=mongoose.model("Subscription",SubscriptionModel)

export default Subscription