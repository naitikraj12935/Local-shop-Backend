const OrderModel=require('../Models/Order.model');

const VerifybeforDelete=async (req,res,next)=>{
    try {
          const Products=await OrderModel.find({orderedProduct:req.body._id});

          if(Products)
          {
            return res.status(402).json({
                msg:'you cant delete this one you have recived orders on this one'
            })
          }
            next();
    } catch (error) {
        res.status(500).json({
            msg:error.msg
        })
    }
}

module.exports={VerifybeforDelete}