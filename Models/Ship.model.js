const mongoose=require('mongoose');

const shipSchema=new mongoose.Schema({
    orderProduct:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order'
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'out For Delivery'],
            default: 'pending' // Set default status as 'pending'
        }
    
},{timestamps:true})

const Ship=mongoose.model('Ship',shipSchema);

module.exports=Ship;