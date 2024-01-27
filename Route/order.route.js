const express=require('express')
const OrderRoute=express.Router();
const {submmitOrder,CancelOrder,findOrderbyUser,findOrderbyOwner,UpdateStatus,findTopProduct}=require('../controller/order.controller')

OrderRoute
 .route('/product/order')
 .post(submmitOrder)

 OrderRoute
 .route('/product/order/cancel')
 .post(CancelOrder)

 OrderRoute
 .route('/product/order/all')
 .post(findOrderbyUser)

 OrderRoute
 .route('/recieved/order')
 .post(findOrderbyOwner)

 OrderRoute
 .route('/save/staus')
 .post(UpdateStatus)

 OrderRoute
 .route('/top/product')
 .get(findTopProduct)


 module.exports=OrderRoute;