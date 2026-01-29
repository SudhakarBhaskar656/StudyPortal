const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId , ref:'User' , required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId , ref:'Course', required:true
    },
    isPurchased:{
        type:Boolean,
        default:true
    },
    purchasedAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Order',OrderSchema);