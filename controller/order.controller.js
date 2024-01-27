const OrderModel=require('../Models/Order.model')
const ProductModel=require('../Models/Product.model')

const submmitOrder=async(req,res,next)=>{
    try {
        const order=await OrderModel.create(req.body);
         
        if(!order)
        {
            res.status(401).json({
                status:'fail',
                msg:'please enter amount lesser than stock or please relogin'
            })
        }

        res.status(200).json({
            status:'ok',
            order:order
        })

        
       

    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:error.message
          })
    }
}


const CancelOrder=async(req,res)=>{
    try {
        console.log(req.body._id);
        const Order= await OrderModel.findByIdAndDelete(req.body._id);

        const Product=await ProductModel.findById(Order.orderedProduct);
        Product.stock=Product.stock+Order.orderedQuantity;
        Product.save({ validateBeforeSave: false });

        res.status(200).json({
            status:'ok',
            msg:'successfully canceled',
            Order:Order
        })

    } catch (error) {
        res.status(500).json({
            staus:'fail',
            msg:'server error'
        })
    }
}


const findOrderbyUser=async (req,res)=>{
    try {
        console.log(req.body.userId)
        const YourOrder=await OrderModel.find({orderedUser:req.body.userId}).populate('orderedProduct','productName productImage1 productImage2').exec();

          if(!YourOrder)
          {
            res.status(200).json({
                status:'0k',
                msg:'you have not do any order or if you do the please relogin'
            })
          }
          res.status(200).json({
            status:'ok',
            orders:YourOrder
          })
    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:error.message
        })
    }
}

const findOrderbyOwner=async (req,res)=>{
    try {
        console.log(req.body.Owner)
        const products = await ProductModel.find({ createdBy: req.body.Owner });

       
        const orderIds = products.map(product => product._id);
        
        const orders = await OrderModel.find({
            'orderedProduct': { $in: orderIds }
        }).populate('orderedProduct').populate('orderedUser');
        console.log(orders);

        res.status(200).json({
            status:'ok',
            Orders:orders
        })

        
    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:'server error'
        })
    }
}

const UpdateStatus=async (req,res)=>{
    try {
        console.log(req.body);
        const saved=await OrderModel.findById(req.body._id);
        saved.status=req.body.status;
        saved.save({validateBeforeSave:false})

        console.log(saved);
      
        res.status(200).json({
            status:'ok',
            Order:saved
        })
    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:'server error'
        })
    }
}

const findTopProduct=async(req,res)=>{
     try{

     
    const result = await OrderModel.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'orderedProduct',
            foreignField: '_id',
            as: 'pro',
          },
        },
        {
          $addFields: {
            Product_details: {
              $arrayElemAt: ['$pro', 0],
            },
          },
        },
  
      
       {
          $group: {
            _id: {
              category: '$orderedProduct',
            },
             productCategory:{
             $push:'$Product_details.productCategory' 
            },
            products: {
              $push: '$Product_details',
            },
           
            totalQuantitySold: { $sum: '$orderedQuantity' },
            totalOrders: { $sum: 1 },
          },
        },
   
      
        {
          $project: {
            _id: 0,
            category: '$_id.category',
            products: 1,
            totalQuantitySold: 1,
            totalOrders: 1,
          },
        },
       {
      $unwind: {
        path: "$products",
        
      }
    },
    {
      $group: {
        _id: '$category',
        category_ordered: {
          $sum:1
        }
      }
     },
    {
      $addFields: {
        newid:"$_id" 
      }
    },
     {
          $lookup: {
            from: 'products',
            localField: 'newid',
            foreignField: '_id',
            as: 'pro',
          },
        },
    {
      $unwind: {
        path: "$pro",
        
      }
    },
    {
      $group: {
        _id: "$pro.productCategory",
        showdata:{
          $push:"$pro"
        }
        
      }
    }
    
      ]);
  
      console.log('Top Order Products by Category:', result);
      res.status(200).json({
        result
      })
    } catch (error) {
      console.error('Error finding top order products by category:', error);
    }
  }


  



module.exports={submmitOrder,CancelOrder,findOrderbyUser,findOrderbyOwner,UpdateStatus,findTopProduct};