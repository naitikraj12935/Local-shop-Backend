const express=require('express');
const PaymentRoute=express.Router();
const {checkout,paymentVerification,RefundMoney}=require('../controller/Payment.controller')

PaymentRoute
.route('/checkout')
.post(checkout)


PaymentRoute
 .route('/paymentVerification')
 .post(paymentVerification)

PaymentRoute
 .route('/refund')
 .post(RefundMoney) 



module.exports=PaymentRoute;